import { NextResponse } from "next/server";
import {
  getServerCountdownState,
  dispatchServerCountdownAction,
} from "@/lib/countdown-server";
import { computeElapsedSeconds, CountdownAction } from "@/lib/countdown-sync";
import { TOTAL_HACKATHON_SECONDS } from "@/data/shift8";

export const dynamic = "force-dynamic";

export async function GET() {
  const serverTime = Date.now();
  const state = getServerCountdownState();
  const elapsedSeconds = computeElapsedSeconds(state, serverTime);
  const remainingSeconds = Math.max(0, TOTAL_HACKATHON_SECONDS - elapsedSeconds);

  return NextResponse.json(
    {
      state,
      serverTime,
      elapsedSeconds,
      remainingSeconds,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body?.action as CountdownAction;
    if (!action || typeof action.type !== "string") {
      return NextResponse.json({ error: "Missing or invalid action" }, { status: 400 });
    }

    const serverTime = Date.now();
    const state = dispatchServerCountdownAction(action, serverTime);
    const elapsedSeconds = computeElapsedSeconds(state, serverTime);
    const remainingSeconds = Math.max(0, TOTAL_HACKATHON_SECONDS - elapsedSeconds);

    return NextResponse.json(
      {
        state,
        serverTime,
        elapsedSeconds,
        remainingSeconds,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (err: unknown) {
    console.error("[api/countdown] Error handling POST:", err);
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
