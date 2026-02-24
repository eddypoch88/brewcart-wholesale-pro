import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Facebook, BarChart3, Music2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function MarketingSettings() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        fb_pixel_id: '',
        google_analytics_id: '',
        tiktok_pixel_id: ''
    });

    // 1. Fetch from 'settings' table (id=1 for single tenant)
    useEffect(() => {
        async function getSettings() {
            setLoading(true);
            const { data, error } = await supabase
                .from('settings')
                .select('fb_pixel_id, google_analytics_id, tiktok_pixel_id')
                .eq('id', 1)
                .single();

            if (data) {
                setFormData({
                    fb_pixel_id: data.fb_pixel_id || '',
                    google_analytics_id: data.google_analytics_id || '',
                    tiktok_pixel_id: data.tiktok_pixel_id || ''
                });
            }
            setLoading(false);
        }
        getSettings();
    }, []);

    // 2. Save data baru (Socket Connection)
    const handleSave = async () => {
        setSaving(true);
        const { error } = await supabase
            .from('settings')
            .update({
                fb_pixel_id: formData.fb_pixel_id,
                google_analytics_id: formData.google_analytics_id,
                tiktok_pixel_id: formData.tiktok_pixel_id,
            })
            .eq('id', 1); // Single tenant ID

        if (!error) {
            toast.success('Integrations Connected! 🚀');
        } else {
            console.error(error);
            toast.error('Connection failed. Database columns might be missing.');
        }
        setSaving(false);
    };

    if (loading) return <div className="p-8 text-white">Loading Sockets...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Marketing Integrations</h1>
                <p className="text-slate-500 dark:text-slate-400">Connect your ads tracking tools like a socket. Just plug and play.</p>
            </div>

            <div className="grid gap-6">
                {/* FACEBOOK PIXEL SOCKET */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-50 dark:bg-blue-600/20 rounded-xl text-blue-600 dark:text-blue-500">
                            <Facebook size={24} />
                        </div>
                        <div>
                            <h3 className="text-slate-900 dark:text-white font-bold text-lg">Facebook Pixel</h3>
                            <p className="text-slate-500 text-sm">Track conversions and retarget visitors on FB/IG.</p>
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="e.g. 123456789012345"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={formData.fb_pixel_id}
                        onChange={(e) => setFormData({ ...formData, fb_pixel_id: e.target.value })}
                    />
                </div>

                {/* GOOGLE ANALYTICS SOCKET */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-orange-50 dark:bg-orange-600/20 rounded-xl text-orange-600 dark:text-orange-500">
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <h3 className="text-slate-900 dark:text-white font-bold text-lg">Google Analytics (GA4)</h3>
                            <p className="text-slate-500 text-sm">Measure your website traffic and performance.</p>
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="e.g. G-XXXXXXXXXX"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        value={formData.google_analytics_id}
                        onChange={(e) => setFormData({ ...formData, google_analytics_id: e.target.value })}
                    />
                </div>

                {/* TIKTOK PIXEL SOCKET */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-pink-500/50 transition-all shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-pink-50 dark:bg-pink-600/20 rounded-xl text-pink-600 dark:text-pink-500">
                            <Music2 size={24} />
                        </div>
                        <div>
                            <h3 className="text-slate-900 dark:text-white font-bold text-lg">TikTok Pixel</h3>
                            <p className="text-slate-500 text-sm">Track event performance for your TikTok Ads.</p>
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="e.g. CXXXXXXXXXXXXXXX"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                        value={formData.tiktok_pixel_id}
                        onChange={(e) => setFormData({ ...formData, tiktok_pixel_id: e.target.value })}
                    />
                </div>
            </div>

            {/* SAVE BUTTON - THE MASTER SWITCH */}
            <div className="flex justify-end pt-4 pb-8">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    {saving ? 'Connecting...' : <><Save size={20} /> Save All Integrations</>}
                </button>
            </div>
        </div>
    );
}
