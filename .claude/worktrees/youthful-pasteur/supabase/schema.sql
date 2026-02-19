-- 1. PRODUCTS (With metadata for future features)
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE,
  price numeric NOT NULL,
  original_price numeric,
  description text,
  images text[], -- Array untuk simpan banyak gambar
  category text,
  stock int DEFAULT 0,
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}', -- Sini rahsia dia! Boleh tambah apa saja d masa depan.
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. STORE CONFIG (Settings owner)
CREATE TABLE store_config (
  id int PRIMARY KEY DEFAULT 1,
  store_name text DEFAULT 'BrewCart Store',
  whatsapp_number text,
  bank_name text,
  bank_account_no text,
  bank_holder_name text,
  qr_code_url text,
  fb_pixel_id text,
  google_ads_id text,
  theme_color text DEFAULT '#000000',
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT one_row_only CHECK (id = 1)
);

-- 3. ORDERS (The Money Table)
CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number serial,
  customer_name text NOT NULL,
  customer_phone text,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending', -- pending, paid, processing, completed, rejected
  receipt_url text,
  items jsonb NOT NULL, -- Simpan list barang & kuantiti
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create initial settings
INSERT INTO store_config (id, store_name) VALUES (1, 'BrewCart Pro') ON CONFLICT DO NOTHING;

-- 4. CONNECTION TESTS (Diagnostics)
CREATE TABLE connection_tests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message text,
  sender text,
  timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

