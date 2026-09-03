import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import toast from 'react-hot-toast';
import { Key, Loader2, Lock } from 'lucide-react';

const SetPassword = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        new_password: '',
        confirm_password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (form.new_password !== form.confirm_password) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await authService.confirmPasswordReset({ 
                uid, 
                token, 
                new_password: form.new_password 
            });
            toast.success('Password set successfully!');
            navigate('/login');
        } catch (error) {
            toast.error(error?.response?.data?.detail || 'Failed to set password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
                        <Key size={32} />
                    </div>
                </div>
                
                <h1 className="text-2xl font-black text-white text-center mb-2">Set Your Password</h1>
                <p className="text-slate-400 text-center mb-8 text-sm">Please enter a new password for your account.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-300 ml-1">New Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                                type="password" 
                                value={form.new_password}
                                onChange={e => setForm({...form, new_password: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="••••••••"
                                required 
                                minLength={8}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-300 ml-1">Confirm Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                                type="password" 
                                value={form.confirm_password}
                                onChange={e => setForm({...form, confirm_password: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="••••••••"
                                required 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                        {loading ? 'Setting Password...' : 'Set Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetPassword;
