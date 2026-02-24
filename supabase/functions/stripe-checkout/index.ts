import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import Stripe from "https://esm.sh/stripe@14.16.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { amount, orderId, storeId, items, customerEmail } = await req.json()

    // 1. Fetch Stripe credentials from settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('settings')
      .select('stripe_secret_key, currency')
      .eq('id', storeId)
      .single()

    if (settingsError || !settings?.stripe_secret_key) {
      throw new Error('Stripe is not configured for this store.');
    }

    const stripe = new Stripe(settings.stripe_secret_key, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const currency = (settings.currency || 'MYR').toLowerCase();

    // 2. Prepare Line Items for Stripe Checkout
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.product.name,
          images: item.product.images?.length ? [item.product.images[0]] : [],
        },
        unit_amount: Math.round(item.product.price * 100), // Stripe expects cents
      },
      quantity: item.qty,
    }));

    // If there's a discrepancy in total amount (e.g., delivery fee), add it as a line item
    const itemsTotal = items.reduce((sum: number, item: any) => sum + (item.product.price * item.qty), 0);
    const difference = amount - itemsTotal;
    
    if (difference > 0) {
        lineItems.push({
            price_data: {
                currency: currency,
                product_data: { name: 'Delivery Fee' },
                unit_amount: Math.round(difference * 100),
            },
            quantity: 1,
        });
    }

    const origin = req.headers.get('origin') || 'http://localhost:5173';

    // 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/order-confirmation?orderId=${orderId}&gateway=stripe&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?orderId=${orderId}&canceled=true`,
      client_reference_id: orderId,
      customer_email: customerEmail || undefined,
      metadata: {
        orderId: orderId,
        storeId: storeId
      }
    });

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error: any) {
    console.error("Function Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
