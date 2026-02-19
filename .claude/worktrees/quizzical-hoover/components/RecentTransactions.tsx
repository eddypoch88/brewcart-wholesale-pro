import React from 'react';
import { Transaction } from '../src/shared/shared-types';

const MOCK_ORDERS: Transaction[] = [
  {
    id: 1,
    title: 'Order #8821',
    subtitle: 'Table 4 - 3x Premium Items',
    amount: '+ RM 120.00',
    date: '2 mins ago',
    type: 'income',
    status: 'Pending',
    icon: 'inventory_2',
    // Rule: Products/Items -> Blue
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 2,
    title: 'Order #8822',
    subtitle: 'Pickup - Standard Order',
    amount: '+ RM 180.00',
    date: '15 mins ago',
    type: 'income',
    status: 'Completed',
    icon: 'shopping_bag',
    // Rule: Order / General -> Indigo
    iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    id: 3,
    title: 'Supplier Payment',
    subtitle: 'Inventory Restock',
    amount: '- RM 4,500.00',
    date: 'Yesterday',
    type: 'expense',
    status: 'Paid',
    icon: 'local_shipping',
    // Rule: Payments / Alerts -> Orange
    iconBg: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    id: 4,
    title: 'Order #8820',
    subtitle: 'Service Refund',
    amount: '+ RM 200.00',
    date: 'Yesterday',
    type: 'income',
    status: 'Completed',
    icon: 'payments',
    // Rule: Success / Completed -> Emerald
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
];

interface RecentTransactionsProps {
  enableSearch?: boolean;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ enableSearch = false }) => {
  return (
    <div className="pb-20">
      <div className="mb-4 flex justify-between items-end px-2">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white tracking-tight">Recent Orders</h3>
        <button className="text-indigo-600 text-sm font-semibold hover:opacity-80 transition-opacity">See all</button>
      </div>

      {/* Admin Tool: Search Bar */}
      {enableSearch && (
        <div className="mb-6 px-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 flex items-center gap-3 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20">
            <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
            <input
              type="text"
              placeholder="Search orders by ID or Item..."
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:ring-0 p-0 font-medium"
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {MOCK_ORDERS.map((tx) => (
          <div
            key={tx.id}
            className="bg-surface-light dark:bg-surface-dark p-4 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 flex items-center justify-between group hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Squircle Icon Container - Premium SaaS Style */}
              {/* Rules: p-2, rounded-2xl, w-10/12 h-10/12 to maintain 20px icon ratio */}
              <div className={`w-12 h-12 rounded-2xl ${tx.iconBg} flex items-center justify-center ${tx.iconColor} shadow-sm p-2 transition-transform group-hover:scale-105`}>
                <span className="material-symbols-outlined text-[20px] font-medium">{tx.icon}</span>
              </div>
              <div>
                <p className="text-base font-semibold text-slate-800 dark:text-white tracking-tight">{tx.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{tx.subtitle}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <p className={`text-base font-bold ${tx.type === 'income' ? 'text-slate-800 dark:text-white' : 'text-slate-800 dark:text-white'}`}>
                {tx.amount}
              </p>

              {/* Premium Capsule Status Badge */}
              {tx.status === 'Pending' && (
                <span className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border border-amber-100 dark:border-amber-800">
                  Pending
                </span>
              )}
              {(tx.status === 'Completed' || tx.status === 'Paid') && (
                <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border border-emerald-100 dark:border-emerald-800">
                  {tx.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;