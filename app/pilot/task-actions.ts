"use server";

import { advancePilotTaskIfActive } from "@/lib/pilot/task-hooks";
import { getActivePilotSession, taskKeyForPosition } from "@/lib/pilot/session-cookie";
import { logAssistanceRequest, logPilotPointerEventBatch, type PilotPointerEvent } from "@/lib/domain/pilot";
import type { TaskKey } from "@/lib/pilot/config";

/**
 * Thin public Server Action wrapper so client components anywhere in the
 * real app (not just under /pilot) can report "this pilot-relevant thing
 * happened" without importing server-only pilot internals directly.
 * Always safe to call -- see lib/pilot/task-hooks.ts for the no-op
 * behavior when there's no active pilot session.
 */
export async function reportPilotTask(taskKey: TaskKey) {
  await advancePilotTaskIfActive(taskKey);
}

/** Help button on the floating task banner -- logs against whichever task is currently active. */
export async function recordPilotAssistance() {
  const session = await getActivePilotSession();
  if (!session) return;
  await logAssistanceRequest(session.sessionId, taskKeyForPosition(session.taskPosition));
}

/**
 * Flushes a batch of client-collected pointer/touch events (position
 * samples, clicks, hover dwell, scroll) for the participant's current
 * task. No-op outside an active pilot session.
 */
export async function submitPilotPointerEventBatch(
  events: PilotPointerEvent[],
  batchStartedAt: string,
  batchEndedAt: string
) {
  const session = await getActivePilotSession();
  if (!session) return;
  await logPilotPointerEventBatch(
    session.sessionId,
    taskKeyForPosition(session.taskPosition),
    events,
    batchStartedAt,
    batchEndedAt
  );
}
