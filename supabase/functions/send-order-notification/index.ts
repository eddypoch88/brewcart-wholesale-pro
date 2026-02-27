import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { JWT } from 'https://esm.sh/google-auth-library@9.6.3';

// Load the Service Account JSON from Supabase Secrets
const serviceAccountStr = Deno.env.get('FIREBASE_SERVICE_ACCOUNT');

serve(async (req) => {
  try {
    const { order_id } = await req.json();
    
    // Get Supabase credentials
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Supabase configuration missing');
    }
    
    if (!serviceAccountStr) {
        throw new Error('Firebase Service Account missing from environment variables');
    }

    // Parse the service account
    const serviceAccount = JSON.parse(serviceAccountStr);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Fetch order and store details
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        stores (name, owner_id),
        store_settings (fcm_token)
      `)
      .eq('id', order_id)
      .single();
    
    if (error || !order) throw error;
    
    const fcmToken = order.store_settings?.fcm_token;
    if (!fcmToken) {
      return new Response(JSON.stringify({ message: 'No FCM token found for this store' }), { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // 1. Authenticate with Google using the Service Account (FCM V1 API)
    const jwtClient = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    });

    const tokens = await jwtClient.authorize();
    const accessToken = tokens.access_token;
    
    // 2. Prepare the Notification Payload for V1 API
    const notificationPayload = {
      message: {
        token: fcmToken,
        notification: {
          title: '🎉 New Order Received!',
          body: `${order.customer_name} placed an order for RM ${Number(order.total || 0).toFixed(2)}`,
        },
        webpush: {
          notification: {
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            tag: 'new-order',
            requireInteraction: true
          }
        },
        data: {
          order_id: order.id,
          store_id: order.store_id,
          action: 'view_order'
        }
      }
    };
    
    // 3. Send via Firebase V1 API
    const projectId = serviceAccount.project_id;
    const response = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationPayload),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
        console.error('FCM Send Error:', result);
        throw new Error(`FCM V1 Error: ${JSON.stringify(result)}`);
    }

    console.log('FCM V1 Response:', result);
    
    return new Response(JSON.stringify({ success: true, result }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error: any) {
    console.error('Edge Function Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
