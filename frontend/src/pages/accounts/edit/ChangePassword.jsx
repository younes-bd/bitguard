import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../../shared/core/services/client';
import { ArrowLeft, Save, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.new_password !== formData.confirm_password) {
            setError("New passwords do not match.");
            return;
        }

        if (formData.new_password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setSaving(true);

        try {
            await client.put('accounts/change-password/', {
                old_password: formData.old_password,
                new_password: formData.new_password
            });
            setSuccess("Password updated successfully.");
            setTimeout(() => {
                navigate('/account/security');
            }, 1000);
        } catch (err) {
            console.error("Failed to change password", err);
            const msg = err.response?.data?.old_password?.[0] ||
                err.response?.data?.new_password?.[0] ||
                "Failed to update password. Please check your current password.";
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/account/security" className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Change Password</h1>
                    <p className="text-slate-400">Update your password to keep your account secure.</p>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input
                                type="password"
                                name="old_password"
                                value={formData.old_password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input
                                type="password"
                                name="new_password"
                                value={formData.new_password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input
                                type="password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
