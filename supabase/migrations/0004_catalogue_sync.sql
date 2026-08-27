-- Catalogue sync: connects a craftsman's KarigarSetu products to external
-- marketplaces (Amazon, Flipkart to start). This migration establishes the
-- data model and RLS; the actual push/pull logic lives in lib/marketplace
-- adapters and is currently STUBBED pending real seller API credentials --
-- see lib/marketplace/adapters/*.ts for what each integration still needs.

create table if not exists marketplace_connections (
  id uuid primary key default gen_random_uuid(),
  craftsman_id uuid not null references craftsman_profiles(id) on delete cascade,
  platform text not null check (platform in ('amazon','flipkart')),
  status text not null default 'not_connected'
    check (status in ('not_connected','pending','connected','error')),
  seller_id text,
  -- Placeholder only. Real OAuth tokens/API keys must go through Supabase
  -- Vault or a server-only encrypted store before this table holds anything
  -- sensitive -- do not put plaintext secrets in this column in production.
  connection_note text,
  connected_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (craftsman_id, platform)
);

create table if not exists marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  platform text not null check (platform in ('amazon','flipkart')),
  external_listing_id text,
  sync_status text not null default 'not_listed'
    check (sync_status in ('not_listed','pending','listed','error')),
  last_synced_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, platform)
);

create index if not exists idx_marketplace_listings_product on marketplace_listings(product_id);

create table if not exists sync_events (
  id uuid primary key default gen_random_uuid(),
  craftsman_id uuid not null references craftsman_profiles(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  platform text not null check (platform in ('amazon','flipkart')),
  event_type text not null check (event_type in ('connect','push_listing','update_stock')),
  status text not null check (status in ('success','error','pending')),
  message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_sync_events_craftsman on sync_events(craftsman_id, created_at desc);

alter table marketplace_connections enable row level security;
alter table marketplace_listings enable row level security;
alter table sync_events enable row level security;

create policy "craftsmen manage their own marketplace connections"
  on marketplace_connections for all
  using (craftsman_id in (select id from craftsman_profiles where user_id = auth.uid()))
  with check (craftsman_id in (select id from craftsman_profiles where user_id = auth.uid()));

create policy "craftsmen manage their own marketplace listings"
  on marketplace_listings for all
  using (
    product_id in (
      select p.id from products p
      join craftsman_profiles cp on cp.id = p.craftsman_id
      where cp.user_id = auth.uid()
    )
  )
  with check (
    product_id in (
      select p.id from products p
      join craftsman_profiles cp on cp.id = p.craftsman_id
      where cp.user_id = auth.uid()
    )
  );

create policy "craftsmen read their own sync events"
  on sync_events for select
  using (craftsman_id in (select id from craftsman_profiles where user_id = auth.uid()));

create policy "craftsmen insert their own sync events"
  on sync_events for insert
  with check (craftsman_id in (select id from craftsman_profiles where user_id = auth.uid()));
