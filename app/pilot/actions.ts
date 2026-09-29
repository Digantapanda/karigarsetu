"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  createPilotParticipant,
  markSessionStarted,
  startTaskEvent,
  logAssistanceRequest,
  logTaskError,
  completeTaskEvent,
  submitPostTaskBattery,
  submitFinalFeedback,
  getPilotSession,
  getPilotParticipantByCode,
  type PostTaskBatteryInput,
} from "@/lib/domain/pilot";
import { provisionOrResetDemoAccount } from "@/lib/domain/pilot-demo-account";
import { setActivePilotSession } from "@/lib/pilot/session-cookie";
import { LOCALE_COOKIE } from "@/lib/i18n/config";
import { INTERFACE_MODE_COOKIE } from "@/lib/interface-mode/config";
import type { TaskKey, PilotCondition } from "@/lib/pilot/config";

export async function submitIntake(formData: FormData) {
  const raw: Record<string, string> = {};
  formData.forEach((value, key) => {
    raw[key] = String(value);
  });

  if (!raw.fullName?.trim() || !raw.contact?.trim()) {
    return { success: false, error: "Please fill in your name and contact details." };
  }

  const result = await createPilotParticipant(raw);
  if (!result.success || !result.participantCode) {
    return { success: false, error: result.error ?? "Something went wrong." };
  }

  redirect(`/pilot/run/${result.participantCode}/1`);
}

export async function recordSessionStart(sessionId: string) {
  await markSessionStarted(sessionId);
}

/**
 * Called from the condition-intro screen's Continue button. Provisions
 * (or resets) the participant's demo craftsman account, points the real
 * app's own language/interface-mode cookies at this condition, sets the
 * active pilot-session cookie, logs Task 1 as started, and sends the
 * participant into the real /dashboard.
 */
export async function startPilotCondition(participantCode: string, orderPosition: number) {
  const [session, participant] = await Promise.all([
    getPilotSession(participantCode, orderPosition),
    getPilotParticipantByCode(participantCode),
  ]);

  if (!session || !participant) {
    return { success: false, error: "We couldn't find your session. Please contact the researcher." };
  }

  const demoAccount = await provisionOrResetDemoAccount(participant.id, participantCode, participant.fullName);
  if (!demoAccount.success) {
    return { success: false, error: demoAccount.error ?? "We couldn't set up your session." };
  }

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, session.language, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 });
  cookieStore.set(INTERFACE_MODE_COOKIE, session.condition === "TAI" ? "icon" : "text", {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });

  await setActivePilotSession({
    sessionId: session.sessionId,
    participantId: participant.id,
    participantCode,
    condition: session.condition,
    orderPosition: session.orderPosition,
    taskPosition: 1,
    locale: session.language,
  });

  await markSessionStarted(session.sessionId);
  await startTaskEvent(session.sessionId, "dashboard_view");

  redirect("/dashboard");
}

export async function recordTaskStart(sessionId: string, taskKey: TaskKey) {
  await startTaskEvent(sessionId, taskKey);
}

export async function recordAssistance(sessionId: string, taskKey: TaskKey) {
  await logAssistanceRequest(sessionId, taskKey);
}

export async function recordTaskError(sessionId: string, taskKey: TaskKey) {
  await logTaskError(sessionId, taskKey);
}

export async function recordTaskComplete(
  sessionId: string,
  taskKey: TaskKey,
  success: boolean,
  comprehensionCorrect: boolean
) {
  await completeTaskEvent(sessionId, taskKey, { success, comprehensionCorrect });
}

export async function submitPostTaskBatteryAction(
  participantCode: string,
  participantId: string,
  sessionId: string,
  orderPosition: number,
  battery: PostTaskBatteryInput
) {
  const result = await submitPostTaskBattery(sessionId, participantId, battery);
  if (!result.success) return result;

  if (orderPosition < 3) {
    redirect(`/pilot/run/${participantCode}/${orderPosition + 1}`);
  } else {
    redirect(`/pilot/final-feedback/${participantCode}`);
  }
}

export async function submitFinalFeedbackAction(
  participantId: string,
  participantCode: string,
  preferredCondition: PilotCondition | "no_preference",
  helpfulComponent: "text" | "audio" | "icons" | "combination" | "none",
  mostDifficultPart: string,
  whatWouldHelp: string
) {
  const result = await submitFinalFeedback(
    participantId,
    preferredCondition,
    helpfulComponent,
    mostDifficultPart,
    whatWouldHelp
  );
  if (!result.success) return result;
  redirect(`/pilot/debrief?code=${participantCode}`);
}
