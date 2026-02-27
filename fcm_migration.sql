-- Add FCM token column to store_settings
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS fcm_token TEXT,
ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT false;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_store_settings_fcm ON store_settings(store_id, fcm_token);

-- Create function to trigger notification
CREATE OR REPLACE FUNCTION trigger_order_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Call edge function to send notification
  -- Ensure you replace 'your-project' with your actual Supabase project reference if using hardcoded URLs,
  -- Or use the dynamic net.http_post to hit the edge function explicitly.
  PERFORM net.http_post(
    url := (current_setting('request.headers', true)::json->>'x-forwarded-proto') || '://' || (current_setting('request.headers', true)::json->>'host') || '/functions/v1/send-order-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('request.jwt.claims', true)::json->>'sub'
    ),
    body := jsonb_build_object('order_id', NEW.id)
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Catch any HTTP errors gracefully so the order insert does not fail if webhooks fail
  RAISE WARNING 'FCM Webhook trigger failed. Moving on.';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on orders table
DROP TRIGGER IF EXISTS on_order_created ON orders;
CREATE TRIGGER on_order_created
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_order_notification();
