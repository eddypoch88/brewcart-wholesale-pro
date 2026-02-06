import React from 'react';
import RecentTransactions from './RecentTransactions';

const OrderList: React.FC = () => {
    return (
        <>
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white px-2 tracking-tight">All Orders</h2>
            <RecentTransactions enableSearch={true} />
        </>
    );
};

export default OrderList;
