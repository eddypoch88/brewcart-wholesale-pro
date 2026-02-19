import React from 'react';

const HeroChart: React.FC = () => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-[2.5rem] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white tracking-tight">Sales Overview</h2>
          <div className="flex items-center gap-1 mt-1">
            <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs px-2 py-0.5 rounded-full font-semibold flex items-center uppercase tracking-wide">
              <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
              +18.5%
            </span>
            <span className="text-slate-400 text-xs font-medium">vs last month</span>
          </div>
        </div>
        
        {/* Updated: Squircle Action Button (General Context -> Indigo) */}
        <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-slate-600 transition-colors">
          <span className="material-symbols-outlined text-[20px]">more_horiz</span>
        </button>
      </div>
      <div className="h-48 w-full mb-6 relative">
        <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-300 dark:text-slate-600 font-medium">
          <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full h-0"></div>
          <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full h-0"></div>
          <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full h-0"></div>
          <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full h-0"></div>
          <div className="border-b border-slate-200 dark:border-slate-700 w-full h-0"></div>
        </div>
        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 100">
          <defs>
            <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.3 }}></stop>
              <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 0 }}></stop>
            </linearGradient>
          </defs>
          <path d="M0,80 C40,80 50,40 90,50 C130,60 140,20 180,30 C220,40 230,10 270,40 L300,35 L300,100 L0,100 Z" fill="url(#gradient)"></path>
          <path d="M0,80 C40,80 50,40 90,50 C130,60 140,20 180,30 C220,40 230,10 270,40 L300,35" fill="none" stroke="#10B981" strokeLinecap="round" strokeWidth="3"></path>
          <circle className="fill-white stroke-emerald-500 stroke-2" cx="90" cy="50" r="4"></circle>
          <circle className="fill-emerald-500 stroke-white stroke-2 shadow-lg" cx="180" cy="30" r="6"></circle>
        </svg>
      </div>
      <div className="flex justify-between bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl">
        <button className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">Day</button>
        <button className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">Week</button>
        <button className="flex-1 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-[0_10px_20px_rgba(0,0,0,0.05)]">Month</button>
        <button className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">Year</button>
      </div>
    </div>
  );
};

export default HeroChart;