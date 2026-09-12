# KarigarSetu Pilot Study — Runbook

This is the step-by-step guide for taking the pilot module from code to a completed, exportable dataset of 60–72 participants. Follow it in order the first time; sections are labeled so you can jump back to any one later.

---

## A. One-time setup (before any participant touches it)

1. **Create/confirm your Supabase project.** If you're reusing the main KarigarSetu project, that's fine — the pilot tables are namespaced (`pilot_*`) and won't collide with anything.

2. **Run the new migration.** In the Supabase SQL Editor, run `supabase/migrations/0005_pilot_study.sql`. This creates `pilot_participants`, `pilot_sessions`, `pilot_task_events`, and `pilot_final_feedback`, all with RLS enabled and zero anon/authenticated policies.

3. **Get your service-role key.** Supabase dashboard → Project Settings → API → `service_role` secret (not the `anon` key — the pilot module specifically needs the service-role one). Copy it.

4. **Set environment variables.** In `.env.local` (or your hosting provider's environment settings if deploying):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   PILOT_ADMIN_PASSWORD=choose-a-real-password-here
   NEXT_PUBLIC_SITE_URL=https://your-deployed-domain.com
   ```
   Never commit `.env.local`. If deploying to Vercel, set these as Environment Variables in the project settings instead.

5. **Deploy (or run locally for a device-based pilot).**
   - If participants will use their own devices/links: deploy to Vercel (`vercel deploy` or connect the GitHub repo), then share the live URL.
   - If you're running this in-person on a tablet/laptop you control: `npm install && npm run build && npm run start` is more reliable than `npm run dev` for a study session (dev mode is slower and shows extra dev-only warnings).

6. **Confirm the admin dashboard works.** Visit `https://your-domain/pilot/admin`, log in with your `PILOT_ADMIN_PASSWORD`. You should see "Total participants: 0" and an empty CSV export. If this fails, double-check the service-role key — the export route returns 401 for anything else.

---

## B. Dry run (do this before recruiting anyone real)

1. Visit `/pilot`, click through consent in each of the 3 languages to sanity-check translations render correctly on your actual target devices (not just desktop Chrome — test on whatever Android phones/tablets you expect participants to use).
2. Complete one full pass yourself: intake → all 3 conditions → SUS × 3 → final feedback → debrief screen.
3. Go to `/pilot/admin` and confirm your test run shows up (1 participant, 1 sequence bar filled in).
4. Download the CSV and open it — you should see 6 rows (3 conditions × 2 tasks) for your one test participant, with `time_ms`, `success`, `error_count`, etc. populated.
5. **Delete your test data** before real recruitment starts, so it doesn't skew the counterbalancing (it currently counts toward the round-robin sequence assignment). Easiest way: in Supabase Table Editor, delete the row(s) from `pilot_participants` — the `on delete cascade` foreign keys will clean up the associated sessions/task events/feedback automatically.

---

## C. Running sessions with real participants

**Per-participant checklist for whoever is facilitating:**

1. Open `/pilot` on the device. If you know the participant's language ahead of time, open `/pilot?lang=hi` or `?lang=bn` directly to save a step.
2. Read the consent text aloud if the participant prefers not to read it themselves (this is expected and fine — the study is specifically about people who may not read comfortably).
3. Let them tap "I agree," then help them through the intake form if needed. Facilitator-assisted intake is normal for this population; it doesn't bias the actual UI-condition tasks that follow.
4. From here, the app runs the full sequence on its own — condition intro, two tasks, comprehension checks, SUS, satisfaction, repeated 3 times, then final feedback and a thank-you screen. You shouldn't need to intervene except to answer genuine confusion (which itself is useful qualitative signal — consider jotting a note).
5. **Do not close the tab or refresh mid-session** — there's no resume-from-where-you-left-off logic; a participant who drops out mid-session simply won't have a `completed_at` on their later sessions or an entry in `pilot_final_feedback`, so keep the device on one uninterrupted charge and don't let it sleep mid-task.
6. When the debrief screen appears with the participant code, that participant is done. Note the code if you're tracking compensation manually.

**One thing to actively watch for:** if a participant abandons partway through, their partial data still counts toward the round-robin sequence counter. If you get several partial dropouts, your sequence balance can drift slightly off the target ~10–12 per sequence — check `/pilot/admin`'s balance bars periodically (every 10–15 participants is reasonable) rather than only at the very end, so you can consciously steer remaining recruitment toward under-filled sequences if it matters for your analysis.

---

## D. Monitoring progress

Check `/pilot/admin` periodically. It shows:
- Total participants vs. the 60–72 target
- How many completed all 3 conditions (vs. partial/dropped)
- A bar per sequence so you can see if recruitment has drifted uneven

If you need more detail than the dashboard gives (e.g., filtering by literacy level or looking for a specific participant's raw responses), query the Supabase tables directly via the SQL Editor using the service-role-equivalent dashboard access — the anon key cannot read this data by design, but you as project owner always can through Supabase's own dashboard.

---

## E. Closing data collection

1. Once you've hit your target (or decided to stop), do a final CSV export from `/pilot/admin`.
2. Optionally rotate `PILOT_ADMIN_PASSWORD` and/or take the `/pilot/*` routes offline (e.g., add a maintenance redirect) so no further submissions land after your analysis dataset is locked.
3. Keep a copy of the exported CSV and the corresponding Supabase project snapshot — if a reviewer asks for raw data later, you want the export and the source table in sync.

---

## F. Getting from CSV to the statistical analysis

The export is already shaped as **one row per participant × condition × task**, which is what a mixed-effects model wants directly — no pivoting needed. Columns map onto your original design as:

| Design element | CSV column(s) |
|---|---|
| UI condition (within-subject factor) | `condition` (T / TA / TAI) |
| Participant (random effect) | `participant_code` |
| Gender, Age, Language | `gender`, `age_group`, `language` |
| Literacy, Digital experience | `literacy_level`, `digital_experience` |
| Task success (primary outcome) | `success` |
| Task completion time | `time_ms` |
| Error rate | `error_count` |
| Assistance requests | `assistance_requests` |
| Comprehension | `comprehension_correct` |
| Usability (SUS) | `sus_score` (already computed 0–100; `sus_responses` jsonb has the raw 10 items if you want item-level analysis) |
| Satisfaction | `satisfaction_score` |

In R, this loads directly into `lme4`/`lmerTest` as `Yij ~ condition + gender + age_group + language + literacy_level + digital_experience + (1 | participant_code)`, matching the model in your original design diagram. For the binary `success` outcome, the same data frame works with `glmer(..., family = binomial)`.

---

## A note on what this pilot doesn't cover

Two things from the original study angle: the tasks are two standardized screens built specifically for this study (not the live production app), and eye tracking was excluded per your instruction. If a later phase of this research needs eye tracking or in-app-task telemetry from the real product rather than a study instrument, that's a separate build — flag it and we can scope it.
