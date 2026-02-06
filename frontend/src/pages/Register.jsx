import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/core/hooks/useAuth';
import { UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth(); // Use context

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!termsAccepted) {
            setError("You must accept the Terms of Service.");
            return;
        }

        setLoading(true);
        try {
            await register({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Registration failed. Username may be taken.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center font-bold text-white text-xl mb-4 shadow-lg shadow-blue-500/20">
                        B
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 font-[Oswald] tracking-wide">Create Account</h2>
                    <p className="text-slate-400">Join BitGuard to manage your business.</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Username</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600"
                                placeholder="jdoe"
                                required
                            />
                            <User className="absolute left-3 top-3.5 text-slate-500" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600"
                                placeholder="name@company.com"
                                required
                            />
                            <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600"
                                placeholder="••••••••"
                                required
                            />
                            <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Confirm Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600"
                                placeholder="••••••••"
                                required
                            />
                            <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
                        </div>
                    </div>

                    <div className="flex items-start gap-2 mt-4 text-sm text-slate-400">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="mt-1 bg-slate-950 border-slate-700 rounded text-blue-600 focus:ring-offset-0 focus:ring-blue-500/50"
                        />
                        <label htmlFor="terms" className="cursor-pointer">
                            I agree to the <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 mt-6"
                    >
                        {loading ? 'Creating Account...' : (
                            <>
                                Sign Up <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                    <p className="text-slate-400 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

