import React from 'react';

const SpendingTrends: React.FC = () => {
  return (
    <div className="px-6 pt-12 pb-28">
      <div className="flex items-center justify-between mt-2">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white tracking-tight">Sales Performance</h2>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">Aug 1 - Aug 22, 2023</span>
      </div>

      <div className="bg-slate-100 dark:bg-gray-800 p-1 rounded-2xl flex mt-6">
        <button className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-white dark:bg-gray-700 text-slate-800 dark:text-white shadow-[0_10px_20px_rgba(0,0,0,0.05)] transition-all">
          By Category
        </button>
        <button className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-all">
          By Outlet
        </button>
      </div>

      <div className="flex justify-center py-6 relative">
        <div
          className="relative w-64 h-64 rounded-full shadow-inner flex items-center justify-center"
          style={{
            background: 'conic-gradient(#EF4444 0% 20%,#EC4899 20% 35%,#8B5CF6 35% 50%,#3B82F6 50% 62%,#06B6D4 62% 71%,#10B981 71% 78%,#84CC16 78% 81%,#F97316 81% 100%)'
          }}
        >
          <div className="w-40 h-40 bg-card-light dark:bg-card-dark rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center z-10 transition-colors duration-300">
            <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">RM 45,600</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-semibold uppercase tracking-wide">Total Sales</span>
          </div>
          <div className="absolute inset-0 pointer-events-none text-white text-[10px] font-bold">
            <span className="absolute top-10 right-16">20%</span>
            <span className="absolute top-24 right-6">15%</span>
            <span className="absolute bottom-16 right-12">15%</span>
            <span className="absolute bottom-8 left-28">12%</span>
            <span className="absolute bottom-16 left-12">9%</span>
            <span className="absolute top-28 left-8">7%</span>
            <span className="absolute top-10 left-20">20%</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide text-xs pl-1">Top Selling Categories</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800 dark:text-white tracking-tight">35% Draft Pints</span>
            </div>
            <span className="material-icons-round text-xs text-emerald-500 transform rotate-45">arrow_upward</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-chart-red rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">RM 15,960 of RM 45,600</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800 dark:text-white tracking-tight">25% Cans/Bottles</span>
            </div>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-chart-pink rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">RM 11,400 of RM 45,600</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800 dark:text-white tracking-tight">20% Keg Sales</span>
            </div>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-chart-purple rounded-full" style={{ width: '50%' }}></div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">RM 9,120 of RM 45,600</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800 dark:text-white tracking-tight">15% Merchandise</span>
            </div>
            <span className="material-icons-round text-xs text-emerald-500 transform rotate-45">arrow_upward</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-chart-indigo rounded-full" style={{ width: '40%' }}></div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">RM 6,840 of RM 45,600</p>
        </div>

        <div className="space-y-2 pb-6">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800 dark:text-white tracking-tight">5% Kitchen/Snacks</span>
            </div>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-chart-blue rounded-full" style={{ width: '20%' }}></div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">RM 2,280 of RM 45,600</p>
        </div>
      </div>
    </div>
  );
};

export default SpendingTrends;