import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { SEQUENCES, type PilotCondition, type TaskKey } from "@/lib/pilot/config";
import { scoreSus } from "@/lib/pilot/sus";
import {
  scoreWho5, scoreSwls, scoreDigitalFamiliarity, scoreRawTlx,
  WHO5_ITEMS, SWLS_ITEMS, DIGITAL_FAMILIARITY_ITEMS, SELF_EFFICACY_ITEMS,
} from "@/lib/pilot/instruments";
import type { Locale } from "@/lib/i18n/config";

/**
 * Raw form values keyed exactly as IntakeForm's field names -- parsed and
 * scored here rather than typed strictly, since Sections D/E/F contribute
 * a variable number of dynamically-keyed Likert responses (df_*, se_*,
 * who5_*, swls_*) that don't fit a fixed interface cleanly.
 */
export type PilotIntakeRaw = Record<string, string>;

export interface PilotActionResult {
  success: boolean;
  error?: string;
}

function generateParticipantCode(sequentialNumber: number): string {
  return `P-${String(sequentialNumber).padStart(4, "0")}`;
}

function num(raw: PilotIntakeRaw, key: string): number | null {
  const v = raw[key];
  if (v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function str(raw: PilotIntakeRaw, key: string): string | null {
  const v = raw[key];
  return v && v.trim() ? v.trim() : null;
}

/**
 * Registers a new pilot participant, assigns one of the 6 counterbalanced
 * orderings via round-robin (participant N gets sequence N mod 6, which
 * spreads 60 or 72 participants perfectly evenly across all 6 sequences),
 * scores the Section D/F instruments, and creates the 3 pilot_sessions
 * rows for their assigned order.
 */
export async function createPilotParticipant(
  raw: PilotIntakeRaw
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

  // Section D: Digital Familiarity
  const dfResponses: Record<string, number> = {};
  for (const item of DIGITAL_FAMILIARITY_ITEMS) {
    const v = num(raw, `df_${item.id}`);
    if (v !== null) dfResponses[item.id] = v;
  }
  const dfScore = scoreDigitalFamiliarity(dfResponses);

  // Section E: Digital Self-Efficacy (stored raw, no composite requested)
  const seResponses: Record<string, number> = {};
  for (const item of SELF_EFFICACY_ITEMS) {
    const v = num(raw, `se_${item.id}`);
    if (v !== null) seResponses[item.id] = v;
  }

  // Section F: WHO-5 + SWLS
  const who5Responses: Record<string, number> = {};
  for (const item of WHO5_ITEMS) {
    const v = num(raw, `who5_${item.id}`);
    if (v !== null) who5Responses[item.id] = v;
  }
  const swlsResponses: Record<string, number> = {};
  for (const item of SWLS_ITEMS) {
    const v = num(raw, `swls_${item.id}`);
    if (v !== null) swlsResponses[item.id] = v;
  }

  const { data: participant, error } = await supabase
    .from("pilot_participants")
    .insert({
      participant_code: participantCode,
      full_name: str(raw, "fullName") ?? "",
      contact: str(raw, "contact") ?? "",
      language: (raw.language as Locale) ?? "en",
      sequence_index: sequenceIndex,
      device: str(raw, "device"),
      preferred_language_freetext: str(raw, "preferredLanguageFreetext"),
      age_bracket: str(raw, "ageBracket"),
      gender_v2: str(raw, "genderV2"),
      gender_self_describe: str(raw, "genderSelfDescribe"),
      education: str(raw, "education"),
      occupation: str(raw, "occupation"),
      occupation_other: str(raw, "occupationOther"),
      residence: str(raw, "residence"),
      primary_language_freetext: str(raw, "primaryLanguage"),
      other_languages_freetext: str(raw, "otherLanguages"),
      preferred_language_task_freetext: str(raw, "preferredLanguageTask"),
      literacy_reading: num(raw, "literacyReading"),
      literacy_writing: num(raw, "literacyWriting"),
      digital_text_comprehension: num(raw, "digitalTextComprehension"),
      internet_access: str(raw, "internetAccess"),
      phone_access: str(raw, "phoneAccess"),
      phone_exclusivity: str(raw, "phoneExclusivity"),
      internet_frequency: str(raw, "internetFrequency"),
      digital_familiarity_responses: dfResponses,
      digital_familiarity_index: dfScore.index,
      self_efficacy_responses: seResponses,
      who5_responses: who5Responses,
      who5_score: Object.keys(who5Responses).length === WHO5_ITEMS.length ? scoreWho5(who5Responses) : null,
      swls_responses: swlsResponses,
      swls_score: Object.keys(swlsResponses).length === SWLS_ITEMS.length ? scoreSwls(swlsResponses) : null,
      baseline_happiness: num(raw, "baselineHappiness"),
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
  fullName: string;
}

export async function getPilotParticipantByCode(participantCode: string): Promise<PilotParticipantLookup | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("pilot_participants")
    .select("id, language, sequence_index, full_name")
    .eq("participant_code", participantCode)
    .maybeSingle();

  if (!data) return null;
  return {
    id: data.id as string,
    language: data.language as Locale,
    sequenceIndex: data.sequence_index as number,
    fullName: data.full_name as string,
  };
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
  input: { success: boolean; comprehensionCorrect?: boolean }
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
      comprehension_correct: input.comprehensionCorrect ?? null,
      time_ms: timeMs,
    })
    .eq("session_id", sessionId)
    .eq("task_key", taskKey);

  if (error) return { success: false, error: "Could not save task result." };
  return { success: true };
}

export interface PostTaskBatteryInput {
  susResponses: Record<number, number>;
  tlxRatings: { mental: number; physical: number; temporal: number; performance: number; effort: number; frustration: number };
  comprehensionResponses: Record<string, number>;
  k1: number;
  k2: number;
  k3: number;
  postTaskHappiness: number;
}

export async function submitPostTaskBattery(
  sessionId: string,
  participantId: string,
  input: PostTaskBatteryInput
): Promise<PilotActionResult> {
  const supabase = createServiceRoleClient();
  const susScore = scoreSus(input.susResponses);
  const tlxScore = scoreRawTlx(input.tlxRatings);

  const { data: participant } = await supabase
    .from("pilot_participants")
    .select("baseline_happiness")
    .eq("id", participantId)
    .maybeSingle();

  const baseline = participant?.baseline_happiness as number | null;
  const happinessChange = baseline != null ? input.postTaskHappiness - baseline : null;

  const { error } = await supabase
    .from("pilot_sessions")
    .update({
      sus_responses: input.susResponses,
      sus_score: susScore,
      tlx_mental: input.tlxRatings.mental,
      tlx_physical: input.tlxRatings.physical,
      tlx_temporal: input.tlxRatings.temporal,
      tlx_performance: input.tlxRatings.performance,
      tlx_effort: input.tlxRatings.effort,
      tlx_frustration: input.tlxRatings.frustration,
      tlx_raw_score: tlxScore,
      comprehension_independence_responses: input.comprehensionResponses,
      satisfaction_k1: input.k1,
      satisfaction_k2: input.k2,
      satisfaction_k3: input.k3,
      post_task_happiness: input.postTaskHappiness,
      happiness_change: happinessChange,
      completed_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) return { success: false, error: "Could not save your answers." };
  return { success: true };
}

export async function submitFinalFeedback(
  participantId: string,
  preferredCondition: PilotCondition | "no_preference",
  helpfulComponent: "text" | "audio" | "icons" | "combination" | "none",
  mostDifficultPart: string,
  whatWouldHelp: string
): Promise<PilotActionResult> {
  const supabase = createServiceRoleClient();

  const { error } = await supabase.from("pilot_final_feedback").insert({
    participant_id: participantId,
    preferred_condition: preferredCondition,
    helpful_component: helpfulComponent,
    most_difficult_part: mostDifficultPart || null,
    what_would_help: whatWouldHelp || null,
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

// ---------------------------------------------------------------------------
// Researcher-facing export
// ---------------------------------------------------------------------------

export type ExportRow = Record<string, string | number | boolean | null>;

const TASK_KEYS_FOR_EXPORT: TaskKey[] = ["dashboard_view", "add_product", "share_profile", "view_orders"];

/**
 * One row per participant x condition (i.e. per pilot_sessions row) -- the
 * unit a repeated-measures / mixed-effects model wants. Participant-level
 * intake variables (Sections A-G) repeat on each of that participant's
 * three rows; per-condition outcomes (SUS, TLX, comprehension, K1-K3,
 * happiness change) vary by row; per-task metrics are flattened into
 * task-prefixed columns and left blank when no task events exist yet.
 *
 * Deliberately EXCLUDES full_name and contact -- the analysis dataset
 * should be de-identified. Use getPilotContactRows() for compensation.
 */
export async function getPilotExportRows(): Promise<ExportRow[]> {
  const supabase = createServiceRoleClient();

  const [{ data: participants }, { data: sessions }, { data: taskEvents }, { data: feedback }] = await Promise.all([
    supabase.from("pilot_participants").select("*"),
    supabase.from("pilot_sessions").select("*"),
    supabase.from("pilot_task_events").select("*"),
    supabase.from("pilot_final_feedback").select("*"),
  ]);

  const participantById = new Map((participants ?? []).map((p) => [p.id as string, p]));
  const feedbackByParticipant = new Map((feedback ?? []).map((f) => [f.participant_id as string, f]));
  const eventsBySession = new Map<string, Map<string, Record<string, unknown>>>();
  for (const ev of taskEvents ?? []) {
    const sid = ev.session_id as string;
    if (!eventsBySession.has(sid)) eventsBySession.set(sid, new Map());
    eventsBySession.get(sid)!.set(ev.task_key as string, ev);
  }

  const rows: ExportRow[] = [];

  for (const s of sessions ?? []) {
    const p = participantById.get(s.participant_id as string);
    if (!p) continue;
    const fb = feedbackByParticipant.get(p.id as string);

    const row: ExportRow = {
      participant_code: p.participant_code,
      sequence_index: p.sequence_index,
      condition: s.condition,
      order_position: s.order_position,
      session_language: p.language,
      preferred_language_freetext: p.preferred_language_freetext ?? null,
      device: p.device ?? null,
      // Section A
      age_bracket: p.age_bracket ?? null,
      gender: p.gender_v2 ?? null,
      gender_self_describe: p.gender_self_describe ?? null,
      education: p.education ?? null,
      occupation: p.occupation ?? null,
      occupation_other: p.occupation_other ?? null,
      residence: p.residence ?? null,
      primary_language: p.primary_language_freetext ?? null,
      other_languages: p.other_languages_freetext ?? null,
      preferred_language_task: p.preferred_language_task_freetext ?? null,
      // Section B
      literacy_reading: p.literacy_reading ?? null,
      literacy_writing: p.literacy_writing ?? null,
      digital_text_comprehension: p.digital_text_comprehension ?? null,
      // Section C
      internet_access: p.internet_access ?? null,
      phone_access: p.phone_access ?? null,
      phone_exclusivity: p.phone_exclusivity ?? null,
      internet_frequency: p.internet_frequency ?? null,
      // Sections D-G (scores; raw item responses are in Supabase as jsonb)
      digital_familiarity_index: p.digital_familiarity_index ?? null,
      who5_score: p.who5_score ?? null,
      swls_score: p.swls_score ?? null,
      baseline_happiness: p.baseline_happiness ?? null,
      // Per-condition outcomes (Sections H-L)
      sus_score: s.sus_score ?? null,
      tlx_mental: s.tlx_mental ?? null,
      tlx_physical: s.tlx_physical ?? null,
      tlx_temporal: s.tlx_temporal ?? null,
      tlx_performance: s.tlx_performance ?? null,
      tlx_effort: s.tlx_effort ?? null,
      tlx_frustration: s.tlx_frustration ?? null,
      tlx_raw_score: s.tlx_raw_score ?? null,
      satisfaction_k1: s.satisfaction_k1 ?? null,
      satisfaction_k2: s.satisfaction_k2 ?? null,
      satisfaction_k3: s.satisfaction_k3 ?? null,
      post_task_happiness: s.post_task_happiness ?? null,
      happiness_change: s.happiness_change ?? null,
      session_started_at: s.started_at ?? null,
      session_completed_at: s.completed_at ?? null,
    };

    // Section J: one column per item (blank where the item didn't apply to this condition)
    const ci = (s.comprehension_independence_responses ?? {}) as Record<string, number>;
    for (let i = 1; i <= 10; i++) row[`ci_${i}`] = ci[`ci_${i}`] ?? null;

    // Section H: raw SUS items
    const sus = (s.sus_responses ?? {}) as Record<string, number>;
    for (let i = 1; i <= 10; i++) row[`sus_${i}`] = sus[String(i)] ?? null;

    // Per-task metrics (blank until the live-task routing is built)
    const events = eventsBySession.get(s.id as string);
    for (const key of TASK_KEYS_FOR_EXPORT) {
      const ev = events?.get(key);
      row[`${key}_time_ms`] = (ev?.time_ms as number) ?? null;
      row[`${key}_success`] = (ev?.success as boolean) ?? null;
      row[`${key}_errors`] = (ev?.error_count as number) ?? null;
      row[`${key}_assistance`] = (ev?.assistance_requests as number) ?? null;
    }

    // Interface preference (M1-M4), once per participant
    row.preferred_condition = fb?.preferred_condition ?? null;
    row.helpful_component = fb?.helpful_component ?? null;
    row.most_difficult_part = fb?.most_difficult_part ?? null;
    row.what_would_help = fb?.what_would_help ?? null;

    rows.push(row);
  }

  rows.sort((a, b) =>
    String(a.participant_code).localeCompare(String(b.participant_code)) ||
    Number(a.order_position) - Number(b.order_position)
  );
  return rows;
}

/** Name + contact per participant, for compensation/follow-up. Keep separate from the analysis dataset. */
export async function getPilotContactRows(): Promise<ExportRow[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("pilot_participants")
    .select("participant_code, full_name, contact, created_at, completed_at")
    .order("participant_code", { ascending: true });

  return (data ?? []).map((p) => ({
    participant_code: p.participant_code as string,
    full_name: p.full_name as string,
    contact: p.contact as string,
    registered_at: p.created_at as string,
    completed_at: (p.completed_at as string) ?? null,
  }));
}
