import { TOTAL_HACKATHON_SECONDS } from "@/data/shift8";

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
  | { type: "set"; elapsedSeconds: number; forcedLunch?: boolean }
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
      const targetSec = Math.min(TOTAL_HACKATHON_SECONDS, Math.max(0, action.elapsedSeconds));
      return {
        ...currentState,
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
        if (currentElapsed < 12600 || currentElapsed > 15300) {
          newAccumulated = 12600;
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
