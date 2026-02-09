"use client";

import React, { useState, useEffect } from 'react';
import { Save, Store, CreditCard, Globe, ExternalLink, Info, ShieldCheck } from 'lucide-react';
import { useSupabaseDocument } from '@/src/hooks/useSupabase';
import { supabase } from '@/src/lib/supabase';
import { StoreConfig } from '@/src/shared/shared-types';

export default function StoreSettingsPage() {
    // Fetch initial data
    const { data: storeConfig, loading } = useSupabaseDocument<StoreConfig>('store_config', 1);

    // State untuk semua input (Disatukan supaya senang urus)
    const [formData, setFormData] = useState({
        storeName: '',
        storeDescription: '',
        whatsappNumber: '',
        currency: 'MYR',
        address: '',
        email: ''
    });

    // Populate form when data loads
    useEffect(() => {
        if (storeConfig) {
            setFormData({
                storeName: storeConfig.store_name || '',
                storeDescription: '', // Description not in StoreConfig type yet, can add to schema later or use metadata
                whatsappNumber: storeConfig.whatsapp_number || '',
                currency: 'MYR', // Default or from metadata if added
                address: '',
                email: ''
            });
        } else if (!loading) {
            // Fallback default if no config found (shouldn't happen with init SQL)
            setFormData(prev => ({ ...prev, storeName: 'New Store' }));
        }
    }, [storeConfig, loading]);

    const [isSaving, setIsSaving] = useState(false);

    // Function Generic untuk Handle Perubahan Input (Tanpa Re-render melampau)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('store_config')
                .update({
                    store_name: formData.storeName,
                    whatsapp_number: formData.whatsappNumber,
                    updated_at: new Date().toISOString()
                })
                .eq('id', 1);

            if (error) throw error;
            alert('Setting Berjaya Disimpan! ✅');
        } catch (error: any) {
            console.error('Save error:', error);
            alert('Gagal Simpan: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 pb-20">

            {/* Header Page */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Store Configuration</h1>
                    <p className="text-slate-500 text-sm">Urus maklumat kedai dan cara pembayaran</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Grid Setting */}
            <div className="grid grid-cols-1 gap-6">

                {/* SECTION 1: GENERAL INFO */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Store className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">General Information</h2>
                            <p className="text-sm text-gray-500">Basic details about your store.</p>
                        </div>
                    </div>

                    {/* FIX: 2 COLUMN GRID (SaaS Layout) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                        {/* COLUMN 1: STORE NAME */}
                        <div>
                            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                                Store Name
                            </label>
                            <input
                                type="text"
                                name="storeName"
                                id="storeName"
                                value={formData.storeName}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 px-3 transition-all outline-none border"
                                placeholder="e.g. My Awesome Store"
                            />
                        </div>

                        {/* COLUMN 2: STORE DOMAIN + SSL BADGE (The Pro Move) */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="storeDomain" className="block text-sm font-medium text-gray-700">
                                    Store Website (Domain)
                                </label>

                                {/* SSL BADGE (Client Confirm Happy Tengok Ni) */}
                                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-medium border border-green-200">
                                    <ShieldCheck size={10} />
                                    SSL Covered by Orb
                                </div>
                            </div>

                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Globe className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="url"
                                    id="storeDomain"
                                    className="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5 transition-all outline-none border"
                                    placeholder="https://yourstore.com"
                                />
                            </div>
                            <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                                <Info size={12} className="text-blue-500" />
                                Connect your custom domain. We handle the HTTPS/SSL certs automatically. 🔒
                            </p>

                            {/* PRO DNS INSTRUCTION CARD */}
                            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex gap-3">
                                    <div className="mt-1">
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <Globe className="w-4 h-4 text-blue-600" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="text-sm font-semibold text-blue-900">How to connect your domain?</h4>
                                            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                                Login to your domain provider (Godaddy, Namecheap, or Cloudflare) and add these 2 records to your DNS settings:
                                            </p>
                                        </div>

                                        {/* Table DNS Record yang Nampak PRO */}
                                        <div className="bg-white rounded border border-blue-100 overflow-hidden">
                                            <table className="w-full text-xs text-left">
                                                <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                                                    <tr>
                                                        <th className="px-3 py-2">Type</th>
                                                        <th className="px-3 py-2">Name / Host</th>
                                                        <th className="px-3 py-2">Value / Points to</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 text-gray-700">
                                                    <tr>
                                                        <td className="px-3 py-2 font-mono font-bold">A</td>
                                                        <td className="px-3 py-2 font-mono">@</td>
                                                        <td className="px-3 py-2 font-mono select-all bg-gray-50 cursor-pointer" title="Click to copy">76.76.21.21</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-3 py-2 font-mono font-bold">CNAME</td>
                                                        <td className="px-3 py-2 font-mono">www</td>
                                                        <td className="px-3 py-2 font-mono select-all bg-gray-50 cursor-pointer" title="Click to copy">cname.vercel-dns.com</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Bonus Tip Cloudflare (Idea Ko Tadi) */}
                                        <div className="flex items-start gap-2 pt-2 border-t border-blue-100/50">
                                            <span className="text-blue-500">💡</span>
                                            <p className="text-xs text-blue-800 italic">
                                                <strong>Pro Tip:</strong> We recommend using <a href="https://www.cloudflare.com" target="_blank" className="underline hover:text-blue-600">Cloudflare</a> for faster DNS. Don't worry about SSL, we handle the HTTPS certificate for you automatically! 🔒
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div> {/* End Grid */}

                    {/* Remaining fields */}
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">WhatsApp Number (For Orders)</label>
                            <input
                                type="text"
                                name="whatsappNumber"
                                value={formData.whatsappNumber}
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                placeholder="e.g. 60123456789"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
                            <textarea
                                name="storeDescription"
                                value={formData.storeDescription}
                                onChange={handleChange}
                                rows={3}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                placeholder="Cerita sikit pasal kedai ko..."
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION 2: PAYMENT & CURRENCY */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <h2 className="font-bold text-slate-800">Payment & Currency</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Currency</label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                            >
                                <option value="MYR">MYR (Ringgit Malaysia)</option>
                                <option value="USD">USD (US Dollar)</option>
                                <option value="SGD">SGD (Singapore Dollar)</option>
                            </select>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
