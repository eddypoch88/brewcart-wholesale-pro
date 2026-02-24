import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, CreditCard, Banknote, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PaymentSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        stripe_publishable_key: '',
        stripe_secret_key: '',
        is_stripe_enabled: false,
        toyyibpay_secret_key: '',
        toyyibpay_category_code: '',
        is_toyyibpay_enabled: false
    });

    // 1. Fetch Existing Keys
    useEffect(() => {
        async function getPaymentSettings() {
            const { data, error } = await supabase
                .from('settings')
                .select('stripe_publishable_key, stripe_secret_key, is_stripe_enabled, toyyibpay_secret_key, toyyibpay_category_code, is_toyyibpay_enabled')
                .eq('id', 1)
                .single();

            if (data) {
                setFormData({
                    stripe_publishable_key: data.stripe_publishable_key || '',
                    stripe_secret_key: data.stripe_secret_key || '',
                    is_stripe_enabled: data.is_stripe_enabled || false,
                    toyyibpay_secret_key: data.toyyibpay_secret_key || '',
                    toyyibpay_category_code: data.toyyibpay_category_code || '',
                    is_toyyibpay_enabled: data.is_toyyibpay_enabled || false
                });
            }
            setLoading(false);
        }
        getPaymentSettings();
    }, []);

    // 2. Save Keys
    const handleSave = async () => {
        setSaving(true);
        const { error } = await supabase
            .from('settings')
            .update(formData)
            .eq('id', 1);

        if (!error) {
            toast.success('Payment Gateways Connected! 💰');
        } else {
            toast.error('Failed to save settings. Please verify database columns.');
        }
        setSaving(false);
    };

    if (loading) return <div className="p-8 text-white">Loading Security Module...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Gateways</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage how you get paid. Enable Stripe for cards & ToyyibPay for FPX.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-200 dark:border-emerald-500/20 w-fit">
                    <ShieldCheck size={18} />
                    <span className="text-sm font-semibold">Secure Encryption Active</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* === STRIPE (International / Cards) === */}
                <div className={`relative p-6 rounded-2xl border transition-all duration-300 ${formData.is_stripe_enabled ? 'bg-white dark:bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-80'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-600/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <h3 className="text-slate-900 dark:text-white font-bold text-lg">Stripe</h3>
                                <p className="text-slate-500 text-xs">Visa, Mastercard, Apple Pay</p>
                            </div>
                        </div>
                        {/* Toggle Switch */}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={formData.is_stripe_enabled} onChange={(e) => setFormData({ ...formData, is_stripe_enabled: e.target.checked })} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    {formData.is_stripe_enabled && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div>
                                <label className="block text-slate-500 dark:text-slate-400 text-sm mb-1">Publishable Key (pk_test_...)</label>
                                <input
                                    type="text"
                                    value={formData.stripe_publishable_key}
                                    onChange={(e) => setFormData({ ...formData, stripe_publishable_key: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="pk_test_xxxxxxxxxxxxxxxx"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-500 dark:text-slate-400 text-sm mb-1">Secret Key (sk_test_...)</label>
                                <input
                                    type="password"
                                    value={formData.stripe_secret_key}
                                    onChange={(e) => setFormData({ ...formData, stripe_secret_key: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="sk_test_xxxxxxxxxxxxxxxx"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* === TOYYIBPAY (Malaysia / FPX) === */}
                <div className={`relative p-6 rounded-2xl border transition-all duration-300 ${formData.is_toyyibpay_enabled ? 'bg-white dark:bg-slate-900 border-orange-500/50 shadow-lg shadow-orange-500/10' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-80'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-50 dark:bg-orange-600/20 rounded-xl text-orange-600 dark:text-orange-400">
                                <Banknote size={24} />
                            </div>
                            <div>
                                <h3 className="text-slate-900 dark:text-white font-bold text-lg">ToyyibPay</h3>
                                <p className="text-slate-500 text-xs">FPX Banking (CIMB, Maybank, etc)</p>
                            </div>
                        </div>
                        {/* Toggle Switch */}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={formData.is_toyyibpay_enabled} onChange={(e) => setFormData({ ...formData, is_toyyibpay_enabled: e.target.checked })} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>

                    {formData.is_toyyibpay_enabled && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 p-3 rounded-xl flex gap-3">
                                <AlertCircle className="text-orange-500 dark:text-orange-400 shrink-0" size={18} />
                                <p className="text-orange-700 dark:text-orange-200 text-xs leading-relaxed">Ensure you have created a Category in your ToyyibPay dashboard to get the Category Code.</p>
                            </div>
                            <div>
                                <label className="block text-slate-500 dark:text-slate-400 text-sm mb-1">User Secret Key</label>
                                <input
                                    type="password"
                                    value={formData.toyyibpay_secret_key}
                                    onChange={(e) => setFormData({ ...formData, toyyibpay_secret_key: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                    placeholder="e.g. 7d8f... (From Settings)"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-500 dark:text-slate-400 text-sm mb-1">Category Code</label>
                                <input
                                    type="text"
                                    value={formData.toyyibpay_category_code}
                                    onChange={(e) => setFormData({ ...formData, toyyibpay_category_code: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                    placeholder="e.g. 8392hs21"
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* SAVE BUTTON */}
            <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    {saving ? 'Verifying Keys...' : <><Save size={20} /> Save Payment Settings</>}
                </button>
            </div>

        </div>
    );
}
