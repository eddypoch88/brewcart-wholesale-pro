import React from 'react';

interface InventoryGridProps {
  items: any[];
}

const InventoryGrid: React.FC<InventoryGridProps> = ({ items }) => {
  // CRITICAL FIX: Safety Check
  if (!items) {
    return <div className="p-10 text-center text-slate-500">Loading Inventory...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-5 pb-28">
      {items.map((product) => (
        <div
          key={product.id}
          className="bg-white dark:bg-surface-dark p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer hover:-translate-y-1 h-full flex flex-col min-h-[210px]"
        >
          {/* Image Area - Compact & Rounded */}
          <div className="h-24 rounded-2xl bg-slate-50 dark:bg-slate-900 mb-3 overflow-hidden flex items-center justify-center relative">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="text-slate-300 text-[10px] uppercase font-bold tracking-widest">No Image</div>
            )}
          </div>

          {/* Floating Stock Badge */}
          <div className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full z-10 shadow-sm ${(typeof product.stock === 'number' ? product.stock : parseInt(product.stock)) < 100
              ? 'bg-red-100 text-red-600'
              : 'bg-emerald-50 text-emerald-600'
            }`}>
            {(typeof product.stock === 'number' ? product.stock : parseInt(product.stock)) < 100 ? 'Low Stock' : 'In Stock'}
          </div>

          {/* Info Area */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-bold text-slate-900 dark:text-white leading-tight text-sm tracking-tight line-clamp-2 mb-1">
              {product.name}
            </h3>
            <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mt-auto">
              {product.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryGrid;