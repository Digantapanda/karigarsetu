-- Pilot study data collection: within-subject repeated-measures design
-- comparing three UI conditions (T = text only, TA = text+audio,
-- TAI = text+audio+icons) mapped to this app's Text/Voice/Icon interfaces.
--
-- No participant authentication -- participants fill out a public intake
-- form and are walked through tasks anonymously by session code, so RLS
-- here is deliberately narrow: anonymous INSERT/UPDATE is allowed (that's
-- how the flow writes data with no login), but there is NO anonymous
-- SELECT policy at all, so participants can never read back any pilot
-- data, including other participants' rows. The researcher-facing export
-- reads through the server-only service-role key (see
-- app/pilot/admin/export/route.ts), never through the anon client.

create table if not exists pilot_participants (
  id uuid primary key default gen_random_uuid(),
  participant_code text not null unique,
  full_name text not null,
  contact text not null,
  gender text not null check (gender in ('female','male','other','prefer_not_to_say')),
  age_group text not null check (age_group in ('18-30','31-50','51+')),
  language text not null check (language in ('en','hi','bn')),
  literacy_level text not null check (literacy_level in ('low','medium','high')),
  digital_experience text not null check (digital_experience in ('low','medium','high')),
  sequence_index int not null check (sequence_index between 0 and 5),
  consent_given_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists pilot_sessions (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references pilot_participants(id) on delete cascade,
  condition text not null check (condition in ('T','TA','TAI')),
  order_position int not null check (order_position between 1 and 3),
  started_at timestamptz,
  completed_at timestamptz,
  sus_responses jsonb,
  sus_score numeric,
  satisfaction_score int check (satisfaction_score between 1 and 5),
  created_at timestamptz not null default now(),
  unique (participant_id, order_position)
);

create index if not exists idx_pilot_sessions_participant on pilot_sessions(participant_id);

create table if not exists pilot_task_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references pilot_sessions(id) on delete cascade,
  task_key text not null check (task_key in ('profile_info','share_profile')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  success boolean,
  error_count int not null default 0,
  assistance_requests int not null default 0,
  comprehension_correct boolean,
  time_ms int,
  created_at timestamptz not null default now(),
  unique (session_id, task_key)
);

create index if not exists idx_pilot_task_events_session on pilot_task_events(session_id);

create table if not exists pilot_final_feedback (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null unique references pilot_participants(id) on delete cascade,
  preferred_condition text check (preferred_condition in ('T','TA','TAI')),
  comments text,
  created_at timestamptz not null default now()
);

alter table pilot_participants enable row level security;
alter table pilot_sessions enable row level security;
alter table pilot_task_events enable row level security;
alter table pilot_final_feedback enable row level security;

-- Deliberately NO policies at all on any pilot_* table. RLS with zero
-- policies denies every anon/authenticated request by default. All
-- reads AND writes for the pilot flow go through Next.js Server Actions
-- using the service-role key (server-only, never exposed to the
-- browser) rather than the anon client -- see lib/pilot/*-actions.ts.
-- This is simpler than crafting anon insert/update policies for an
-- unauthenticated flow, and it means participant data is never reachable
-- from client-side code under any circumstance.
