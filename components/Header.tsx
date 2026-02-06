import React from 'react';
import { ViewType } from '../types';

interface HeaderProps {
  onNavigate: (view: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <div className="relative bg-gradient-to-br from-violet-700 to-indigo-700 pt-12 pb-24 px-6 curved-header shrink-0 z-10 shadow-lg">
      <div className="flex justify-between items-center mb-8">
        {/* Profile Section with Active Dot - Clickable */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('profile')}
        >
          <div className="relative transition-transform group-hover:scale-105">
            <div className="w-10 h-10 rounded-2xl border-2 border-white/30 overflow-hidden shadow-sm group-hover:border-white/60 transition-colors">
              <img 
                alt="Azmi Head Brewer" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1583336130561-1d934b1262d1?q=80&w=300&auto=format&fit=crop"
              />
            </div>
            {/* Online/Active Dot */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-violet-700 rounded-full shadow-sm"></div>
          </div>
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">Owner Dashboard</p>
            <p className="text-white text-sm font-semibold tracking-tight flex items-center gap-1">
              Azmi Head Brewer
              <span className="material-symbols-outlined text-[10px] opacity-60">chevron_right</span>
            </p>
          </div>
        </div>

        {/* Right Actions: Notifications & Store Pill */}
        <div className="flex items-center gap-3">
          {/* Notification Bell - Updated to Squircle (General -> Indigo tint in white context) */}
          <button className="relative w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white border border-white/10 shadow-inner transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-violet-600 shadow-sm"></span>
          </button>
          
          {/* Store Pill */}
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors border border-white/10 shadow-inner uppercase tracking-wide">
            <span className="material-symbols-outlined text-[16px]">store</span>
            BrewCart
          </button>
        </div>
      </div>
      
      <div className="text-center mt-4 mb-6">
        <p className="text-white/70 text-sm mb-1 font-medium tracking-wide">Total Revenue</p>
        <h1 className="text-5xl font-semibold text-white tracking-tight">
          RM 45,600<span className="text-2xl text-white/60 font-medium">.00</span>
        </h1>
      </div>
    </div>
  );
};

export default Header;