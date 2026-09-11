import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { SEQUENCES, type PilotCondition, type TaskKey } from "@/lib/pilot/config";
import { scoreSus } from "@/lib/pilot/sus";
import type { Locale } from "@/lib/i18n/config";

export interface PilotIntakeInput {
  fullName: string;
  contact: string;
  gender: "female" | "male" | "other" | "prefer_not_to_say";
  ageGroup: "18-30" | "31-50" | "51+";
  language: Locale;
  literacyLevel: "low" | "medium" | "high";
  digitalExperience: "low" | "medium" | "high";
}

export interface PilotActionResult {
  success: boolean;
  error?: string;
}

function generateParticipantCode(sequentialNumber: number): string {
  return `P-${String(sequentialNumber).padStart(4, "0")}`;
}

/**
 * Registers a new pilot participant, assigns one of the 6 counterbalanced
 * orderings via round-robin (participant N gets sequence N mod 6, which
 * spreads 60 or 72 participants perfectly evenly across all 6 sequences),
 * and creates the 3 pilot_sessions rows for their assigned order.
 */
export async function createPilotParticipant(
  input: PilotIntakeInput
): Promise<PilotActionResult & { participantCode?: string }> {
  const supabase = createServiceRoleClient();

  const { count, error: countError } = await supabase
    .from("pilot_participants")
    .select("id", { count: "exact", head: true });

  if (countError) {
    return { success: false, error: "We couldn't start the study. Please try again." };
  }

  const sequentialNumber = (count ?? 0) + 1;
  const sequenceIndex = (count ?? 0) % SEQUENCES.length;
  const participantCode = generateParticipantCode(sequentialNumber);

  const { data: participant, error } = await supabase
    .from("pilot_participants")
    .insert({
      participant_code: participantCode,
      full_name: input.fullName,
      contact: input.contact,
      gender: input.gender,
      age_group: input.ageGroup,
      language: input.language,
      literacy_level: input.literacyLevel,
      digital_experience: input.digitalExperience,
      sequence_index: sequenceIndex,
    })
    .select()
    .single();

  if (error || !participant) {
    return { success: false, error: "We couldn't start the study. Please try again." };
  }

  const sequence = SEQUENCES[sequenceIndex];
  const sessionRows = sequence.map((condition, i) => ({
    participant_id: participant.id,
    condition,
    order_position: i + 1,
  }));

  const { error: sessionsError } = await supabase.from("pilot_sessions").insert(sessionRows);
  if (sessionsError) {
    return { success: false, error: "We couldn't set up your session. Please try again." };
  }

  return { success: true, participantCode };
}

export interface PilotSessionInfo {
  sessionId: string;
  participantId: string;
  condition: PilotCondition;
  orderPosition: number;
  language: Locale;
}

/** Looks up a participant + one of their 3 sessions by code and position (1-3). */
export async function getPilotSession(
  participantCode: string,
  orderPosition: number
): Promise<PilotSessionInfo | null> {
  const supabase = createServiceRoleClient();

  const { data: participant } = await supabase
    .from("pilot_participants")
    .select("id, language")
    .eq("participant_code", participantCode)
    .maybeSingle();

  if (!participant) return null;

  const { data: session } = await supabase
    .from("pilot_sessions")
    .select("*")
    .eq("participant_id", participant.id)
    .eq("order_position", orderPosition)
    .maybeSingle();

  if (!session) return null;

  return {
    sessionId: session.id,
    participantId: participant.id,
    condition: session.condition,
    orderPosition: session.order_position,
    language: participant.language as Locale,
  };
}

export interface PilotParticipantLookup {
  id: string;
  language: Locale;
  sequenceIndex: number;
}

export async function getPilotParticipantByCode(participantCode: string): Promise<PilotParticipantLookup | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("pilot_participants")
    .select("id, language, sequence_index")
    .eq("participant_code", participantCode)
    .maybeSingle();

  if (!data) return null;
  return { id: data.id as string, language: data.language as Locale, sequenceIndex: data.sequence_index as number };
}

export async function markSessionStarted(sessionId: string): Promise<void> {
  const supabase = createServiceRoleClient();
  await supabase
    .from("pilot_sessions")
    .update({ started_at: new Date().toISOString() })
    .eq("id", sessionId)
    .is("started_at", null);
}

export async function startTaskEvent(sessionId: string, taskKey: TaskKey): Promise<PilotActionResult> {
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("pilot_task_events")
    .upsert(
      { session_id: sessionId, task_key: taskKey, started_at: new Date().toISOString() },
      { onConflict: "session_id,task_key", ignoreDuplicates: true }
    );
  if (error) return { success: false, error: "Could not start task." };
  return { success: true };
}

export async function logAssistanceRequest(sessionId: string, taskKey: TaskKey): Promise<void> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("pilot_task_events")
    .select("assistance_requests")
    .eq("session_id", sessionId)
    .eq("task_key", taskKey)
    .maybeSingle();

  await supabase
    .from("pilot_task_events")
    .update({ assistance_requests: (data?.assistance_requests ?? 0) + 1 })
    .eq("session_id", sessionId)
    .eq("task_key", taskKey);
}

export async function logTaskError(sessionId: string, taskKey: TaskKey): Promise<void> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("pilot_task_events")
    .select("error_count")
    .eq("session_id", sessionId)
    .eq("task_key", taskKey)
    .maybeSingle();

  await supabase
    .from("pilot_task_events")
    .update({ error_count: (data?.error_count ?? 0) + 1 })
    .eq("session_id", sessionId)
    .eq("task_key", taskKey);
}

export async function completeTaskEvent(
  sessionId: string,
  taskKey: TaskKey,
  input: { success: boolean; comprehensionCorrect: boolean }
): Promise<PilotActionResult> {
  const supabase = createServiceRoleClient();

  const { data: existing } = await supabase
    .from("pilot_task_events")
    .select("started_at")
    .eq("session_id", sessionId)
    .eq("task_key", taskKey)
    .maybeSingle();

  const completedAt = new Date();
  const timeMs = existing?.started_at
    ? completedAt.getTime() - new Date(existing.started_at).getTime()
    : null;

  const { error } = await supabase
    .from("pilot_task_events")
    .update({
      completed_at: completedAt.toISOString(),
      success: input.success,
      comprehension_correct: input.comprehensionCorrect,
      time_ms: timeMs,
    })
    .eq("session_id", sessionId)
    .eq("task_key", taskKey);

  if (error) return { success: false, error: "Could not save task result." };
  return { success: true };
}

export async function submitSusAndSatisfaction(
  sessionId: string,
  susResponses: Record<number, number>,
  satisfactionScore: number
): Promise<PilotActionResult> {
  const supabase = createServiceRoleClient();
  const susScore = scoreSus(susResponses);

  const { error } = await supabase
    .from("pilot_sessions")
    .update({
      sus_responses: susResponses,
      sus_score: susScore,
      satisfaction_score: satisfactionScore,
      completed_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) return { success: false, error: "Could not save your answers." };
  return { success: true };
}

export async function submitFinalFeedback(
  participantId: string,
  preferredCondition: PilotCondition,
  comments: string
): Promise<PilotActionResult> {
  const supabase = createServiceRoleClient();

  const { error } = await supabase.from("pilot_final_feedback").insert({
    participant_id: participantId,
    preferred_condition: preferredCondition,
    comments: comments || null,
  });

  if (error) return { success: false, error: "Could not save your feedback." };

  await supabase
    .from("pilot_participants")
    .update({ completed_at: new Date().toISOString() })
    .eq("id", participantId);

  return { success: true };
}

export interface PilotStats {
  totalParticipants: number;
  completedParticipants: number;
  perSequenceCounts: number[];
}

/** For the admin dashboard: quick health check on recruitment balance. */
export async function getPilotStats(): Promise<PilotStats> {
  const supabase = createServiceRoleClient();

  const { data: participants } = await supabase
    .from("pilot_participants")
    .select("sequence_index, completed_at");

  const rows = participants ?? [];
  const perSequenceCounts = new Array(SEQUENCES.length).fill(0);
  let completed = 0;

  for (const row of rows) {
    perSequenceCounts[row.sequence_index as number] += 1;
    if (row.completed_at) completed += 1;
  }

  return {
    totalParticipants: rows.length,
    completedParticipants: completed,
    perSequenceCounts,
  };
}
