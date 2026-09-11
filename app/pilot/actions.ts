"use server";

import { redirect } from "next/navigation";
import {
  createPilotParticipant,
  markSessionStarted,
  startTaskEvent,
  logAssistanceRequest,
  logTaskError,
  completeTaskEvent,
  submitSusAndSatisfaction,
  submitFinalFeedback,
  type PilotIntakeInput,
} from "@/lib/domain/pilot";
import type { TaskKey } from "@/lib/pilot/config";
import type { PilotCondition } from "@/lib/pilot/config";

export async function submitIntake(formData: FormData) {
  const input: PilotIntakeInput = {
    fullName: String(formData.get("fullName") ?? ""),
    contact: String(formData.get("contact") ?? ""),
    gender: formData.get("gender") as PilotIntakeInput["gender"],
    ageGroup: formData.get("ageGroup") as PilotIntakeInput["ageGroup"],
    language: formData.get("language") as PilotIntakeInput["language"],
    literacyLevel: formData.get("literacyLevel") as PilotIntakeInput["literacyLevel"],
    digitalExperience: formData.get("digitalExperience") as PilotIntakeInput["digitalExperience"],
  };

  if (!input.fullName.trim() || !input.contact.trim()) {
    return { success: false, error: "Please fill in your name and contact details." };
  }

  const result = await createPilotParticipant(input);
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

export async function submitSessionSurvey(
  participantCode: string,
  sessionId: string,
  orderPosition: number,
  susResponses: Record<number, number>,
  satisfactionScore: number
) {
  const result = await submitSusAndSatisfaction(sessionId, susResponses, satisfactionScore);
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
  preferredCondition: PilotCondition,
  comments: string
) {
  const result = await submitFinalFeedback(participantId, preferredCondition, comments);
  if (!result.success) return result;
  redirect(`/pilot/debrief?code=${participantCode}`);
}
