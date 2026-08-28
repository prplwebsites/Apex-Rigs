create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Gaming PC',
  description text not null default '',
  price numeric not null default 0,
  specs text not null default '',
  stock integer not null default 0,
  image text not null default '',
  visible boolean not null default true,
  featured boolean not null default false,
  disabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer text not null,
  phone text not null,
  email text not null default '',
  address text not null default '',
  products jsonb not null default '[]'::jsonb,
  total numeric not null default 0,
  payment text not null default 'Cash on delivery',
  status text not null default 'New Order',
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  budget text not null default '',
  platform text not null default '',
  notes text not null default '',
  status text not null default 'NEW REQUEST',
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.quotes enable row level security;

drop policy if exists "Public can read visible products" on public.products;
create policy "Public can read visible products" on public.products for select using (visible = true and disabled = false);

-- Temporary development policies. Replace with authenticated admin policies before production.
drop policy if exists "Public can manage products during setup" on public.products;
create policy "Public can manage products during setup" on public.products for all using (true) with check (true);

drop policy if exists "Public can create orders" on public.orders;
create policy "Public can create orders" on public.orders for insert with check (true);

drop policy if exists "Public can read orders during setup" on public.orders;
create policy "Public can read orders during setup" on public.orders for select using (true);

drop policy if exists "Public can update orders during setup" on public.orders;
create policy "Public can update orders during setup" on public.orders for update using (true) with check (true);

drop policy if exists "Public can delete orders during setup" on public.orders;
create policy "Public can delete orders during setup" on public.orders for delete using (true);

drop policy if exists "Public can create quotes" on public.quotes;
create policy "Public can create quotes" on public.quotes for insert with check (true);

drop policy if exists "Public can read quotes during setup" on public.quotes;
create policy "Public can read quotes during setup" on public.quotes for select using (true);

drop policy if exists "Public can update quotes during setup" on public.quotes;
create policy "Public can update quotes during setup" on public.quotes for update using (true) with check (true);

drop policy if exists "Public can delete quotes during setup" on public.quotes;
create policy "Public can delete quotes during setup" on public.quotes for delete using (true);

alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.quotes;
