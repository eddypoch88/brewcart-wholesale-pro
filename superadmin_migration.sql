-- BrewCart Performance Indexes & Super Admin RLS Policies

-- 1. Performance Indexes
-- Speed up store lookups by owner
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id);

-- Speed up product queries by store
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);

-- Speed up product searches
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('english', name));

-- 2. RLS Policies Updates for Super Admin Access
-- Ensure row level security is enabled on these tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Product Policies
-- Drop existing super admin policy if it exists to replace it
DROP POLICY IF EXISTS "Super admin sees all products" ON products;

-- Super admin can see all products
CREATE POLICY "Super admin sees all products"
ON products FOR SELECT
USING (
  auth.jwt() ->> 'email' = 'eddypoch88@gmail.com'
);

-- Store Policies
-- Drop existing super admin policy if it exists to replace it
DROP POLICY IF EXISTS "Super admin sees all stores" ON stores;

-- Super admin can see all stores
CREATE POLICY "Super admin sees all stores"
ON stores FOR SELECT
USING (
  auth.jwt() ->> 'email' = 'eddypoch88@gmail.com'
);
