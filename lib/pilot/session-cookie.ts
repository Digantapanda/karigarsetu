import { cookies } from "next/headers";
import type { PilotCondition, TaskKey } from "@/lib/pilot/config";
import type { Locale } from "@/lib/i18n/config";

// Non-httpOnly on purpose: the floating PilotTaskBanner reads this
// client-side (via document.cookie) to know which task instruction to
// show without an extra round trip. Contents are low-sensitivity (a
// session id, a condition code, a task position) -- nothing here is a
// credential.
const PILOT_ACTIVE_COOKIE = "pilot_active";
// Separate, tiny client-readable flag so the voice layer can disable
// itself entirely for condition T (text-only, no audio) without needing
// to parse the full session JSON on every speak()/recognize() call.
const PILOT_VOICE_OFF_COOKIE = "pilot_voice_off";

export interface ActivePilotSession {
  sessionId: string;
  participantId: string;
  participantCode: string;
  condition: PilotCondition;
  orderPosition: number;
  taskPosition: 1 | 2 | 3 | 4;
  locale: Locale;
}

const TASK_KEY_BY_POSITION: Record<1 | 2 | 3 | 4, TaskKey> = {
  1: "dashboard_view",
  2: "add_product",
  3: "share_profile",
  4: "view_orders",
};

export function taskKeyForPosition(position: 1 | 2 | 3 | 4): TaskKey {
  return TASK_KEY_BY_POSITION[position];
}

export async function getActivePilotSession(): Promise<ActivePilotSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(PILOT_ACTIVE_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as ActivePilotSession;
    if (!parsed.sessionId || !parsed.condition) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function setActivePilotSession(session: ActivePilotSession): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(PILOT_ACTIVE_COOKIE, encodeURIComponent(JSON.stringify(session)), {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 2, // 2 hours -- generous for one condition's worth of tasks
  });
  cookieStore.set(PILOT_VOICE_OFF_COOKIE, session.condition === "T" ? "1" : "0", {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 2,
  });
}

export async function updatePilotTaskPosition(newPosition: 1 | 2 | 3 | 4): Promise<ActivePilotSession | null> {
  const current = await getActivePilotSession();
  if (!current) return null;
  const updated: ActivePilotSession = { ...current, taskPosition: newPosition };
  await setActivePilotSession(updated);
  return updated;
}

export async function clearActivePilotSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(PILOT_ACTIVE_COOKIE);
  cookieStore.delete(PILOT_VOICE_OFF_COOKIE);
}
