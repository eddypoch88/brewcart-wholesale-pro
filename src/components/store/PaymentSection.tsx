import React, { useState, useEffect } from 'react';
import { CreditCard, Banknote, Loader2, Lock, QrCode, Truck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface PaymentProps {
    storeId: string;
    amount: number;
    onPay: (method: string) => void;
}

export default function PaymentSection({ storeId, amount, onPay }: PaymentProps) {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<any>(null);
    const [selectedMethod, setSelectedMethod] = useState<string>('');

    // 1. Check Database for enabled payment methods
    useEffect(() => {
        async function loadSettings() {
            const { data } = await supabase
                .from('settings')
                .select('is_stripe_enabled, is_toyyibpay_enabled, accept_cod, accept_bank_transfer')
                .single();

            if (data) {
                setSettings(data);
                // Auto-select first available method
                if (data.is_stripe_enabled) setSelectedMethod('stripe');
                else if (data.is_toyyibpay_enabled) setSelectedMethod('toyyibpay');
                else if (data.accept_bank_transfer) setSelectedMethod('bank_transfer');
                else if (data.accept_cod) setSelectedMethod('cod');
            }
            setLoading(false);
        }
        loadSettings();
    }, [storeId]);

    if (loading) return <div className="p-4 flex gap-2 text-slate-400"><Loader2 className="animate-spin" /> Checking payment gates...</div>;

    // If no gateways are enabled
    if (!settings?.is_stripe_enabled && !settings?.is_toyyibpay_enabled && !settings?.accept_bank_transfer && !settings?.accept_cod) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
                ⚠️ No payment methods available. Please contact admin.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="font-bold text-slate-800 text-lg">Select Payment Method</h3>

            {/* PAYMENT OPTIONS CARD */}
            <div className="grid gap-3">

                {/* OPTION 1: STRIPE (Card) */}
                {settings.is_stripe_enabled && (
                    <label className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedMethod === 'stripe' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-200'}`}>
                        <input
                            type="radio"
                            name="payment"
                            value="stripe"
                            className="hidden"
                            checked={selectedMethod === 'stripe'}
                            onChange={() => setSelectedMethod('stripe')}
                        />
                        <div className={`p-3 rounded-full ${selectedMethod === 'stripe' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800">Credit / Debit Card</div>
                            <div className="text-xs text-slate-500">Secure payment via Stripe</div>
                        </div>
                        {selectedMethod === 'stripe' && <div className="absolute right-4 text-indigo-600 font-bold">✓</div>}
                    </label>
                )}

                {/* OPTION 2: TOYYIBPAY (FPX Banking) */}
                {settings.is_toyyibpay_enabled && (
                    <label className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedMethod === 'toyyibpay' ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-orange-200'}`}>
                        <input
                            type="radio"
                            name="payment"
                            value="toyyibpay"
                            className="hidden"
                            checked={selectedMethod === 'toyyibpay'}
                            onChange={() => setSelectedMethod('toyyibpay')}
                        />
                        <div className={`p-3 rounded-full ${selectedMethod === 'toyyibpay' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <Banknote size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800">FPX Online Banking</div>
                            <div className="text-xs text-slate-500">Maybank2u, CIMB Clicks, etc.</div>
                        </div>
                        {selectedMethod === 'toyyibpay' && <div className="absolute right-4 text-orange-600 font-bold">✓</div>}
                    </label>
                )}

                {/* OPTION 3: BANK TRANSFER / QR */}
                {settings.accept_bank_transfer && (
                    <label className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedMethod === 'bank_transfer' ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-sky-200'}`}>
                        <input
                            type="radio"
                            name="payment"
                            value="bank_transfer"
                            className="hidden"
                            checked={selectedMethod === 'bank_transfer'}
                            onChange={() => setSelectedMethod('bank_transfer')}
                        />
                        <div className={`p-3 rounded-full ${selectedMethod === 'bank_transfer' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <QrCode size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800">Bank Transfer / DuitNow QR</div>
                            <div className="text-xs text-slate-500">Manual verification required</div>
                        </div>
                        {selectedMethod === 'bank_transfer' && <div className="absolute right-4 text-sky-600 font-bold">✓</div>}
                    </label>
                )}

                {/* OPTION 4: COD */}
                {settings.accept_cod && (
                    <label className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedMethod === 'cod' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-200'}`}>
                        <input
                            type="radio"
                            name="payment"
                            value="cod"
                            className="hidden"
                            checked={selectedMethod === 'cod'}
                            onChange={() => setSelectedMethod('cod')}
                        />
                        <div className={`p-3 rounded-full ${selectedMethod === 'cod' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <Truck size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800">Cash on Delivery (COD)</div>
                            <div className="text-xs text-slate-500">Pay when your order arrives</div>
                        </div>
                        {selectedMethod === 'cod' && <div className="absolute right-4 text-emerald-600 font-bold">✓</div>}
                    </label>
                )}

            </div>

            {/* PAY BUTTON - THE TRIGGER */}
            <button
                onClick={() => onPay(selectedMethod)}
                disabled={!selectedMethod}
                className="w-full py-4 rounded-xl font-bold text-white shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900 hover:bg-slate-800"
            >
                <Lock size={16} />
                {selectedMethod === 'stripe' ? `Pay RM${amount.toFixed(2)} with Card` :
                    selectedMethod === 'toyyibpay' ? `Pay RM${amount.toFixed(2)} with FPX` :
                        selectedMethod === 'bank_transfer' ? `Pay RM${amount.toFixed(2)} via Transfer` :
                            selectedMethod === 'cod' ? `Confirm COD Order` :
                                'Choose Payment Method'}
            </button>

            <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                <Lock size={12} /> Payments are secure and encrypted.
            </p>
        </div>
    );
}
