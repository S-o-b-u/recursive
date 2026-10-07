import fs from "fs";
import path from "path";
import { getCache } from "@vercel/functions";
import {
  CountdownSyncState,
  DEFAULT_COUNTDOWN_STATE,
  computeElapsedSeconds,
  applyCountdownAction,
  CountdownAction,
} from "./countdown-sync";
import { TOTAL_HACKATHON_SECONDS } from "@/data/shift8";

/**
 * Where the shared countdown lives.
 *
 * On one long-running server (`next dev`, `next start`) every request shares
 * this process's memory, and the JSON file carries the state over a restart.
 * Neither works on Vercel: each serverless instance has its own memory,
 * instances are started and recycled at will (a fresh one began at 08:00:00,
 * paused, so a Play pressed from one room could vanish for another), and the
 * filesystem is read-only. So there the state goes to a store every instance
 * shares, in this order:
 *
 *  - "redis": a Redis REST endpoint, when configured. Durable. Upstash Redis
 *    (Vercel Marketplace, free tier) sets KV_REST_API_URL / KV_REST_API_TOKEN;
 *    a database made on upstash.com gives UPSTASH_REDIS_REST_URL / _TOKEN.
 *  - "vercel-cache": otherwise, on Vercel, the Vercel Runtime Cache. Needs no
 *    setup, is shared by every instance in the region and survives deploys,
 *    but it is a cache: it evicts what has not been read lately, and this
 *    entry is read every second while any screen is open. Its client never
 *    throws: a failed read looks like an empty one, so an empty read keeps
 *    what this instance last saw instead of resetting the clock.
 *  - "memory": this process's memory + the JSON file (`next dev`, `next start`).
 *
 * COUNTDOWN_STORE=redis|vercel-cache|memory overrides the choice.
 */
const STATE_FILE_PATH = path.join(process.cwd(), ".countdown-state.json");
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const STORE_KEY = "recursive:countdown-state";
/** Long enough to outlast any gap between control presses; every write renews it. */
const CACHE_TTL_S = 14 * 24 * 3600;
/**
 * Every device polls every second or two. Within one instance, reads this
 * close together share a single store read; a change made through another
 * instance shows up here at most this late (the device that made it already
 * has it from its own POST).
 */
const SHARED_READ_TTL_MS = 700;

export type CountdownStore = "redis" | "vercel-cache" | "memory";
const onVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV || process.env.VERCEL_REGION);
const forced = process.env.COUNTDOWN_STORE as CountdownStore | undefined;
export const COUNTDOWN_STORE: CountdownStore =
  forced === "redis" || forced === "vercel-cache" || forced === "memory"
    ? forced
    : REDIS_URL && REDIS_TOKEN
      ? "redis"
      : onVercel
        ? "vercel-cache"
        : "memory";

declare global {
  // eslint-disable-next-line no-var
  var __countdown_state__: CountdownSyncState | undefined;
  // eslint-disable-next-line no-var
  var __countdown_read_at__: number | undefined;
}

function normalize(parsed: Partial<CountdownSyncState>, now: number): CountdownSyncState {
  return {
    isRunning: Boolean(parsed.isRunning),
    startTime: Number(parsed.startTime) || 0,
    accumulatedSeconds: Number(parsed.accumulatedSeconds) || 0,
    speed: Number(parsed.speed) || 1,
    forcedLunch: Boolean(parsed.forcedLunch),
    updatedAt: Number(parsed.updatedAt) || now,
    version: Number(parsed.version) || 1,
  };
}

function freshState(now: number): CountdownSyncState {
  return { ...DEFAULT_COUNTDOWN_STATE, startTime: now, updatedAt: now };
}

/** One Upstash REST command: POST ["GET", key] or ["SET", key, value]. */
async function redis(command: string[]): Promise<unknown> {
  const res = await fetch(REDIS_URL as string, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as { result?: unknown; error?: string } | null;
  if (!res.ok || !data || data.error) {
    throw new Error(`redis ${command[0]}: ${data?.error || "HTTP " + res.status}`);
  }
  return data.result;
}

// ── memory + file (one long-running server) ─────────────────────────────────

function loadFromFile(now: number): CountdownSyncState | undefined {
  try {
    if (!fs.existsSync(STATE_FILE_PATH)) return undefined;
    const loaded = normalize(JSON.parse(fs.readFileSync(STATE_FILE_PATH, "utf-8")), now);

    // If the timer was running when the state was saved, re-anchor it:
    // compute elapsed using the persisted startTime and snapshot it into
    // accumulatedSeconds, then update startTime to now. This prevents a
    // cold-start (server restart / HMR) from skipping time while the
    // process was down — real elapsed is preserved, but we avoid the case
    // where a very old startTime causes an immediate overflow to 28800 s.
    if (loaded.isRunning) {
      const restoredElapsed = computeElapsedSeconds(loaded, now);
      const capped = Math.min(TOTAL_HACKATHON_SECONDS, Math.max(0, restoredElapsed));
      loaded.accumulatedSeconds = capped;
      loaded.startTime = now;
      if (capped >= TOTAL_HACKATHON_SECONDS) {
        loaded.isRunning = false;
      }
    }
    return loaded;
  } catch (err) {
    console.error("[countdown-server] Failed to load persisted state:", err);
    return undefined;
  }
}

function saveToFile(state: CountdownSyncState) {
  try {
    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("[countdown-server] Failed to persist state to disk:", err);
  }
}

// ── the store ───────────────────────────────────────────────────────────────

async function readState(now: number): Promise<CountdownSyncState> {
  const cached = globalThis.__countdown_state__;
  if (COUNTDOWN_STORE === "redis") {
    if (cached && now - (globalThis.__countdown_read_at__ ?? 0) < SHARED_READ_TTL_MS) return cached;
    try {
      const raw = await redis(["GET", STORE_KEY]);
      const state = typeof raw === "string" ? normalize(JSON.parse(raw), now) : freshState(now);
      globalThis.__countdown_state__ = state;
      globalThis.__countdown_read_at__ = now;
      return state;
    } catch (err) {
      // Redis unreachable: answer with what this instance last saw rather than fail.
      console.error("[countdown-server] Redis read failed:", err);
      return cached ?? freshState(now);
    }
  }
  if (COUNTDOWN_STORE === "vercel-cache") {
    if (cached && now - (globalThis.__countdown_read_at__ ?? 0) < SHARED_READ_TTL_MS) return cached;
    const raw = (await getCache().get(STORE_KEY)) as Partial<CountdownSyncState> | null;
    globalThis.__countdown_read_at__ = now;
    if (raw && typeof raw === "object") {
      const state = normalize(raw, now);
      // never step back to an older version this instance has already served
      if (!cached || state.version >= cached.version) globalThis.__countdown_state__ = state;
      return globalThis.__countdown_state__ as CountdownSyncState;
    }
    // Empty: never written, or a read that failed (the client cannot tell
    // which). Keep what this instance last saw; only a brand-new instance
    // with nothing to go on starts from the default.
    if (!cached) globalThis.__countdown_state__ = freshState(now);
    return globalThis.__countdown_state__ as CountdownSyncState;
  }
  if (!globalThis.__countdown_state__) {
    globalThis.__countdown_state__ = loadFromFile(now) ?? freshState(now);
  }
  return globalThis.__countdown_state__;
}

async function writeState(state: CountdownSyncState): Promise<CountdownSyncState> {
  globalThis.__countdown_state__ = state;
  if (COUNTDOWN_STORE === "redis") {
    globalThis.__countdown_read_at__ = Date.now();
    // Throws when Redis is unreachable, so the caller can report that the
    // change did not reach the other devices.
    await redis(["SET", STORE_KEY, JSON.stringify(state)]);
  } else if (COUNTDOWN_STORE === "vercel-cache") {
    globalThis.__countdown_read_at__ = Date.now();
    await getCache().set(STORE_KEY, state, { ttl: CACHE_TTL_S, name: "countdown state" });
  } else {
    saveToFile(state);
  }
  return state;
}

export async function getServerCountdownState(): Promise<CountdownSyncState> {
  const now = Date.now();
  const state = await readState(now);

  // Check if countdown expired while running
  if (state.isRunning) {
    const elapsed = computeElapsedSeconds(state, now);
    if (elapsed >= TOTAL_HACKATHON_SECONDS) {
      const expiredState: CountdownSyncState = {
        ...state,
        isRunning: false,
        accumulatedSeconds: TOTAL_HACKATHON_SECONDS,
        startTime: now,
        updatedAt: now,
        version: nextVersion(state, now),
      };
      try {
        return await writeState(expiredState);
      } catch (err) {
        console.error("[countdown-server] Failed to store expired state:", err);
        return expiredState;
      }
    }
  }

  return state;
}

export async function dispatchServerCountdownAction(
  action: CountdownAction,
  serverNow: number = Date.now()
): Promise<CountdownSyncState> {
  // A control press must act on the latest state, not this instance's cached copy.
  globalThis.__countdown_read_at__ = 0;
  const currentState = await getServerCountdownState();
  const nextState = applyCountdownAction(currentState, action, serverNow);
  // Start on a running clock, Pause on a paused one: nothing to store.
  if (nextState === currentState) return currentState;
  return writeState({ ...nextState, version: nextVersion(currentState, serverNow) });
}

/**
 * Versions are server timestamps (ms), not a count: a store that was emptied
 * (an evicted cache entry, a new database) would restart a count at 1, and
 * every screen that had seen a higher number would ignore all changes after
 * that. A timestamp keeps growing whatever happened to the store.
 */
function nextVersion(state: CountdownSyncState, now: number): number {
  return Math.max(state.version + 1, now);
}
