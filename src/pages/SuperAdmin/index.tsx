import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const SUPER_ADMIN_EMAIL = 'eddypoch88@gmail.com';

export default function SuperAdminLayout() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthorized(user?.email === SUPER_ADMIN_EMAIL);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!isAuthorized) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 overflow-y-auto">
            <Outlet />
        </div>
    );
}
