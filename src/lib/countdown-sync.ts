import { TOTAL_HACKATHON_SECONDS, LUNCH_SLOT } from "@/data/shift8";

export interface CountdownSyncState {
  isRunning: boolean;
  startTime: number;          // Epoch timestamp (ms) when current run started
  accumulatedSeconds: number; // Elapsed seconds accumulated prior to current run
  speed: number;              // 1, 10, 60, etc.
  forcedLunch: boolean;
  updatedAt: number;          // Epoch timestamp (ms) of last modification
  version: number;            // Incrementing revision number
}

export type CountdownAction =
  | { type: "start" }
  | { type: "pause" }
  | { type: "reset" }
  /**
   * Jump to a point in the day. `running` also starts or pauses the clock and
   * `speed` sets its rate, in the same change (Set time > "Set & resume"), so
   * no other screen sees a half-applied correction.
   */
  | { type: "set"; elapsedSeconds: number; forcedLunch?: boolean; running?: boolean; speed?: number }
  | { type: "speed"; speed: number }
  | { type: "toggleLunch" };

export const DEFAULT_COUNTDOWN_STATE: CountdownSyncState = {
  isRunning: false,
  startTime: 0,
  accumulatedSeconds: 0,
  speed: 1,
  forcedLunch: false,
  updatedAt: Date.now(),
  version: 1,
};

/**
 * Computes elapsed seconds with millisecond precision based on authoritative server state.
 */
export function computeElapsedSeconds(
  state: CountdownSyncState,
  serverNow: number = Date.now()
): number {
  if (!state.isRunning) {
    return Math.min(TOTAL_HACKATHON_SECONDS, Math.max(0, state.accumulatedSeconds));
  }
  const deltaMs = Math.max(0, serverNow - state.startTime);
  const elapsed = state.accumulatedSeconds + (deltaMs / 1000) * state.speed;
  return Math.min(TOTAL_HACKATHON_SECONDS, Math.max(0, elapsed));
}

/**
 * Transitions state based on a dispatched action, ensuring accumulated seconds are locked
 * whenever the timer stops or changes rate.
 */
export function applyCountdownAction(
  currentState: CountdownSyncState,
  action: CountdownAction,
  serverNow: number = Date.now()
): CountdownSyncState {
  const currentElapsed = computeElapsedSeconds(currentState, serverNow);

  switch (action.type) {
    case "start": {
      if (currentState.isRunning) return currentState;
      // If timer is already at the end, starting resets to beginning
      const startingElapsed = currentElapsed >= TOTAL_HACKATHON_SECONDS ? 0 : currentElapsed;
      return {
        ...currentState,
        isRunning: true,
        startTime: serverNow,
        accumulatedSeconds: startingElapsed,
        updatedAt: serverNow,
        version: currentState.version + 1,
      };
    }
    case "pause": {
      if (!currentState.isRunning) return currentState;
      return {
        ...currentState,
        isRunning: false,
        startTime: serverNow,
        accumulatedSeconds: currentElapsed,
        updatedAt: serverNow,
        version: currentState.version + 1,
      };
    }
    case "reset": {
      return {
        ...currentState,
        isRunning: false,
        startTime: serverNow,
        accumulatedSeconds: 0,
        forcedLunch: false,
        updatedAt: serverNow,
        version: currentState.version + 1,
      };
    }
    case "set": {
      const targetSec = Math.min(TOTAL_HACKATHON_SECONDS, Math.max(0, Number(action.elapsedSeconds) || 0));
      const running = typeof action.running === "boolean" ? action.running : currentState.isRunning;
      return {
        ...currentState,
        // a clock set to the very end has nothing left to run
        isRunning: running && targetSec < TOTAL_HACKATHON_SECONDS,
        speed: typeof action.speed === "number" && action.speed > 0 ? action.speed : currentState.speed,
        accumulatedSeconds: targetSec,
        startTime: serverNow,
        forcedLunch: action.forcedLunch !== undefined ? action.forcedLunch : currentState.forcedLunch,
        updatedAt: serverNow,
        version: currentState.version + 1,
      };
    }
    case "speed": {
      const newSpeed = action.speed > 0 ? action.speed : 1;
      return {
        ...currentState,
        accumulatedSeconds: currentElapsed,
        startTime: serverNow,
        speed: newSpeed,
        updatedAt: serverNow,
        version: currentState.version + 1,
      };
    }
    case "toggleLunch": {
      const nextForcedLunch = !currentState.forcedLunch;
      let newAccumulated = currentElapsed;
      if (nextForcedLunch) {
        // outside the lunch slot: jump to its start
        if (currentElapsed < LUNCH_SLOT.startSec || currentElapsed >= LUNCH_SLOT.endSec) {
          newAccumulated = LUNCH_SLOT.startSec;
        }
      }
      return {
        ...currentState,
        accumulatedSeconds: newAccumulated,
        startTime: serverNow,
        forcedLunch: nextForcedLunch,
        updatedAt: serverNow,
        version: currentState.version + 1,
      };
    }
    default:
      return currentState;
  }
}
