import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
    AlertCircle, Loader2, Eye, EyeOff, X, Mail, MessageSquare, Send,
    ShoppingCart, BarChart3, Package, CheckCircle, Star, TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Forgot Password Modal ──────────────────────────────────────────────────
function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/reset-password`,
            });
            if (error) throw error;
            setSent(true);
            toast.success('Reset link sent! Check your inbox.');
        } catch (err: any) {
            toast.error(err.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"><X size={18} /></button>
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-lg">Forgot Password?</h2>
                        <p className="text-slate-400 text-sm">We'll send a reset link to your email</p>
                    </div>
                </div>
                {sent ? (
                    <div className="text-center py-4">
                        <div className="text-4xl mb-3">📬</div>
                        <p className="text-green-400 font-semibold">Reset link sent!</p>
                        <p className="text-slate-400 text-sm mt-1">Check your inbox or spam folder.</p>
                        <button onClick={onClose} className="mt-4 w-full h-11 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors">Close</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-11 px-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="admin@example.com" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full h-11 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-xl font-bold transition-all">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

// ─── Contact Support Modal ──────────────────────────────────────────────────
function ContactSupportModal({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('support_requests').insert({ name, email, message, status: 'open' });
            if (error) throw error;
            setSent(true);
            toast.success('Support request sent!');
        } catch (err: any) {
            toast.error(err.message || 'Failed to send. Try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"><X size={18} /></button>
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-lg">Contact Support</h2>
                        <p className="text-slate-400 text-sm">We'll respond as soon as possible</p>
                    </div>
                </div>
                {sent ? (
                    <div className="text-center py-4">
                        <div className="text-4xl mb-3">✅</div>
                        <p className="text-green-400 font-semibold">Request received!</p>
                        <p className="text-slate-400 text-sm mt-1">Our team will contact you shortly.</p>
                        <button onClick={onClose} className="mt-4 w-full h-11 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors">Close</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full h-11 px-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="Ahmad" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-11 px-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="admin@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                            <textarea required rows={3} value={message} onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                                placeholder="Describe your issue..." />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full h-11 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded-xl font-bold transition-all">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            {loading ? 'Sending...' : 'Send Request'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

// ─── Right Panel — Marketing / Visual Zone ─────────────────────────────────
function MarketingPanel() {
    const features = [
        { icon: <ShoppingCart className="w-4 h-4" />, text: "Manage Orders in Real-Time" },
        { icon: <Package className="w-4 h-4" />, text: "Full Inventory Control" },
        { icon: <BarChart3 className="w-4 h-4" />, text: "Revenue Analytics & Insights" },
        { icon: <TrendingUp className="w-4 h-4" />, text: "WhatsApp Order Notifications" },
    ];

    return (
        <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex-col items-center justify-center p-12">

            {/* Background grid pattern */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

            {/* Glow blobs */}
            <div className="absolute top-20 right-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-lg w-full">

                {/* Logo + Brand */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">BrewCart</span>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/30">PRO</span>
                </div>

                {/* Headline */}
                <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
                    Your Coffee Business,<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                        Run Smarter.
                    </span>
                </h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                    The all-in-one wholesale platform built for modern coffee businesses. From orders to analytics — everything in one place.
                </p>

                {/* Feature list */}
                <div className="space-y-3 mb-10">
                    {features.map((f, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 shrink-0">
                                {f.icon}
                            </div>
                            <span className="text-slate-300 text-sm font-medium">{f.text}</span>
                        </div>
                    ))}
                </div>

                {/* Mock Dashboard Card — CSS only */}
                <div className="transform rotate-1 hover:rotate-0 transition-transform duration-500">
                    <div className="bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-2xl p-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-400 text-xs font-medium">Today's Overview</span>
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            {[
                                { label: 'Revenue', value: 'RM 4,820', color: 'text-green-400' },
                                { label: 'Orders', value: '24', color: 'text-blue-400' },
                                { label: 'Products', value: '87', color: 'text-amber-400' },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-slate-900/50 rounded-xl p-3">
                                    <p className="text-slate-500 text-[10px] mb-1">{stat.label}</p>
                                    <p className={`font-bold text-sm ${stat.color}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                        {/* Mini bar chart */}
                        <div className="flex items-end gap-1 h-10">
                            {[30, 60, 40, 80, 55, 90, 70].map((h, i) => (
                                <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-sm opacity-70"
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
                        <p className="text-slate-300 text-sm italic">"BrewCart changed how we manage wholesale orders. Highly recommended!"</p>
                        <p className="text-slate-500 text-xs mt-1">— Ahmad Farouk, Coffee Supplier KL</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Login Page ────────────────────────────────────────────────────────
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForgot, setShowForgot] = useState(false);
    const [showSupport, setShowSupport] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/admin/dashboard';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) throw authError;
            toast.success('Welcome back! 🚀');
            navigate(from, { replace: true });
        } catch (err: any) {
            setError('Invalid email or password. Please try again.');
            toast.error('Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
            {showSupport && <ContactSupportModal onClose={() => setShowSupport(false)} />}

            <div className="min-h-screen flex w-full">

                {/* ── LEFT: Form Panel ── */}
                <div className="w-full lg:w-[45%] flex flex-col items-center justify-center bg-slate-900 px-8 py-12">
                    <div className="w-full max-w-sm">

                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                                <ShoppingCart className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-bold text-xl tracking-tight">BrewCart</span>
                        </div>

                        {/* Heading */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-extrabold text-white">Welcome back 👋</h1>
                            <p className="text-slate-400 mt-2">Sign in to manage your coffee empire.</p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-400 font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                                <input
                                    type="email" required value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 px-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="admin@example.com"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-slate-400">Password</label>
                                    <button type="button" onClick={() => setShowForgot(true)}
                                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'} required value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-12 px-4 pr-12 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1" tabIndex={-1}>
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={loading}
                                className="w-full h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 mt-2">
                                {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Signing in...</> : 'Sign In →'}
                            </button>
                        </form>

                        {/* Footer links */}
                        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                            <p className="text-slate-500">
                                No account yet?{' '}
                                <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                                    Create your store →
                                </Link>
                            </p>
                            <button type="button" onClick={() => setShowSupport(true)}
                                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors font-medium">
                                <MessageSquare size={14} />
                                Contact Support
                            </button>
                        </div>

                        {/* Trust badge */}
                        <p className="text-center text-xs text-slate-600 mt-8">
                            <CheckCircle className="inline w-3.5 h-3.5 mr-1 text-green-600" />
                            Secure login powered by Supabase
                        </p>
                    </div>
                </div>

                {/* ── RIGHT: Marketing Panel ── */}
                <MarketingPanel />
            </div>
        </>
    );
}
