import React from 'react';
import { Home, BarChart2, Settings, FileText, Plus } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onAddClick }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'sales', icon: BarChart2, label: 'Sales' },
    // Center Gap for FAB
    { id: 'add-placeholder', icon: null, label: '' },
    { id: 'orders', icon: FileText, label: 'Orders' }, // Kept for balance
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-3xl z-40 px-6 py-3">
      <div className="flex justify-between items-center relative">

        {/* Central Floating FAB - The "Heart" */}
        <button
          onClick={onAddClick}
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(79,70,229,0.5)] border-4 border-slate-50 dark:border-slate-950 text-white hover:scale-105 active:scale-95 transition-all z-50 group"
        >
          <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Nav Items */}
        {navItems.map((item) => {
          if (item.id === 'add-placeholder') return <div key="gap" className="w-10" />;

          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${isActive ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
            >
              <div className="relative">
                {/* @ts-ignore */}
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full" />}
              </div>
              <span className={`text-[9px] font-bold tracking-wide ${isActive ? 'text-indigo-600' : 'text-transparent'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;