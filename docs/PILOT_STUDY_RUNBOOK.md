# KarigarSetu Pilot Study — Runbook

> **Build status (read this first).** The full flow is built: landing page → intake (Sections A–G) → per-condition intro → **real Tasks 1–4 on the live app** → post-task questionnaire (SUS, TLX, comprehension/independence, satisfaction, happiness) → repeat for all 3 conditions → final interface-preference (M1–M4) → thank-you. Each condition auto-provisions (or resets) a real demo craftsman account, sets the app's own language/interface-mode to match the condition, and hides Share Profile / Generate QR / profile completion from the dashboard for the duration. A floating banner shows the current task, a speaker, and a Help button. Detailed pointer/touch tracking (position, clicks, hover dwell, scroll) runs throughout and batches into `pilot_pointer_events`.
>
> **Do a full dry run yourself (section B) before recruiting anyone.** This has been verified with `tsc`/`eslint` and route-level checks against a placeholder Supabase project, but not yet against a real one end to end -- a real dry run is the only way to catch anything that only shows up with a live database and a live browser session.


This is the step-by-step guide for taking the pilot module from code to a completed, exportable dataset of 60–72 participants. Follow it in order the first time; sections are labeled so you can jump back to any one later.

---

## A. One-time setup (before any participant touches it)

1. **Create/confirm your Supabase project.** If you're reusing the main KarigarSetu project, that's fine — the pilot tables are namespaced (`pilot_*`) and won't collide with anything.

2. **Run the two pilot migrations, in order.** In the Supabase SQL Editor run `supabase/migrations/0005_pilot_study.sql`, then `supabase/migrations/0006_pilot_instrument_v2.sql`. Together they create `pilot_participants`, `pilot_sessions`, `pilot_task_events`, `pilot_final_feedback`, `pilot_pointer_events`, and `pilot_mock_orders`, all with RLS enabled and zero anon/authenticated policies. 0006 must run after 0005 — it alters 0005's tables.

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

`/pilot/admin` offers two downloads:

- **Analysis CSV** — de-identified (no names or contact details), **one row per participant × condition** (3 rows per participant). Participant-level variables (Sections A–G) repeat on each of that participant's rows; per-condition outcomes vary by row. Ready for a mixed-effects model with participant as a random effect.
- **Contacts CSV** — participant code, name, contact, registration and completion time, for compensation and follow-up. Keep this file separate from the analysis data.

Key analysis columns:

| Design element | CSV column(s) |
|---|---|
| UI condition (within-subject factor) | `condition` (T / TA / TAI), `order_position` |
| Participant (random effect) | `participant_code` |
| Demographics | `age_bracket`, `gender`, `education`, `occupation`, `residence`, `session_language`, `device` |
| Literacy / digital access | `literacy_reading`, `literacy_writing`, `digital_text_comprehension`, `internet_access`, `phone_access`, `phone_exclusivity`, `internet_frequency` |
| Digital familiarity / wellbeing | `digital_familiarity_index` (sum ÷ 28 × 100), `who5_score` (sum × 4, 0–100), `swls_score` (sum, 5–35) |
| Usability | `sus_score` (0–100) and `sus_1`…`sus_10` |
| Workload | `tlx_raw_score` (unweighted mean of the six ratings) and the six `tlx_*` ratings |
| Comprehension / independence | `ci_1`…`ci_10` (`ci_8` blank for T, `ci_9` blank for T and TA) |
| Satisfaction | `satisfaction_k1`, `satisfaction_k2`, `satisfaction_k3` |
| Wellbeing change | `baseline_happiness`, `post_task_happiness`, `happiness_change` (post − baseline) |
| Task performance | `<task>_time_ms`, `<task>_success`, `<task>_errors`, `<task>_assistance` for `dashboard_view`, `add_product`, `share_profile`, `view_orders` (empty until live-task routing is built) |
| Interface preference | `preferred_condition`, `helpful_component`, `most_difficult_part`, `what_would_help` |

A note on translations: the WHO-5, SWLS, SUS and NASA-TLX wording in Hindi and Bengali is a working translation for piloting, not an officially validated one. Substitute validated translations (and confirm licensing/permission for SWLS and WHO-5) before publication-grade use.

