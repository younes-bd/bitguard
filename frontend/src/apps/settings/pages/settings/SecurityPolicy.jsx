import React, { useState, useEffect } from 'react';
import { iamService } from '../../../../core/api/iamService';
import { ShieldAlert, Loader2, Save, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SecurityPolicy = () => {
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchPolicy = async () => {
        try {
            setLoading(true);
            const data = await iamService.getSecurityPolicy();
            setPolicy(data || {
                password_complexity: 'medium',
                session_timeout: 60,
                mfa_required: false,
                api_key_rotation: 90,
                failed_login_lock: 5,
                lock_duration: 30,
                concurrent_sessions: '3'
            });
        } catch (error) {
            toast.error("Failed to load security policy");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicy();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPolicy(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            if (policy.id) {
                await iamService.updateSecurityPolicy(policy.id, policy);
            } else {
                await iamService.updateSecurityPolicy('default', policy);
            }
            toast.success("Security Policy updated successfully");
        } catch (error) {
            toast.error("Failed to update security policy");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="animate-spin text-purple-500 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
                        <ShieldAlert className="text-rose-500" />
                        Global Security Policy
                    </h1>
                    <p className="text-slate-400">Configure tenant-wide authentication and session rules</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors disabled:opacity-50">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Policy
                </button>
            </div>

            <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Authentication Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-slate-500" /> Authentication
                        </h3>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Password Complexity</label>
                            <select 
                                name="password_complexity" 
                                value={policy?.password_complexity} 
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="low">Low (Min 8 chars)</option>
                                <option value="medium">Medium (Alphanumeric)</option>
                                <option value="high">High (Special Chars Required)</option>
                            </select>
                        </div>
                        
                        <div className="flex items-center gap-3 pt-2">
                            <input 
                                type="checkbox" 
                                id="mfa_required" 
                                name="mfa_required" 
                                checked={policy?.mfa_required} 
                                onChange={handleChange} 
                                className="w-4 h-4 text-rose-600 rounded bg-slate-950 border-slate-700 focus:ring-rose-500 focus:ring-offset-slate-900"
                            />
                            <label htmlFor="mfa_required" className="text-sm font-medium text-slate-300">
                                Enforce MFA for all users
                            </label>
                        </div>
                    </div>

                    {/* Session Management */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-slate-500" /> Session & Lockout
                        </h3>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Session Timeout (Minutes)</label>
                            <input 
                                type="number" 
                                name="session_timeout" 
                                value={policy?.session_timeout} 
                                onChange={handleChange} 
                                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Max Failed Logins</label>
                                <input 
                                    type="number" 
                                    name="failed_login_lock" 
                                    value={policy?.failed_login_lock} 
                                    onChange={handleChange} 
                                    className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Lock Duration (Mins)</label>
                                <input 
                                    type="number" 
                                    name="lock_duration" 
                                    value={policy?.lock_duration} 
                                    onChange={handleChange} 
                                    className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Concurrent Sessions per User</label>
                            <input 
                                type="text" 
                                name="concurrent_sessions" 
                                value={policy?.concurrent_sessions} 
                                onChange={handleChange} 
                                placeholder="e.g. 1, 3, or unlimited"
                                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SecurityPolicy;
