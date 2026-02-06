import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../shared/core/hooks/useAuth';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 2FA State
    const [showOTP, setShowOTP] = useState(false);
    const [tempUserId, setTempUserId] = useState(null);
    const [otpCode, setOtpCode] = useState('');

    const navigate = useNavigate();
    const { login, verifyOtp } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginSuccess = () => {
        navigate('/dashboard');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await login(formData.email, formData.password);

            // Check if backend requests OTP (assuming 'action' is in the returned data)
            if (data.action === 'require_otp') {
                setShowOTP(true);
                setTempUserId(data.temp_user_id);
            } else {
                handleLoginSuccess();
            }
        } catch (err) {
            console.error("Login error", err);
            setError(err.response?.data?.detail || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await verifyOtp(tempUserId, otpCode);
            handleLoginSuccess();
        } catch (err) {
            console.error("OTP Error", err);
            setError("Invalid verification code");
        } finally {
            setLoading(false);
        }
    };

    if (showOTP) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md animate-in fade-in zoom-in duration-300">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-white">2-Step Verification</h1>
                        <p className="text-slate-400 mt-2">Enter the code sent to your email.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Verification Code</label>
                            <input
                                type="text"
                                maxLength="6"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-center text-2xl tracking-widest"
                                placeholder="000000"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verifying...' : 'Verify'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button onClick={() => setShowOTP(false)} className="text-sm text-slate-400 hover:text-white transition-colors">
                            Back to login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                    <p className="text-slate-400 mt-2">Sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-slate-500" size={20} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-slate-500" size={20} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-slate-400 cursor-pointer">
                            <input type="checkbox" className="mr-2 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-offset-0 focus:ring-blue-500/50" />
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
                    >
                        {loading ? (
                            <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Create one now</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;

