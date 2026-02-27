DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  END IF;
END
$$;

-- 2. VERIFY TRIGGER EXISTS
-- (This ensures the trigger we added earlier is still active)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_order_created'
  ) THEN
    RAISE EXCEPTION 'Trigger on_order_created is missing! You need to run fcm_migration.sql again.';
  END IF;
END
$$;
