import { NextResponse } from "next/server";
import { isPilotAdminAuthed } from "@/app/pilot/admin/actions";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  const authed = await isPilotAdminAuthed();
  if (!authed) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();

  const { data: participants } = await supabase.from("pilot_participants").select("*");
  const { data: sessions } = await supabase.from("pilot_sessions").select("*");
  const { data: taskEvents } = await supabase.from("pilot_task_events").select("*");
  const { data: feedback } = await supabase.from("pilot_final_feedback").select("*");

  const sessionsById = new Map((sessions ?? []).map((s) => [s.id, s]));
  const feedbackByParticipant = new Map((feedback ?? []).map((f) => [f.participant_id, f]));

  // One row per task event, with participant/session/feedback columns
  // flattened in -- this is the shape a mixed-effects model in R/Python
  // wants: one row per (participant x condition x task).
  const headers = [
    "participant_code", "gender", "age_group", "language", "literacy_level", "digital_experience",
    "sequence_index", "condition", "order_position", "task_key",
    "started_at", "completed_at", "time_ms", "success", "error_count", "assistance_requests",
    "comprehension_correct", "sus_score", "satisfaction_score",
    "preferred_condition", "final_comments",
  ];

  const rows: string[] = [headers.join(",")];

  for (const event of taskEvents ?? []) {
    const session = sessionsById.get(event.session_id);
    if (!session) continue;
    const participant = (participants ?? []).find((p) => p.id === session.participant_id);
    if (!participant) continue;
    const fb = feedbackByParticipant.get(participant.id);

    rows.push(
      [
        participant.participant_code,
        participant.gender,
        participant.age_group,
        participant.language,
        participant.literacy_level,
        participant.digital_experience,
        participant.sequence_index,
        session.condition,
        session.order_position,
        event.task_key,
        event.started_at,
        event.completed_at,
        event.time_ms,
        event.success,
        event.error_count,
        event.assistance_requests,
        event.comprehension_correct,
        session.sus_score,
        session.satisfaction_score,
        fb?.preferred_condition,
        fb?.comments,
      ]
        .map(csvEscape)
        .join(",")
    );
  }

  const csv = rows.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="karigarsetu-pilot-export-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
