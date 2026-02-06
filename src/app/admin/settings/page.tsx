import React, { useState } from 'react';
import { Save, Store, Mail, Phone, MapPin, Palette } from 'lucide-react';
import { db } from '../../../shared/firebase-config';
import { doc, setDoc } from 'firebase/firestore';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    // Mock initial data - in real app, fetch from 'settings' collection
    const [formData, setFormData] = useState({
        storeName: 'Heaven Brow Store',
        contactEmail: 'admin@brewcart.com',
        contactPhone: '+60 12-345 6789',
        address: 'Kuala Lumpur, Malaysia',
        primaryColor: '#2563EB',
        currency: 'MYR'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await setDoc(doc(db, 'settings', 'general'), formData, { merge: true });
            alert('Settings Saved Successfully!');
        } catch (err) {
            console.error(err);
            alert('Error saving settings');
        } finally {
            setLoading(false);
        }
    };

    const Section = ({ title, icon: Icon, children }: any) => (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
                <Icon size={20} className="text-blue-600" />
                {title}
            </h3>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );

    const Input = ({ label, type = "text", value, onChange }: any) => (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
            <input
                type={type}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-slate-900"
                value={value}
                onChange={onChange}
            />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-70"
                >
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Section title="Store Details" icon={Store}>
                    <Input
                        label="Store Name"
                        value={formData.storeName}
                        onChange={(e: any) => setFormData({ ...formData, storeName: e.target.value })}
                    />
                    <Input
                        label="Currency"
                        value={formData.currency}
                        onChange={(e: any) => setFormData({ ...formData, currency: e.target.value })}
                    />
                </Section>

                <Section title="Contact Information" icon={Mail}>
                    <Input
                        label="Public Email"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e: any) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                    <Input
                        label="Contact Phone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e: any) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                </Section>

                <Section title="Location" icon={MapPin}>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business Address</label>
                        <textarea
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-slate-900 resize-none"
                            value={formData.address}
                            onChange={(e: any) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                </Section>

                <Section title="Appearance" icon={Palette}>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Primary Color"
                            type="color"
                            value={formData.primaryColor}
                            onChange={(e: any) => setFormData({ ...formData, primaryColor: e.target.value })}
                        />
                        <Input
                            label="Secondary Color"
                            type="color"
                            value={formData.secondaryColor || '#1e293b'}
                            onChange={(e: any) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        These colors will be dynamically injected into your storefront.
                    </p>
                </Section>
            </div>
        </div>
    );
}
