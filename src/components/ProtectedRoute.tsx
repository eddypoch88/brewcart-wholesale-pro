import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useStore as useStoreCtx } from '../context/StoreContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireSuperAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireSuperAdmin }: ProtectedRouteProps) {
    const { user, isSuperAdmin, loading: authLoading } = useAuth();
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
    // (skip this check if we're already going to /onboarding OR if they are a super_admin)
    if (!storeId && !location.pathname.startsWith('/onboarding') && !isSuperAdmin) {
        return <Navigate to="/onboarding" replace />;
    }

    // Super Admin protection
    if (requireSuperAdmin && !isSuperAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <>{children}</>;
}
