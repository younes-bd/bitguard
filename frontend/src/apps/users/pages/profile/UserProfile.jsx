import React, { useState, useEffect } from 'react';
import { useAuth } from '@/core/hooks/useAuth';
import { useTenant } from '@/core/context/TenantContext';
import client from '@/core/api/client';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Shield, Key, Clock, LogIn, Camera, Globe, SlidersHorizontal, CheckCircle2, XCircle, Smartphone, Loader2, Briefcase } from 'lucide-react';

const UserProfile = () => {
    const { user, refetchUser } = useAuth();
    const { tenant } = useTenant();
    const [activeTab, setActiveTab] = useState('profile');
    const [saving, setSaving] = useState(false);
    const [activityLogs, setActivityLogs] = useState([]);
    const [activityLoading, setActivityLoading] = useState(false);
    
    const [sessions, setSessions] = useState([]);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        job_title: '',
        phone: '',
        language: 'en',
        timezone: 'UTC',
        manager: '',
        theme: 'dark',
        notifications: 'all',
        default_home: '/dashboard',
        avatarFile: null,
        avatarPreview: null
    });

    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [passwordSaving, setPasswordSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                job_title: user.job_title || '',
                phone: user.phone || '',
                language: user.language || 'en',
                timezone: user.timezone || 'UTC',
                manager: user.manager || '',
                theme: user.theme || 'dark',
                notifications: user.notifications || 'all',
                default_home: user.default_home || '/dashboard',
                avatarFile: null,
                avatarPreview: user.avatar || null
            });
        }
    }, [user]);

    const loadActivity = async () => {
        setActivityLoading(true);
        try {
            const res = await client.get('users/activity/');
            setActivityLogs(res.data?.results || res.data || []);
        } catch {
            setActivityLogs([]);
        } finally {
            setActivityLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'activity') {
            loadActivity();
        } else if (activeTab === 'security') {
            fetchSessions();
        }
    }, [activeTab]);

    const fetchSessions = async () => {
        setSessionsLoading(true);
        try {
            const res = await client.get('users/sessions/');
            setSessions(res.data);
        } catch {
            toast.error('Failed to load sessions');
        } finally {
            setSessionsLoading(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm(f => ({ ...f, avatarFile: file, avatarPreview: URL.createObjectURL(file) }));
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('first_name', form.first_name);
            formData.append('last_name', form.last_name);
            formData.append('job_title', form.job_title);
            formData.append('phone', form.phone);
            formData.append('language', form.language);
            formData.append('timezone', form.timezone);
            formData.append('theme', form.theme);
            formData.append('notifications', form.notifications);
            formData.append('default_home', form.default_home);
            if (form.manager) formData.append('manager', form.manager);
            if (form.avatarFile) formData.append('avatar', form.avatarFile);

            await client.patch(`users/me/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Profile saved successfully');
            if (refetchUser) refetchUser();
        } catch (error) {
            toast.error('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSave = async (e) => {
        e.preventDefault();
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            toast.error('New passwords do not match');
            return;
        }
        
        setPasswordSaving(true);
        try {
            await client.post('users/change-password/', { 
                current_password: passwordForm.current_password, 
                new_password: passwordForm.new_password 
            });
            toast.success('Password updated successfully');
            setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setPasswordSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6 mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        {tenant?.logo ? (
                            <img src={tenant.logo} alt={tenant.name || "Logo"} className="w-8 h-8 rounded-lg object-contain bg-white p-1" />
                        ) : (
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Shield size={16} className="text-white" />
                            </div>
                        )}
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">{tenant?.name || 'BitGuard'} Network</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <User className="text-blue-500" size={32} />
                        My Profile
                    </h1>
                    <p className="text-slate-400 mt-1">Manage your personal information and security preferences.</p>
                </div>
            </div>

            <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-xl w-fit border border-slate-800">
                <button 
                    onClick={() => setActiveTab('profile')} 
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                >
                    Profile
                </button>
                <button 
                    onClick={() => setActiveTab('security')} 
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'security' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                >
                    Security
                </button>
                <button 
                    onClick={() => setActiveTab('activity')} 
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'activity' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                >
                    Activity
                </button>
                <button 
                    onClick={() => setActiveTab('preferences')} 
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'preferences' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                >
                    Preferences
                </button>
            </div>

            {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-3">
                        <form onSubmit={handleProfileSave} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-6 border-b border-slate-800 flex items-center gap-2">
                                <User size={20} className="text-blue-500" />
                                <h2 className="text-lg font-bold text-white">Personal Information</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">First Name</label>
                                        <input type="text" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Last Name</label>
                                        <input type="text" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-semibold text-slate-300">Job Title</label>
                                        <input type="text" value={form.job_title} onChange={e => setForm({...form, job_title: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all" placeholder="e.g. System Administrator" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Phone Number</label>
                                        <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Email Address</label>
                                        <input type="email" value={user?.email || ''} readOnly className="w-full bg-slate-950/50 border border-slate-800 text-slate-500 px-4 py-2.5 rounded-xl cursor-not-allowed opacity-70" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Manager</label>
                                        <input type="text" value={form.manager} onChange={e => setForm({...form, manager: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all" placeholder="Manager ID or Name..." />
                                    </div>
                                </div>
                                
                                <div className="pt-6 border-t border-slate-800 flex justify-end">
                                    <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50">
                                        {saving ? <Loader2 size={18} className="animate-spin" /> : null}
                                        {saving ? 'Saving...' : 'Save Profile'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 flex flex-col items-center">
                            <h3 className="text-sm font-bold text-slate-300 mb-6">Profile Photo</h3>
                            <div className="flex flex-col items-center gap-4 w-full">
                                <div className="relative group w-32 h-32">
                                    {form.avatarPreview ? (
                                        <img src={form.avatarPreview} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-slate-800" />
                                    ) : (
                                        <div className="w-full h-full rounded-full border-4 border-slate-800 bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-500">
                                            {(user?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                                        </div>
                                    )}
                                    <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
                                        <Camera size={28} className="text-white" />
                                    </label>
                                    <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                </div>
                                <p className="text-xs text-slate-500 text-center px-4">Upload a new photo. Recommended size is 256x256px.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'preferences' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-4">
                        <form onSubmit={handleProfileSave} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-6 border-b border-slate-800 flex items-center gap-2">
                                <SlidersHorizontal size={20} className="text-blue-500" />
                                <h2 className="text-lg font-bold text-white">System Preferences</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Language</label>
                                        <select value={form.language} onChange={e => setForm({...form, language: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all">
                                            <option value="en">English</option>
                                            <option value="fr">French</option>
                                            <option value="ar">Arabic</option>
                                            <option value="es">Spanish</option>
                                            <option value="de">German</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Timezone</label>
                                        <select value={form.timezone} onChange={e => setForm({...form, timezone: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all">
                                            <option value="UTC">UTC</option>
                                            <option value="Europe/London">Europe/London</option>
                                            <option value="Europe/Paris">Europe/Paris</option>
                                            <option value="America/New_York">America/New_York</option>
                                            <option value="Asia/Dubai">Asia/Dubai</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Notifications</label>
                                        <select value={form.notifications} onChange={e => setForm({...form, notifications: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all">
                                            <option value="all">All notifications</option>
                                            <option value="important">Important only</option>
                                            <option value="none">None</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Theme</label>
                                        <select value={form.theme} onChange={e => setForm({...form, theme: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all">
                                            <option value="dark">Dark</option>
                                            <option value="light">Light</option>
                                            <option value="system">System Default</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-semibold text-slate-300">Default Home Action</label>
                                        <input type="text" value={form.default_home} onChange={e => setForm({...form, default_home: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all" placeholder="/dashboard" />
                                    </div>
                                </div>
                                
                                <div className="pt-6 border-t border-slate-800 flex justify-end">
                                    <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50">
                                        {saving ? <Loader2 size={18} className="animate-spin" /> : null}
                                        {saving ? 'Saving...' : 'Save Preferences'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'security' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form onSubmit={handlePasswordSave} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
                            <Key size={20} className="text-blue-500" />
                            <h2 className="text-lg font-bold text-white">Change Password</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Current Password</label>
                                <input type="password" value={passwordForm.current_password} onChange={e => setPasswordForm({...passwordForm, current_password: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">New Password</label>
                                <input type="password" value={passwordForm.new_password} onChange={e => setPasswordForm({...passwordForm, new_password: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all" required minLength={8} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Confirm New Password</label>
                                <input type="password" value={passwordForm.confirm_password} onChange={e => setPasswordForm({...passwordForm, confirm_password: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all" required />
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button type="submit" disabled={passwordSaving} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50">
                                    {passwordSaving ? <Loader2 size={18} className="animate-spin" /> : null}
                                    {passwordSaving ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
                            <Shield size={20} className="text-emerald-500" />
                            <h2 className="text-lg font-bold text-white">Two-Factor Authentication</h2>
                        </div>
                        <div className="p-6">
                            <div className={`p-5 border rounded-xl flex items-start gap-4 mb-6 ${user?.mfa_enabled ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${user?.mfa_enabled ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                                    <Smartphone size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                                        Authenticator App
                                        {user?.mfa_enabled ? (
                                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/20">Enabled</span>
                                        ) : (
                                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/20">Disabled</span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-slate-400 mt-1">
                                        {user?.mfa_enabled 
                                            ? "Your account is protected by an additional layer of security." 
                                            : "Add an extra layer of security to your account by requiring a code from an authenticator app."}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex justify-end">
                                {user?.mfa_enabled ? (
                                    <button onClick={() => toast('2FA management coming soon', { icon: '🔐' })} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors">
                                        Manage 2FA
                                    </button>
                                ) : (
                                    <button onClick={() => toast('2FA setup coming soon — contact your administrator', { icon: '🔐' })} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold transition-colors">
                                        Enable 2FA
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden mt-6 md:col-span-2">
                        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
                            <Globe size={20} className="text-indigo-500" />
                            <h2 className="text-lg font-bold text-white">Active Sessions</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-slate-400 mb-4">Manage your active sessions across different devices.</p>
                            <div className="space-y-3">
                                {sessionsLoading ? (
                                    <div className="p-4 text-center text-slate-500">
                                        <Loader2 size={24} className="animate-spin text-indigo-500 mx-auto" />
                                    </div>
                                ) : sessions.length === 0 ? (
                                    <div className="p-4 text-center text-slate-500">No active sessions found.</div>
                                ) : sessions.map(session => (
                                    <div key={session.id} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                                        <div>
                                            <p className="text-sm font-bold text-slate-200">Active Session</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Last active: {new Date(session.created_at).toLocaleString()}</p>
                                        </div>
                                        <button 
                                            onClick={async () => {
                                                try {
                                                    await client.delete(`users/sessions/${session.jti}/`);
                                                    toast.success('Session revoked');
                                                    fetchSessions();
                                                } catch (e) {
                                                    toast.error('Failed to revoke session');
                                                }
                                            }}
                                            className="px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-lg text-xs font-bold transition-colors border border-rose-500/20"
                                        >
                                            Revoke
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'activity' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-800 flex items-center gap-2">
                        <Clock size={20} className="text-blue-500" />
                        <h2 className="text-lg font-bold text-white">Recent Activity</h2>
                    </div>
                    
                    {activityLoading ? (
                        <div className="p-12 flex flex-col items-center justify-center text-slate-500 gap-3">
                            <Loader2 size={32} className="animate-spin text-blue-500" />
                            <p>Loading activity logs...</p>
                        </div>
                    ) : activityLogs.length > 0 ? (
                        <div className="px-6 py-2">
                            {activityLogs.map((log, idx) => (
                                <div key={log.id || idx} className="flex items-start gap-4 py-4 border-b border-slate-800 last:border-0">
                                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                        <LogIn size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">{log.action || 'Login'}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{new Date(log.timestamp).toLocaleString()} &middot; {log.ip_address}</p>
                                        {log.user_agent && <p className="text-xs text-slate-600 mt-0.5 truncate max-w-xl" title={log.user_agent}>{log.user_agent}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 flex flex-col items-center justify-center text-slate-500 gap-3">
                            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-2">
                                <Clock size={24} className="text-slate-600" />
                            </div>
                            <p className="font-medium text-slate-400">No recent activity found</p>
                            <p className="text-sm text-slate-500">Login events and security actions will appear here.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfile;
