"use server";

import { redirect } from "next/navigation";
import {
  createPilotParticipant,
  markSessionStarted,
  startTaskEvent,
  logAssistanceRequest,
  logTaskError,
  completeTaskEvent,
  submitPostTaskBattery,
  submitFinalFeedback,
  type PostTaskBatteryInput,
} from "@/lib/domain/pilot";
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
