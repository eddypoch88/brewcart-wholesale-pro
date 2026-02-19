import React from 'react';
import { Order } from '../../types';
import { Loader2 } from 'lucide-react';

interface OrderStatusDropdownProps {
    currentStatus: Order['status'];
    orderId: string;
    onStatusChange: (orderId: string, newStatus: Order['status']) => void;
    isUpdating: boolean;
}

const statusConfig: Record<Order['status'], { label: string; bgColor: string; textColor: string; borderColor: string }> = {
    pending: {
        label: 'Pending',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-200'
    },
    processing: {
        label: 'Processing',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200'
    },
    shipped: {
        label: 'Shipped',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200'
    },
    delivered: {
        label: 'Delivered',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200'
    },
    cancelled: {
        label: 'Cancelled',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200'
    }
};

export default function OrderStatusDropdown({
    currentStatus,
    orderId,
    onStatusChange,
    isUpdating
}: OrderStatusDropdownProps) {
    const config = statusConfig[currentStatus];

    return (
        <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
            <select
                value={currentStatus}
                onChange={(e) => onStatusChange(orderId, e.target.value as Order['status'])}
                disabled={isUpdating}
                className={`
          px-3 py-1.5 pr-8 rounded-lg text-xs font-semibold capitalize
          border-2 ${config.borderColor} ${config.bgColor} ${config.textColor}
          cursor-pointer hover:opacity-80 transition-opacity
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
          appearance-none
        `}
            >
                <option value="pending">⏳ Pending</option>
                <option value="processing">🔄 Processing</option>
                <option value="shipped">📦 Shipped</option>
                <option value="delivered">✅ Delivered</option>
                <option value="cancelled">❌ Cancelled</option>
            </select>

            {isUpdating && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Loader2 size={14} className="animate-spin text-slate-400" />
                </div>
            )}
        </div>
    );
}
