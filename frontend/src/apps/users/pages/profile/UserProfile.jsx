import React, { useState, useEffect } from 'react';
import client from '../../../../core/api/client';
import { User, Mail, Shield, CheckCircle2, Save, XCircle, Clock, Smartphone } from 'lucide-react';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        phone_number: ''
    });

    const fetchUser = async () => {
        try {
            const res = await client.get('iam/me/');
            setUser(res.data);
            setForm({
                first_name: res.data.first_name || '',
                last_name: res.data.last_name || '',
                phone_number: res.data.phone_number || ''
            });
        } catch (err) {
            console.error("Error fetching user:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await client.patch(`iam/users/${user.id}/`, form);
            alert("Profile updated successfully!");
            fetchUser();
        } catch (error) {
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[500px]">
                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <User className="text-blue-500" size={32} />
                        My Profile
                    </h1>
                    <p className="text-slate-400 mt-1">Manage your personal information and security preferences.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex items-center gap-6 bg-slate-900/50">
                            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border-2 border-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-2xl uppercase shadow-inner">
                                {user?.first_name?.[0] || user?.username?.[0] || '?'}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{user?.username}</h2>
                                <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                                    <Mail size={14} /> {user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300">First Name</label>
                                    <input type="text" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300">Last Name</label>
                                    <input type="text" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300">Phone Number</label>
                                    <input type="tel" value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300">Email Address (Read-Only)</label>
                                    <input type="email" value={user?.email || ''} readOnly className="w-full bg-slate-950 border border-slate-800 text-slate-500 px-4 py-2.5 rounded-xl cursor-not-allowed" />
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-slate-800 flex justify-end">
                                <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50">
                                    <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Column: Security */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Shield className="text-emerald-500" size={20} /> Security Status
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                                <div className="flex items-center gap-3">
                                    <Smartphone className={user?.mfa_enabled ? "text-emerald-500" : "text-slate-500"} size={20} />
                                    <div>
                                        <div className="text-sm font-bold text-slate-200">Two-Factor Auth</div>
                                        <div className="text-xs text-slate-500">{user?.mfa_enabled ? 'Enabled' : 'Not configured'}</div>
                                    </div>
                                </div>
                                {user?.mfa_enabled ? (
                                    <span className="bg-emerald-500/10 text-emerald-500 p-1.5 rounded-full"><CheckCircle2 size={16} /></span>
                                ) : (
                                    <span className="bg-slate-800 text-slate-500 p-1.5 rounded-full"><XCircle size={16} /></span>
                                )}
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                                <div className="flex items-center gap-3">
                                    <Clock className="text-blue-500" size={20} />
                                    <div>
                                        <div className="text-sm font-bold text-slate-200">Last Login</div>
                                        <div className="text-xs text-slate-500">{new Date(user?.last_login || user?.date_joined).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
