import { isPilotAdminAuthed, pilotAdminLogout } from "@/app/pilot/admin/actions";
import { AdminLoginForm } from "@/components/pilot/AdminLoginForm";
import { getPilotStats } from "@/lib/domain/pilot";
import { SEQUENCES } from "@/lib/pilot/config";

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

  const stats = await getPilotStats();
  const target = 72; // upper end of the 60-72 recruitment target
  const perSequenceTarget = Math.ceil(target / SEQUENCES.length);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-12">
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

      <a
        href="/pilot/admin/export"
        className="inline-flex h-12 w-fit items-center justify-center rounded-lg bg-indigo-700 px-6 text-base font-semibold text-khadi-50 hover:bg-indigo-900"
      >
        Download CSV export
      </a>
      <p className="text-sm text-ink-500">
        One row per participant × condition × task -- ready for the mixed-effects models described in
        the study design (repeated-measures within-subject factor, participant as random effect).
      </p>
    </main>
  );
}
