import { NextResponse } from "next/server";
import {
  getServerCountdownState,
  dispatchServerCountdownAction,
  COUNTDOWN_STORE,
} from "@/lib/countdown-server";
import { computeElapsedSeconds, CountdownAction, CountdownSyncState } from "@/lib/countdown-sync";
import { TOTAL_HACKATHON_SECONDS } from "@/data/shift8";

export const dynamic = "force-dynamic";

const NO_STORE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

/**
 * `store` says where the shared state lives: "redis" (every device and every
 * server instance agrees) or "memory" (this one server process only; fine for
 * `next dev` / `next start`, not for Vercel, see src/lib/countdown-server.ts).
 */
function payload(state: CountdownSyncState, serverTime: number) {
  const elapsedSeconds = computeElapsedSeconds(state, serverTime);
  return {
    state,
    serverTime,
    elapsedSeconds,
    remainingSeconds: Math.max(0, TOTAL_HACKATHON_SECONDS - elapsedSeconds),
    store: COUNTDOWN_STORE,
  };
}

export async function GET() {
  const state = await getServerCountdownState();
  return NextResponse.json(payload(state, Date.now()), { headers: NO_STORE });
}

export async function POST(request: Request) {
  let action: CountdownAction;
  try {
    const body = await request.json();
    action = body?.action as CountdownAction;
    if (!action || typeof action.type !== "string") {
      return NextResponse.json({ error: "Missing or invalid action" }, { status: 400 });
    }
  } catch (err: unknown) {
    console.error("[api/countdown] Error handling POST:", err);
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  try {
    const serverTime = Date.now();
    const state = await dispatchServerCountdownAction(action, serverTime);
    return NextResponse.json(payload(state, serverTime), { headers: NO_STORE });
  } catch (err: unknown) {
    // The shared store did not take the change: say so, rather than let this
    // device believe the other screens follow it.
    console.error("[api/countdown] Failed to store action:", err);
    return NextResponse.json({ error: "Countdown store unavailable" }, { status: 503, headers: NO_STORE });
  }
}
