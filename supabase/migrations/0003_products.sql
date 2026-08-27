-- Phase 5: products + product_images. Matches the ER model in the
-- architecture doc, section C.

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  craftsman_id uuid not null references craftsman_profiles(id) on delete cascade,
  name text not null,
  category_id text references craft_categories(id),
  description text,
  materials text,
  technique text,
  price numeric(12,2),
  currency text not null default 'INR',
  price_type text not null default 'fixed' check (price_type in ('fixed','on_request')),
  availability text not null default 'in_stock' check (availability in ('in_stock','made_to_order','out_of_stock')),
  stock_quantity int,
  min_order_qty int,
  dimensions text,
  weight text,
  customizable boolean not null default false,
  production_time text,
  video_url text,
  status text not null default 'draft' check (status in ('draft','published','out_of_stock','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_products_craftsman on products(craftsman_id);
create index if not exists idx_products_status on products(status);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0,
  alt_text text,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_images_product on product_images(product_id);

alter table products enable row level security;
alter table product_images enable row level security;

create policy "craftsmen manage their own products"
  on products for all
  using (craftsman_id in (select id from craftsman_profiles where user_id = auth.uid()))
  with check (craftsman_id in (select id from craftsman_profiles where user_id = auth.uid()));

create policy "published products on published profiles are public"
  on products for select
  using (
    status = 'published'
    and craftsman_id in (select id from craftsman_profiles where profile_status = 'published')
  );

create policy "craftsmen manage their own product images"
  on product_images for all
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

create policy "images of public products are public"
  on product_images for select
  using (
    product_id in (
      select p.id from products p
      join craftsman_profiles cp on cp.id = p.craftsman_id
      where p.status = 'published' and cp.profile_status = 'published'
    )
  );
