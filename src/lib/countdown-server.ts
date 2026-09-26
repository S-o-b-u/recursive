import fs from "fs";
import path from "path";
import {
  CountdownSyncState,
  DEFAULT_COUNTDOWN_STATE,
  computeElapsedSeconds,
  applyCountdownAction,
  CountdownAction,
} from "./countdown-sync";
import { TOTAL_HACKATHON_SECONDS } from "@/data/shift8";

const STATE_FILE_PATH = path.join(process.cwd(), ".countdown-state.json");

declare global {
  // eslint-disable-next-line no-var
  var __countdown_state__: CountdownSyncState | undefined;
}

export function getServerCountdownState(): CountdownSyncState {
  const now = Date.now();

  if (!globalThis.__countdown_state__) {
    try {
      if (fs.existsSync(STATE_FILE_PATH)) {
        const fileData = fs.readFileSync(STATE_FILE_PATH, "utf-8");
        const parsed = JSON.parse(fileData) as Partial<CountdownSyncState>;
        globalThis.__countdown_state__ = {
          isRunning: Boolean(parsed.isRunning),
          startTime: Number(parsed.startTime) || 0,
          accumulatedSeconds: Number(parsed.accumulatedSeconds) || 0,
          speed: Number(parsed.speed) || 1,
          forcedLunch: Boolean(parsed.forcedLunch),
          updatedAt: Number(parsed.updatedAt) || now,
          version: Number(parsed.version) || 1,
        };
      }
    } catch (err) {
      console.error("[countdown-server] Failed to load persisted state:", err);
    }

    if (!globalThis.__countdown_state__) {
      globalThis.__countdown_state__ = {
        ...DEFAULT_COUNTDOWN_STATE,
        startTime: now,
        updatedAt: now,
      };
    }
  }

  // Check if countdown expired while running
  const state = globalThis.__countdown_state__;
  if (state.isRunning) {
    const elapsed = computeElapsedSeconds(state, now);
    if (elapsed >= TOTAL_HACKATHON_SECONDS) {
      const expiredState: CountdownSyncState = {
        ...state,
        isRunning: false,
        accumulatedSeconds: TOTAL_HACKATHON_SECONDS,
        startTime: now,
        updatedAt: now,
        version: state.version + 1,
      };
      setServerCountdownState(expiredState);
      return expiredState;
    }
  }

  return state;
}

export function setServerCountdownState(newState: CountdownSyncState): CountdownSyncState {
  globalThis.__countdown_state__ = newState;
  try {
    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(newState, null, 2), "utf-8");
  } catch (err) {
    console.error("[countdown-server] Failed to persist state to disk:", err);
  }
  return newState;
}

export function dispatchServerCountdownAction(
  action: CountdownAction,
  serverNow: number = Date.now()
): CountdownSyncState {
  const currentState = getServerCountdownState();
  const nextState = applyCountdownAction(currentState, action, serverNow);
  return setServerCountdownState(nextState);
}
