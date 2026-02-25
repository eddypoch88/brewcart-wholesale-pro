import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LogIn, AlertCircle, Loader2, Eye, EyeOff, X, Mail, MessageSquare, Send } from 'lucide-react';
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
            toast.success('Reset link sent! Check your email inbox/spam.');
        } catch (err: any) {
            toast.error(err.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>

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
                        <button
                            onClick={onClose}
                            className="mt-4 w-full h-11 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-11 px-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="admin@example.com"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all"
                        >
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
            const { error } = await supabase.from('support_requests').insert({
                name,
                email,
                message,
                status: 'open',
            });
            if (error) throw error;
            setSent(true);
            toast.success('Support request sent! Our team will get back to you.');
        } catch (err: any) {
            toast.error(err.message || 'Failed to send request. Try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>

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
                        <button
                            onClick={onClose}
                            className="mt-4 w-full h-11 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-11 px-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-11 px-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="admin@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Your Message</label>
                            <textarea
                                required
                                rows={3}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                                placeholder="Describe your issue..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            {loading ? 'Sending...' : 'Send Request'}
                        </button>
                    </form>
                )}
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
            toast.success('Successfully logged in');
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error(err);
            setError('Invalid email or password');
            toast.error('Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
            {showSupport && <ContactSupportModal onClose={() => setShowSupport(false)} />}

            <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
                <div className="w-full max-w-md">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
                        <p className="text-slate-400 mt-2">Sign in to manage your store</p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8">
                            <form onSubmit={handleLogin} className="space-y-6">

                                {/* Error Message */}
                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-500 font-medium">{error}</p>
                                    </div>
                                )}

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-12 px-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="admin@example.com"
                                    />
                                </div>

                                {/* Password with toggle */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-slate-300">
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowForgot(true)}
                                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full h-12 px-4 pr-12 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                                            tabIndex={-1}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-4 bg-slate-900/50 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-400">
                            <p>
                                Don't have an account?{' '}
                                <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                    Create your store →
                                </Link>
                            </p>
                            <button
                                type="button"
                                onClick={() => setShowSupport(true)}
                                className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-400 transition-colors font-medium"
                            >
                                <MessageSquare size={14} />
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
