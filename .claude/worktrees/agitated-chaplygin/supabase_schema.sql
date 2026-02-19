-- 1. Create STORES table
create table public.stores (
  id uuid default gen_random_uuid() primary key,
  store_name text not null,
  domain text unique, -- e.g. "client-a.brewcart.app" or "localhost"
  logo_url text,
  whatsapp_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Add store_id to PRODUCTS
alter table public.products 
add column store_id uuid references public.stores(id);

-- 3. Add store_id to ORDERS
alter table public.orders 
add column store_id uuid references public.stores(id);

-- 4. Add store_id to STORE_CONFIG (Settings)
alter table public.store_config 
add column store_id uuid references public.stores(id);

-- 5. (OPTIONAL) Create a default store for existing data migration
-- Uncomment and run this if you have existing data you want to keep
/*
insert into public.stores (store_name, domain)
values ('Default Store', 'localhost');

-- Get the ID of the new store
do $$
declare
  default_store_id uuid;
begin
  select id into default_store_id from public.stores where domain = 'localhost' limit 1;

  update public.products set store_id = default_store_id where store_id is null;
  update public.orders set store_id = default_store_id where store_id is null;
  update public.store_config set store_id = default_store_id where store_id is null;
end $$;
*/
