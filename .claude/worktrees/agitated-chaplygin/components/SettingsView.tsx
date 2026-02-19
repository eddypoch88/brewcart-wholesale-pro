import React, { useState } from 'react';
import { Bell, Shield, HelpCircle, LogOut, User, Lock, ChevronRight, Store } from 'lucide-react';
import { storeConfig } from '../src/config/store';

const SettingsView: React.FC = () => {
    const settingsItems = [
        { icon: Bell, label: 'Notifications', desc: 'Manage alerts' },
        { icon: Shield, label: 'Security', desc: 'Password & Auth' },
        { icon: HelpCircle, label: 'Help & Support', desc: 'FAQ & Contact' },
    ];

    return (
        <div className="p-6 pb-32">
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">App Preferences</p>
                </div>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-mono text-slate-500">
                    v1.0.4-stable
                </span>
            </header>

            <div className="space-y-4">
                {/* Profile Card */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1583336130561-1d934b1262d1?q=80&w=300&auto=format&fit=crop" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Store Owner</h3>
                        <p className="text-primary font-medium text-sm">Owner & Manager</p>
                    </div>
                </div>

                {/* Company Bio */}
                <div className="bg-primary/5 dark:bg-primary/20 p-4 rounded-xl mb-6 border border-primary/10 dark:border-primary/20">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="font-bold text-primary dark:text-primary/70">{storeConfig.store_name} Admin</span> – Your Digital Supply Partner. We supply premium stock directly to your doorstep.
                    </p>
                </div>

                {settingsItems.map((item, index) => (
                    <button key={index} className="w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <item.icon size={20} />
                        </div>
                        <div className="flex-1 text-left">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.label}</h4>
                            <p className="text-slate-400 text-xs">{item.desc}</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                    </button>
                ))}

                <button className="w-full mt-8 bg-red-50 dark:bg-red-500/10 p-4 rounded-xl flex items-center justify-center gap-2 text-red-600 font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                    <LogOut size={20} />
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default SettingsView;
