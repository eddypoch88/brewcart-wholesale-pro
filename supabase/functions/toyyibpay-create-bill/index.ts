import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

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

    const { amount, orderId, storeId, customerName, customerEmail, customerPhone } = await req.json()

    // 1. Fetch ToyyibPay credentials from settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('settings')
      .select('toyyibpay_secret_key, toyyibpay_category_code')
      .eq('id', storeId)
      .single()

    if (settingsError || !settings?.toyyibpay_secret_key || !settings?.toyyibpay_category_code) {
      throw new Error('ToyyibPay is not configured for this store.');
    }

    // 2. Prepare payload for ToyyibPay
    // Multiply amount by 100 as ToyyibPay expects value in cents
    const billAmount = Math.round(amount * 100);

    const formData = new FormData();
    formData.append('userSecretKey', settings.toyyibpay_secret_key);
    formData.append('categoryCode', settings.toyyibpay_category_code);
    formData.append('billName', `Order ${orderId}`);
    formData.append('billDescription', `Payment for Order ${orderId}`);
    formData.append('billPriceSetting', '1');
    formData.append('billPayorInfo', '1');
    formData.append('billAmount', billAmount.toString());
    formData.append('billReturnUrl', `${req.headers.get('origin')}/order-confirmation?orderId=${orderId}&gateway=toyyibpay`);
    formData.append('billCallbackUrl', `${Deno.env.get('SUPABASE_URL')}/functions/v1/toyyibpay-callback`); // For webhook later if needed
    formData.append('billExternalReferenceNo', orderId);
    formData.append('billTo', customerName || 'Valued Customer');
    formData.append('billEmail', customerEmail || 'customer@brewcart.com');
    formData.append('billPhone', customerPhone || '0123456789');

    // 3. Make request to ToyyibPay API
    const response = await fetch('https://toyyibpay.com/index.php/api/createBill', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result || !result[0]?.BillCode) {
      console.error('ToyyibPay API Error:', result);
      throw new Error('Failed to create bill with ToyyibPay.');
    }

    const billCode = result[0].BillCode;
    const paymentUrl = `https://toyyibpay.com/${billCode}`;

    return new Response(
      JSON.stringify({ url: paymentUrl, billCode }),
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
