import { completeTaskEvent, startTaskEvent } from "@/lib/domain/pilot";
import {
  getActivePilotSession,
  updatePilotTaskPosition,
  taskKeyForPosition,
} from "@/lib/pilot/session-cookie";
import type { TaskKey } from "@/lib/pilot/config";

const POSITION_FOR_TASK: Record<TaskKey, 1 | 2 | 3 | 4> = {
  dashboard_view: 1,
  add_product: 2,
  share_profile: 3,
  view_orders: 4,
};

/**
 * Call this from any real-app action that corresponds to a pilot task
 * (product creation, the profile mail-share button, order decisions).
 * It's always safe to call unconditionally -- if there's no active pilot
 * session, or the session's current task doesn't match, it does nothing.
 * This keeps pilot instrumentation out of the call sites' own logic: they
 * just say "this happened," and this decides whether it matters.
 */
export async function advancePilotTaskIfActive(completedTask: TaskKey): Promise<void> {
  const session = await getActivePilotSession();
  if (!session) return;
  if (session.taskPosition !== POSITION_FOR_TASK[completedTask]) return;

  await completeTaskEvent(session.sessionId, completedTask, { success: true });

  const nextPosition = session.taskPosition + 1;
  if (nextPosition <= 4) {
    await updatePilotTaskPosition(nextPosition as 1 | 2 | 3 | 4);
    await startTaskEvent(session.sessionId, taskKeyForPosition(nextPosition as 1 | 2 | 3 | 4));
  }
  // Position 4 (view_orders) completing is handled by the orders page
  // itself, which redirects to the post-task questionnaire once both
  // mock orders are decided -- see app/dashboard/orders/page.tsx.
}
