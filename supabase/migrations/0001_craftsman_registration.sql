-- Phase 1-4 schema slice: craft categories, craftsman profiles, awards, gi_tags,
-- interaction_events. Matches types/domain.ts and the architecture doc's ER model.
-- Additional tables (products, orders, etc.) land in later migrations as those
-- phases are implemented.

create extension if not exists "pgcrypto";

create table if not exists craft_categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  icon_key text
);

create table if not exists craftsman_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  craftsman_name text not null,
  registration_number text,
  registration_authority text,
  shop_name text,
  address text,
  shop_contact_number text,
  village_town text not null,
  district text not null,
  state text not null,
  pin_code text,
  gst_number text,
  gst_public boolean not null default false,
  registration_public boolean not null default false,
  primary_craft_category_id text not null references craft_categories(id),
  secondary_craft_category_id text references craft_categories(id),
  craft_tradition text,
  description text,
  geographic_region text,
  years_of_experience int,
  photo_url text,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','submitted','under_review','verified','rejected','needs_more_info')),
  profile_status text not null default 'draft'
    check (profile_status in ('draft','published','unpublished')),
  interface_mode_preference text not null default 'text'
    check (interface_mode_preference in ('text','icon','voice')),
  locale_preference text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_craftsman_profiles_user on craftsman_profiles(user_id);
create index if not exists idx_craftsman_profiles_state_district on craftsman_profiles(state, district);

create table if not exists awards (
  id uuid primary key default gen_random_uuid(),
  craftsman_id uuid not null references craftsman_profiles(id) on delete cascade,
  name text not null,
  level text not null check (level in ('national','state','other')),
  year int,
  issuing_organization text,
  certificate_url text,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','submitted','under_review','verified','rejected','needs_more_info')),
  created_at timestamptz not null default now()
);

create table if not exists gi_tags (
  id uuid primary key default gen_random_uuid(),
  craftsman_id uuid not null references craftsman_profiles(id) on delete cascade,
  gi_tag_name text not null,
  reference_number text,
  certificate_url text,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','submitted','under_review','verified','rejected','needs_more_info')),
  created_at timestamptz not null default now()
);

create table if not exists interaction_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  event_type text not null,
  interface_mode text check (interface_mode in ('text','icon','voice')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Row Level Security

alter table craftsman_profiles enable row level security;
alter table awards enable row level security;
alter table gi_tags enable row level security;
alter table interaction_events enable row level security;
alter table craft_categories enable row level security;

-- craft_categories: public read, no public write
create policy "craft_categories are readable by everyone"
  on craft_categories for select
  using (true);

-- craftsman_profiles: owner can do everything on their own row;
-- everyone can read only published profiles.
create policy "craftsmen manage their own profile"
  on craftsman_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "published profiles are publicly readable"
  on craftsman_profiles for select
  using (profile_status = 'published');

-- awards / gi_tags: owner manages via their craftsman_id, public reads only
-- verified items attached to a published profile.
create policy "craftsmen manage their own awards"
  on awards for all
  using (
    craftsman_id in (select id from craftsman_profiles where user_id = auth.uid())
  )
  with check (
    craftsman_id in (select id from craftsman_profiles where user_id = auth.uid())
  );

create policy "verified awards on published profiles are public"
  on awards for select
  using (
    verification_status = 'verified'
    and craftsman_id in (select id from craftsman_profiles where profile_status = 'published')
  );

create policy "craftsmen manage their own gi tags"
  on gi_tags for all
  using (
    craftsman_id in (select id from craftsman_profiles where user_id = auth.uid())
  )
  with check (
    craftsman_id in (select id from craftsman_profiles where user_id = auth.uid())
  );

create policy "verified gi tags on published profiles are public"
  on gi_tags for select
  using (
    verification_status = 'verified'
    and craftsman_id in (select id from craftsman_profiles where profile_status = 'published')
  );

-- interaction_events: users can insert their own events; no public read
-- (research/analytics access happens via the service role in the admin tooling).
create policy "users can log their own interaction events"
  on interaction_events for insert
  with check (auth.uid() = user_id or user_id is null);
