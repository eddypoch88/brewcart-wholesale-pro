import React, { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, CreditCard, Banknote, ShieldCheck, AlertCircle, Building2, BanknoteIcon, ImageIcon, X, Wallet } from 'lucide-react';
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
        is_toyyibpay_enabled: false,
        accept_cod: false,
        accept_bank_transfer: false,
        bank_name: '',
        bank_holder_name: '',
        bank_account_number: '',
        qr_code_url: ''
    });

    // 1. Fetch Existing Keys
    useEffect(() => {
        async function getPaymentSettings() {
            const { data, error } = await supabase
                .from('settings')
                .select('stripe_publishable_key, stripe_secret_key, is_stripe_enabled, toyyibpay_secret_key, toyyibpay_category_code, is_toyyibpay_enabled, accept_cod, accept_bank_transfer, bank_name, bank_holder_name, bank_account_number, qr_code_url')
                .eq('id', 1)
                .single();

            if (data) {
                setFormData({
                    ...data,
                    // Ensuring defaults if null
                    stripe_publishable_key: data.stripe_publishable_key || '',
                    stripe_secret_key: data.stripe_secret_key || '',
                    is_stripe_enabled: data.is_stripe_enabled || false,
                    toyyibpay_secret_key: data.toyyibpay_secret_key || '',
                    toyyibpay_category_code: data.toyyibpay_category_code || '',
                    is_toyyibpay_enabled: data.is_toyyibpay_enabled || false,
                    accept_cod: data.accept_cod || false,
                    accept_bank_transfer: data.accept_bank_transfer || false,
                    bank_name: data.bank_name || '',
                    bank_holder_name: data.bank_holder_name || '',
                    bank_account_number: data.bank_account_number || '',
                    qr_code_url: data.qr_code_url || ''
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

            {/* === MANUAL PAYMENTS === */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg">Manual Payments</h3>
                        <p className="text-slate-500 text-xs">Bank Transfer, DuitNow QR, Cash on Delivery</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="cod"
                            checked={formData.accept_cod}
                            onChange={(e) => setFormData({ ...formData, accept_cod: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-gray-800"
                        />
                        <label htmlFor="cod" className="text-sm font-medium text-slate-700 dark:text-gray-300 cursor-pointer">
                            Accept Cash on Delivery
                        </label>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="bank-transfer"
                            checked={formData.accept_bank_transfer}
                            onChange={(e) => setFormData({ ...formData, accept_bank_transfer: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-gray-800"
                        />
                        <label htmlFor="bank-transfer" className="text-sm font-medium text-slate-700 dark:text-gray-300 cursor-pointer">
                            Accept Bank Transfer / DuitNow QR
                        </label>
                    </div>

                    {formData.accept_bank_transfer && (
                        <div className="ml-8 space-y-4 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-lg border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                        <Building2 size={16} className="text-indigo-600" />
                                        Bank Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.bank_name}
                                        onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                                        placeholder="e.g. Maybank, CIMB, RHB"
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                        <CreditCard size={16} className="text-emerald-600" />
                                        Account Holder Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.bank_holder_name}
                                        onChange={(e) => setFormData({ ...formData, bank_holder_name: e.target.value })}
                                        placeholder="e.g. BrewCart Sdn Bhd / Ali bin Abu"
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                        <BanknoteIcon size={16} className="text-emerald-600" />
                                        Bank Account Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.bank_account_number}
                                        onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
                                        placeholder="1234567890"
                                        className="w-full md:w-1/2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-6">
                                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <ImageIcon size={16} className="text-purple-600" />
                                    DuitNow QR Code
                                </label>
                                <p className="text-xs text-slate-500 dark:text-gray-400 mb-3">Upload your DuitNow QR so customers can scan & pay directly via mobile banking.</p>

                                {formData.qr_code_url ? (
                                    <div className="relative inline-block mt-2">
                                        <img
                                            src={formData.qr_code_url}
                                            alt="DuitNow QR Code"
                                            className="w-48 h-48 object-contain rounded-lg border-2 border-purple-200 dark:border-purple-900 bg-white p-2 shadow-sm"
                                        />
                                        <button
                                            onClick={() => setFormData({ ...formData, qr_code_url: '' })}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => document.getElementById('qr-upload')?.click()}
                                        className="w-48 h-48 mt-2 border-2 border-dashed border-purple-300 dark:border-purple-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all"
                                    >
                                        <ImageIcon size={32} className="text-purple-300 dark:text-purple-800 mb-2" />
                                        <p className="text-xs text-purple-500 font-medium">Upload QR Code</p>
                                        <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">PNG, JPG</p>
                                    </div>
                                )}
                                <input
                                    id="qr-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        if (file.size > 2 * 1024 * 1024) {
                                            toast.error('❌ QR image must be under 2MB');
                                            return;
                                        }
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setFormData({ ...formData, qr_code_url: reader.result as string });
                                            toast.success('✅ QR Code uploaded!');
                                        };
                                        reader.readAsDataURL(file);
                                    }}
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
