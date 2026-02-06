import React from 'react';

const ProfileView: React.FC = () => {
  return (
    <div className="min-h-full pb-28 pt-12 px-6">
      {/* Top Section */}
      <div className="flex flex-col items-center mb-10 animate-in fade-in zoom-in duration-300">
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-700 shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden relative z-10">
            <img
              alt="Azmi Head Brewer"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1583336130561-1d934b1262d1?q=80&w=300&auto=format&fit=crop"
            />
          </div>
          {/* Decorative background blur behind avatar */}
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-indigo-600/20 blur-2xl rounded-full scale-125 z-0"></div>
        </div>
        
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">Azmi Head Brewer</h2>
        <div className="mt-3 flex items-center gap-2">
            <span className="text-indigo-600 font-semibold text-xs uppercase tracking-wide bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Master Cicerone</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wide bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">Verified</span>
        </div>
      </div>

      {/* Menu List */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide pl-2 mb-2">Brewery Management</h3>
        
        {/* Product/Items -> Blue */}
        <MenuCard icon="sports_bar" title="Taproom Settings" subtitle="Taps, menus, happy hour" variant="product" />
        <MenuCard icon="inventory_2" title="Inventory Preferences" subtitle="Keg alerts, supplier lists" variant="product" />
        
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide pl-2 mb-2 mt-6">System</h3>
        {/* General -> Indigo */}
        <MenuCard icon="notifications" title="Notifications" hasToggle variant="general" />
        <MenuCard icon="help" title="Help & Support" subtitle="Contact Distributor" variant="general" />
      </div>

      {/* Logout */}
      <button className="w-full py-4 rounded-2xl bg-slate-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 font-semibold text-base hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-slate-100 dark:border-red-900/20 shadow-sm group">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span>
        </div>
        Log Out
      </button>
      
      <p className="text-center text-xs text-slate-300 dark:text-slate-600 mt-6 font-medium">BrewCart v3.1.0 (Build 902)</p>
    </div>
  );
};

interface MenuCardProps {
    icon: string;
    title: string;
    subtitle?: string;
    hasToggle?: boolean;
    variant: 'product' | 'general' | 'payment';
}

const MenuCard: React.FC<MenuCardProps> = ({ icon, title, subtitle, hasToggle = false, variant }) => {
    
    // Apply strict color rules
    const getColors = () => {
        switch(variant) {
            case 'product': // Products/Items -> Blue
                return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100';
            case 'payment': // Payments/Alerts -> Orange
                return 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 group-hover:bg-orange-100';
            case 'general': // General/Order -> Indigo
            default:
                return 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100';
        }
    }

    const colorClasses = getColors();

    return (
        <div className="flex items-center justify-between p-4 rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer shadow-[0_20px_60px_rgba(0,0,0,0.03)] group active:scale-[0.99]">
            <div className="flex items-center gap-4">
                {/* Squircle Icon Container */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${colorClasses}`}>
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </div>
                <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm tracking-tight">{title}</p>
                    {subtitle && <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {hasToggle ? (
                 <div className="w-11 h-6 bg-indigo-600 rounded-full relative cursor-pointer shadow-inner">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
                 </div>
            ) : (
                 <span className="material-symbols-outlined text-slate-300 group-hover:text-indigo-600 transition-colors">chevron_right</span>
            )}
        </div>
    );
}

export default ProfileView;