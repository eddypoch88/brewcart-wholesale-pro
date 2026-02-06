import React from 'react';
import InventoryGrid from './InventoryGrid';

interface DashboardProps {
    items: any[];
}

export default function Dashboard({ items }: DashboardProps) {
    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gudang Stok</h1>
                    <p className="text-slate-500 text-sm">Manage your wholesale beer inventory</p>
                </div>
                <div className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    Warehouse
                </div>
            </header>

            {/* Pass 'items' to Grid */}
            <InventoryGrid items={items} />
        </div>
    );
}