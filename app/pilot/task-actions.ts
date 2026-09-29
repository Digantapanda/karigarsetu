"use server";

import { advancePilotTaskIfActive } from "@/lib/pilot/task-hooks";
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
