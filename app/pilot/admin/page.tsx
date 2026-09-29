import { isPilotAdminAuthed, pilotAdminLogout } from "@/app/pilot/admin/actions";
import { AdminLoginForm } from "@/components/pilot/AdminLoginForm";
import { getPilotStats, getPilotExportRows } from "@/lib/domain/pilot";
import { SEQUENCES } from "@/lib/pilot/config";

// Columns shown in the on-page table; the CSV has every column.
const TABLE_COLUMNS: { key: string; label: string }[] = [
  { key: "participant_code", label: "Participant" },
  { key: "condition", label: "Condition" },
  { key: "order_position", label: "Order" },
  { key: "session_language", label: "Lang" },
  { key: "age_bracket", label: "Age" },
  { key: "gender", label: "Gender" },
  { key: "literacy_reading", label: "Read (1-5)" },
  { key: "digital_familiarity_index", label: "DFI" },
  { key: "who5_score", label: "WHO-5" },
  { key: "swls_score", label: "SWLS" },
  { key: "sus_score", label: "SUS" },
  { key: "tlx_raw_score", label: "Raw TLX" },
  { key: "happiness_change", label: "Δ Happy" },
  { key: "preferred_condition", label: "Preferred" },
];

export default async function PilotAdminPage() {
  const authed = await isPilotAdminAuthed();

  if (!authed) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-16">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Pilot Study Admin</h1>
        <div className="rounded-2xl border border-ink-500/15 bg-khadi-100/60 p-6 shadow-sm sm:p-8">
          <AdminLoginForm />
        </div>
      </main>
    );
  }

  const [stats, rows] = await Promise.all([getPilotStats(), getPilotExportRows()]);
  const target = 72; // upper end of the 60-72 recruitment target
  const perSequenceTarget = Math.ceil(target / SEQUENCES.length);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Pilot Study Admin</h1>
        <form action={pilotAdminLogout}>
          <button type="submit" className="text-sm font-medium text-ink-700 hover:underline">
            Log out
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-ink-500/15 bg-khadi-50 p-4">
          <p className="text-sm text-ink-500">Total participants</p>
          <p className="font-display text-2xl font-semibold text-ink-900">{stats.totalParticipants}</p>
        </div>
        <div className="rounded-xl border border-ink-500/15 bg-khadi-50 p-4">
          <p className="text-sm text-ink-500">Completed all 3 sessions</p>
          <p className="font-display text-2xl font-semibold text-ink-900">{stats.completedParticipants}</p>
        </div>
        <div className="rounded-xl border border-ink-500/15 bg-khadi-50 p-4">
          <p className="text-sm text-ink-500">Target range</p>
          <p className="font-display text-2xl font-semibold text-ink-900">60-72</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold text-ink-900">Counterbalance balance</h2>
        <p className="text-sm text-ink-500">
          Even recruitment means roughly {perSequenceTarget} participants per sequence.
        </p>
        <div className="flex flex-col gap-2">
          {SEQUENCES.map((sequence, i) => {
            const count = stats.perSequenceCounts[i] ?? 0;
            const pct = Math.min(100, (count / perSequenceTarget) * 100);
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-sm text-ink-700">{sequence.join(" → ")}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-ink-500/10">
                  <div className="h-full rounded-full bg-indigo-700" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-10 shrink-0 text-right text-sm text-ink-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href="/pilot/admin/export"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-indigo-700 px-6 text-base font-semibold text-khadi-50 hover:bg-indigo-900"
        >
          Download analysis CSV
        </a>
        <a
          href="/pilot/admin/export?type=contacts"
          className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-indigo-700 px-6 text-base font-semibold text-indigo-700 hover:bg-indigo-300/10"
        >
          Download contacts CSV
        </a>
        <a
          href="/pilot/admin/export?type=pointer-events"
          className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-indigo-700 px-6 text-base font-semibold text-indigo-700 hover:bg-indigo-300/10"
        >
          Download pointer events (JSON)
        </a>
      </div>
      <p className="text-sm text-ink-500">
        The analysis CSV now includes per-task click/hover/scroll counts and cursor path distance
        alongside timing and success. The pointer-events JSON has the raw event-level data (individual
        move samples, click coordinates, hover start/end) for path or heatmap analysis beyond those
        summary columns.
      </p>
      <p className="text-sm text-ink-500">
        The analysis CSV is de-identified (no names or contact details) with one row per participant ×
        condition, ready for the mixed-effects models in the study design. Names and contacts are in a
        separate file so they can be kept apart from the analysis data.
      </p>

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold text-ink-900">
          Records ({rows.length} sessions)
        </h2>
        {rows.length === 0 ? (
          <p className="rounded-lg bg-khadi-50 p-4 text-sm text-ink-500">No sessions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-ink-500/15 bg-khadi-50">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-ink-500/15 bg-khadi-100/60">
                <tr>
                  {TABLE_COLUMNS.map((c) => (
                    <th key={c.key} className="whitespace-nowrap px-3 py-2 font-semibold text-ink-900">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-ink-500/10 last:border-0">
                    {TABLE_COLUMNS.map((c) => (
                      <td key={c.key} className="whitespace-nowrap px-3 py-2 text-ink-700">
                        {row[c.key] === null || row[c.key] === undefined ? "–" : String(row[c.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
