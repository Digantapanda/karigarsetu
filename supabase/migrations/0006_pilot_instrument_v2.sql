-- Extends the pilot study schema (0005) with the full instrument battery
-- from the revised study design: demographic/psychometric intake
-- (Sections A-G), a richer post-task battery per condition (SUS +
-- NASA-TLX + comprehension/independence + satisfaction + happiness),
-- expanded final interface-preference questions, detailed pointer-event
-- tracking, and mock order data for Task 4.
--
-- Same RLS posture as 0005: RLS enabled, zero anon/authenticated
-- policies. Every read/write goes through the service-role client.

-- ---- Supersede the original (0005) demographic columns ----
-- The Section A-G intake below replaces gender/age_group/literacy_level/
-- digital_experience entirely rather than adding to them. They were
-- NOT NULL in 0005; relaxing that so the new intake form (which doesn't
-- populate them) can still insert. Columns are kept, not dropped, so any
-- data already collected under 0005 isn't lost.
alter table pilot_participants
  alter column gender drop not null,
  alter column age_group drop not null,
  alter column literacy_level drop not null,
  alter column digital_experience drop not null;

-- ---- Participant: one-time intake fields (Sections A-G) ----
-- (The existing `language` column from 0005 serves as the
-- interview/task language.)
alter table pilot_participants
  add column if not exists device text check (device in ('mobile', 'desktop')),
  add column if not exists preferred_language_freetext text,
  add column if not exists age_bracket text check (age_bracket in ('18-24','25-34','35-44','45-54','55-64','65+')),
  add column if not exists gender_v2 text check (gender_v2 in ('man','woman','non_binary','self_describe','prefer_not_to_say')),
  add column if not exists gender_self_describe text,
  add column if not exists education text check (education in (
    'no_formal_schooling','primary','middle','secondary','higher_secondary','diploma_iti','undergraduate','postgraduate_plus'
  )),
  add column if not exists occupation text check (occupation in (
    'student','salaried','self_employed','farmer','daily_wage','homemaker','retired','unemployed','other'
  )),
  add column if not exists occupation_other text,
  add column if not exists residence text check (residence in ('rural','semi_urban','urban')),
  add column if not exists primary_language_freetext text,
  add column if not exists other_languages_freetext text,
  add column if not exists preferred_language_task_freetext text,
  -- Section B: Literacy and Language Background (each 1-5)
  add column if not exists literacy_reading int check (literacy_reading between 1 and 5),
  add column if not exists literacy_writing int check (literacy_writing between 1 and 5),
  add column if not exists digital_text_comprehension int check (digital_text_comprehension between 1 and 5),
  -- Section C: Digital Access
  add column if not exists internet_access text check (internet_access in ('personal','shared','elsewhere','no_regular_access')),
  add column if not exists phone_access text check (phone_access in ('no_access','basic_phone','smartphone','both')),
  add column if not exists phone_exclusivity text check (phone_exclusivity in ('yes','shared_family','borrow_others')),
  add column if not exists internet_frequency text check (internet_frequency in ('never','less_than_weekly','several_times_weekly','daily','several_times_daily')),
  -- Section D: Digital Familiarity (7 items, 0-4 each) + computed index
  add column if not exists digital_familiarity_responses jsonb,
  add column if not exists digital_familiarity_index numeric,
  -- Section E: Digital Self-Efficacy (5 items, 1-5 each)
  add column if not exists self_efficacy_responses jsonb,
  -- Section F: WHO-5 (5 items, 0-5) + SWLS (5 items, 1-7)
  add column if not exists who5_responses jsonb,
  add column if not exists who5_score numeric,
  add column if not exists swls_responses jsonb,
  add column if not exists swls_score numeric,
  -- Section G: baseline happiness (1-5), recorded once
  add column if not exists baseline_happiness int check (baseline_happiness between 1 and 5),
  add column if not exists demo_user_id uuid,
  add column if not exists demo_craftsman_id uuid;

-- ---- Widen task_key: the revised design runs tasks on the real app ----
alter table pilot_task_events
  drop constraint if exists pilot_task_events_task_key_check;

alter table pilot_task_events
  add constraint pilot_task_events_task_key_check
    check (task_key in ('dashboard_view','add_product','share_profile','view_orders'));

-- ---- Sessions: post-task battery per condition (Sections H-L) ----
alter table pilot_sessions
  add column if not exists tlx_mental int check (tlx_mental between 0 and 100),
  add column if not exists tlx_physical int check (tlx_physical between 0 and 100),
  add column if not exists tlx_temporal int check (tlx_temporal between 0 and 100),
  add column if not exists tlx_performance int check (tlx_performance between 0 and 100),
  add column if not exists tlx_effort int check (tlx_effort between 0 and 100),
  add column if not exists tlx_frustration int check (tlx_frustration between 0 and 100),
  add column if not exists tlx_raw_score numeric,
  add column if not exists comprehension_independence_responses jsonb,
  add column if not exists satisfaction_k1 int check (satisfaction_k1 between 1 and 5),
  add column if not exists satisfaction_k2 int check (satisfaction_k2 between 1 and 5),
  add column if not exists satisfaction_k3 int check (satisfaction_k3 between 1 and 5),
  add column if not exists post_task_happiness int check (post_task_happiness between 1 and 5),
  add column if not exists happiness_change int;

-- ---- Final feedback: expanded M1-M4 ----
alter table pilot_final_feedback
  drop constraint if exists pilot_final_feedback_preferred_condition_check;

alter table pilot_final_feedback
  add constraint pilot_final_feedback_preferred_condition_check
    check (preferred_condition in ('T','TA','TAI','no_preference'));

alter table pilot_final_feedback
  add column if not exists helpful_component text check (helpful_component in ('text','audio','icons','combination','none')),
  add column if not exists most_difficult_part text,
  add column if not exists what_would_help text;

-- ---- Detailed pointer/touch tracking ----
create table if not exists pilot_pointer_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references pilot_sessions(id) on delete cascade,
  task_key text not null,
  events jsonb not null,
  batch_started_at timestamptz not null,
  batch_ended_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_pilot_pointer_events_session on pilot_pointer_events(session_id, task_key);
alter table pilot_pointer_events enable row level security;

-- ---- Mock order data for Task 4 (pilot-only, not a real orders system) ----
create table if not exists pilot_mock_orders (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references pilot_sessions(id) on delete cascade,
  customer_name text not null,
  product_name text not null,
  quantity int not null,
  status text not null default 'pending' check (status in ('pending','accepted','declined')),
  decided_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_pilot_mock_orders_session on pilot_mock_orders(session_id);
alter table pilot_mock_orders enable row level security;
