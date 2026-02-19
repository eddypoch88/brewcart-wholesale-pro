import React from 'react';
import SpendingTrends from './SpendingTrends';
import HeroChart from './HeroChart';
import RecentTransactions from './RecentTransactions';

const AnalyticsView: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 pt-6 px-4">
            <HeroChart />
            <SpendingTrends />
            <RecentTransactions />
        </div>
    );
};

export default AnalyticsView;
