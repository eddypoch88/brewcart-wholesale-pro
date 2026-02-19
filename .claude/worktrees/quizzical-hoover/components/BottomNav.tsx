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
    // Spacer for Center Button
    { id: 'add-placeholder', icon: null, label: '' },
    { id: 'orders', icon: FileText, label: 'Orders' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center relative px-6 py-2">

        {/* Central Action Button */}
        <button
          onClick={onAddClick}
          className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(79,70,229,0.3)] border-[6px] border-slate-50 dark:border-slate-900 text-white hover:scale-105 active:scale-95 transition-all z-50 group"
          aria-label="Add Action"
        >
          <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Navigation Items */}
        {navItems.map((item) => {
          if (item.id === 'add-placeholder') return <div key="gap" className="w-12" />;

          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 relative py-2 ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
            >
              <div className="relative">
                {/* @ts-ignore */}
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-300 ${isActive ? '-translate-y-1' : ''}`} />
                {isActive && <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />}
              </div>
              <span className={`text-[10px] font-bold tracking-wide transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 h-0 hidden'}`}>
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