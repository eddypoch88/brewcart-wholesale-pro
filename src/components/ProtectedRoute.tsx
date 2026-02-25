import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useStore as useStoreCtx } from '../context/StoreContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const { storeId, settingsLoading } = useStoreCtx();
    const location = useLocation();

    const loading = authLoading || settingsLoading;

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-400 font-medium">Verifying access...</p>
            </div>
        );
    }

    // Not logged in → send to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Logged in but no store yet → send to onboarding
    // (skip this check if we're already going to /onboarding)
    if (!storeId && !location.pathname.startsWith('/onboarding')) {
        return <Navigate to="/onboarding" replace />;
    }

    return <>{children}</>;
}
