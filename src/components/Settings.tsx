import React, { useEffect, useState } from 'react';
import { Save, Building2, Phone, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { SettingsService, SettingsError } from '../services/settings.service';
import { useStore } from '../context/StoreContext';

export default function Settings() {
    const { store } = useStore();
    const [storeName, setStoreName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [initialLoading, setInitialLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        if (store) loadSettings();
    }, [store]);

    const loadSettings = async () => {
        if (!store) return;
        setInitialLoading(true);
        try {
            const data = await SettingsService.get(store.id);
            if (data) {
                setStoreName(data.store_name);
                setWhatsapp(data.whatsapp_number);
            } else {
                // Pre-fill from Store object if config missing
                setStoreName(store.store_name);
                setWhatsapp(store.whatsapp_number || '');
            }
        } catch (err) {
            if (err instanceof SettingsError) {
                toast.error(err.message);
            } else {
                toast.error('Ralat tidak dijangka berlaku');
            }
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSave = async () => {
        if (!store) return;
        setSaveLoading(true);
        try {
            // Wrap the service call in a promise that matches what react-hot-toast expects (though service returns promise,
            // wrapping allows better error message control)
            await toast.promise(
                SettingsService.update(store.id, storeName, whatsapp),
                {
                    loading: 'Menyimpan settings...',
                    success: '✅ Settings berjaya disimpan!',
                    error: (err) => {
                        if (err instanceof SettingsError) return err.message;
                        return '❌ Gagal simpan settings';
                    },
                }
            );
        } catch (err) {
            console.error(err);
            // Toast already handled error display
        } finally {
            setSaveLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="text-slate-600 font-medium">Memuat settings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">

                {/* Store Name */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Building2 size={18} className="text-blue-600" /> Nama Kedai (Store Name)
                    </label>
                    <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        disabled={saveLoading}
                        placeholder="Contoh: Kedai Runcit Sinar"
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-slate-50"
                    />
                </div>

                {/* WhatsApp */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Phone size={18} className="text-green-600" /> No. WhatsApp Admin
                    </label>
                    <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        disabled={saveLoading}
                        placeholder="Contoh: 60123456789"
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-slate-50"
                    />
                    <p className="mt-2 text-xs text-slate-500">Format: Nombor sahaja (Min 10 digit)</p>
                </div>

                {/* Button */}
                <div className="pt-4 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saveLoading}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all"
                    >
                        {saveLoading ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : <><Save size={18} /> Save Settings</>}
                    </button>
                </div>

            </div>
        </div>
    );
}
