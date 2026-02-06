import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock password reset flow
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-bitguard-light-blue flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
                    <p className="text-slate-600 text-sm mt-2">Enter your email to receive recovery instructions.</p>
                </div>

                {submitted ? (
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                            <Mail size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Check your inbox</h3>
                        <p className="text-slate-600 text-sm">
                            We've sent password reset instructions to <span className="text-slate-900 font-medium">{email}</span>.
                        </p>
                        <Link to="/login" className="inline-block mt-4 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-medium transition-colors">
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 pl-10 text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder-slate-400"
                                    placeholder="name@company.com"
                                    required
                                />
                                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
                        >
                            Send Reset Link <ArrowRight size={18} />
                        </button>

                        <div className="text-center pt-2">
                            <Link to="/login" className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                <ArrowLeft size={14} /> Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
