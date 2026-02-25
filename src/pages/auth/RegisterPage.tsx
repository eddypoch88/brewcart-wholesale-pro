import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
    UserPlus, AlertCircle, Loader2, CheckCircle2, Eye, EyeOff,
    Layers, BarChart3, Package, Star, TrendingUp, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Right Panel (same as Login) ───────────────────────────────────────────
function MarketingPanel() {
    const perks = [
        { icon: <CheckCircle className="w-4 h-4 text-green-400" />, text: "Free to start — no credit card required" },
        { icon: <CheckCircle className="w-4 h-4 text-green-400" />, text: "Launch your commerce portal in minutes" },
        { icon: <CheckCircle className="w-4 h-4 text-green-400" />, text: "Built-in order & notification automation" },
        { icon: <CheckCircle className="w-4 h-4 text-green-400" />, text: "Real-time inventory & revenue analytics" },
    ];

    return (
        <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex-col items-center justify-center p-12">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            <div className="absolute top-20 right-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-lg w-full">
                {/* Brand */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                        <Layers className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">ORB COMMERCE</span>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/30">PRO</span>
                </div>

                <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
                    Built for Wholesalers<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                        &amp; Retailers Alike.
                    </span>
                </h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                    Launch your commerce portal today and start managing orders, inventory, and customers from one powerful platform.
                </p>

                {/* Perks list */}
                <div className="space-y-3 mb-10">
                    {perks.map((p, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="shrink-0">{p.icon}</div>
                            <span className="text-slate-300 text-sm font-medium">{p.text}</span>
                        </div>
                    ))}
                </div>

                {/* CSS Dashboard preview card */}
                <div className="transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                    <div className="bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-2xl p-4 shadow-2xl">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="ml-2 text-slate-500 text-xs">Your Dashboard</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            {[
                                { label: 'Revenue', value: 'RM 4,820', color: 'text-green-400' },
                                { label: 'Orders', value: '24', color: 'text-blue-400' },
                                { label: 'Products', value: '87', color: 'text-amber-400' },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-slate-900/60 rounded-xl p-3">
                                    <p className="text-slate-500 text-[10px] mb-1">{stat.label}</p>
                                    <p className={`font-bold text-sm ${stat.color}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-end gap-1 h-10">
                            {[45, 70, 35, 85, 60, 90, 75].map((h, i) => (
                                <div key={i} className="flex-1 bg-gradient-to-t from-amber-600 to-amber-400 rounded-sm opacity-70"
                                    style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Testimonial */}
                <div className="mt-8 flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex shrink-0">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        ))}
                    </div>
                    <div>
                        <p className="text-slate-300 text-sm italic">"Setup took 5 minutes. Now I manage all my wholesale orders from one screen!"</p>
                        <p className="text-slate-500 text-xs mt-1">— Aisyah R., Wholesale Distributor Penang</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Register Page ─────────────────────────────────────────────────────
export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (password !== confirm) { setError('Passwords do not match.'); return; }

        setLoading(true);
        try {
            const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
            if (signUpError) throw signUpError;
            if (data.session) {
                toast.success('Account created! Let\'s set up your store 🚀');
                navigate('/onboarding', { replace: true });
            } else {
                setSuccess(true);
            }
        } catch (err: any) {
            if (err.message?.includes('already registered')) {
                setError('This email is already registered. Try logging in instead.');
            } else {
                setError(err.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
                <div className="w-full max-w-md text-center">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Check your inbox! 📬</h2>
                    <p className="text-slate-400 mb-6">
                        We sent a confirmation link to <span className="text-white font-medium">{email}</span>.<br />
                        Click it to activate your account, then come back and log in.
                    </p>
                    <Link to="/login" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex w-full">

            {/* ── LEFT: Form Panel ── */}
            <div className="w-full lg:w-[45%] flex flex-col items-center justify-center bg-slate-900 px-8 py-12">
                <div className="w-full max-w-sm">

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                            <Layers className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">ORB COMMERCE</span>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-white">Create Your Store</h1>
                        <p className="text-slate-400 mt-2">Launch your commerce portal in minutes.</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-400 font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 px-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="you@example.com" />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} required value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 px-4 pr-12 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Min. 6 characters" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1" tabIndex={-1}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Confirm Password</label>
                            <div className="relative">
                                <input type={showConfirm ? 'text' : 'password'} required value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    className="w-full h-12 px-4 pr-12 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="••••••••" />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1" tabIndex={-1}>
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={loading}
                            className="w-full h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 mt-2">
                            {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Creating account...</> : 'Create Account →'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                        <p className="text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                                Sign in →
                            </Link>
                        </p>
                    </div>

                    <p className="text-center text-xs text-slate-600 mt-6">
                        <CheckCircle className="inline w-3.5 h-3.5 mr-1 text-green-600" />
                        Enterprise-grade security by Supabase
                    </p>
                </div>
            </div>

            {/* ── RIGHT: Marketing Panel ── */}
            <MarketingPanel />
        </div>
    );
}
