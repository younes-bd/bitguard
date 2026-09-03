import React, { useState, useEffect } from 'react';
import { usersService } from '../../../users/api/usersService';
import { ShieldAlert, Loader2, Save, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SecurityPolicy = () => {
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewPwd, setPreviewPwd] = useState('');
    const [timeoutMode, setTimeoutMode] = useState('60');

    const fetchPolicy = async () => {
        try {
            setLoading(true);
            const data = await usersService.getSecurityPolicy();
            const fetched = data || {};
            setPolicy({
                password_complexity: fetched.password_complexity || 'medium',
                pwd_min_length: fetched.pwd_min_length || 8,
                pwd_require_uppercase: fetched.pwd_require_uppercase ?? true,
                pwd_require_numbers: fetched.pwd_require_numbers ?? true,
                pwd_require_symbols: fetched.pwd_require_symbols ?? false,
                session_timeout: fetched.session_timeout || 60,
                mfa_required: fetched.mfa_required ?? false,
                failed_login_lock: fetched.failed_login_lock || 5,
                lock_duration: fetched.lock_duration || 30,
                concurrent_sessions: fetched.concurrent_sessions || '3',
                ip_allowlist: fetched.ip_allowlist || '',
                ip_blocklist: fetched.ip_blocklist || '',
                audit_trail_enabled: fetched.audit_trail_enabled ?? true
            });
            const st = fetched.session_timeout || 60;
            const isStandard = [60, 240, 480, 1440].includes(Number(st));
            setTimeoutMode(isStandard ? String(st) : 'custom');
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
                await usersService.updateSecurityPolicy(policy.id, policy);
            } else {
                await usersService.updateSecurityPolicy('default', policy);
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

    let requiredCount = 1; // min length is always required
    let passedCount = previewPwd.length >= (policy?.pwd_min_length || 8) ? 1 : 0;
    if (policy?.pwd_require_uppercase) { requiredCount++; if (/[A-Z]/.test(previewPwd)) passedCount++; }
    if (policy?.pwd_require_numbers) { requiredCount++; if (/[0-9]/.test(previewPwd)) passedCount++; }
    if (policy?.pwd_require_symbols) { requiredCount++; if (/[^A-Za-z0-9]/.test(previewPwd)) passedCount++; }

    let strengthPercentage = requiredCount === 0 ? 0 : (passedCount / requiredCount) * 100;
    let strengthColor = 'bg-rose-500';
    if (strengthPercentage === 100) strengthColor = 'bg-emerald-500';
    else if (strengthPercentage >= 50) strengthColor = 'bg-amber-500';

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
                        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
                            <Shield className="w-5 h-5 text-slate-500" /> Authentication
                        </h3>
                        
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
                                Enforce Two-Factor Authentication (2FA) for all users
                            </label>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <input 
                                type="checkbox" 
                                id="audit_trail_enabled" 
                                name="audit_trail_enabled" 
                                checked={policy?.audit_trail_enabled} 
                                onChange={handleChange} 
                                className="w-4 h-4 text-rose-600 rounded bg-slate-950 border-slate-700 focus:ring-rose-500 focus:ring-offset-slate-900"
                            />
                            <label htmlFor="audit_trail_enabled" className="text-sm font-medium text-slate-300">
                                Enable Comprehensive Audit Trail
                            </label>
                        </div>
                    </div>

                    {/* Password Policy */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
                            <Shield className="w-5 h-5 text-slate-500" /> Password Policy
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Min Length</label>
                                <input 
                                    type="number" 
                                    name="pwd_min_length" 
                                    value={policy?.pwd_min_length} 
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm text-slate-300">
                                <input type="checkbox" name="pwd_require_uppercase" checked={policy?.pwd_require_uppercase} onChange={handleChange} className="rounded bg-slate-950 border-slate-700 text-rose-600 focus:ring-rose-500" />
                                Require Uppercase Letters
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-300">
                                <input type="checkbox" name="pwd_require_numbers" checked={policy?.pwd_require_numbers} onChange={handleChange} className="rounded bg-slate-950 border-slate-700 text-rose-600 focus:ring-rose-500" />
                                Require Numbers
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-300">
                                <input type="checkbox" name="pwd_require_symbols" checked={policy?.pwd_require_symbols} onChange={handleChange} className="rounded bg-slate-950 border-slate-700 text-rose-600 focus:ring-rose-500" />
                                Require Symbols (!@#$)
                            </label>
                        </div>
                        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 mt-4">
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Strength Meter Preview</label>
                            <input 
                                type="text" 
                                value={previewPwd} 
                                onChange={e => setPreviewPwd(e.target.value)}
                                placeholder="Test password..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-rose-500 mb-2"
                            />
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-300 ${strengthColor}`} style={{ width: `${strengthPercentage}%` }}></div>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1 text-right">{passedCount} / {requiredCount} criteria met</p>
                        </div>
                    </div>

                    {/* Session Management */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
                            <Shield className="w-5 h-5 text-slate-500" /> Session & Lockout
                        </h3>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Session Timeout</label>
                            <div className="flex gap-2">
                                <select 
                                    value={timeoutMode} 
                                    onChange={e => {
                                        setTimeoutMode(e.target.value);
                                        if (e.target.value !== 'custom') {
                                            handleChange({ target: { name: 'session_timeout', value: e.target.value } });
                                        }
                                    }}
                                    className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                >
                                    <option value="60">1 Hour</option>
                                    <option value="240">4 Hours</option>
                                    <option value="480">8 Hours</option>
                                    <option value="1440">24 Hours</option>
                                    <option value="custom">Custom (Minutes)</option>
                                </select>
                                {timeoutMode === 'custom' && (
                                    <input 
                                        type="number" 
                                        name="session_timeout" 
                                        value={policy?.session_timeout} 
                                        onChange={handleChange} 
                                        className="flex h-10 w-32 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                )}
                            </div>
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
                                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                        </div>
                    </div>

                    {/* Network Security */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
                            <Shield className="w-5 h-5 text-slate-500" /> Network Security
                        </h3>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">IP Allowlist</label>
                            <textarea 
                                name="ip_allowlist" 
                                value={policy?.ip_allowlist} 
                                onChange={handleChange} 
                                placeholder="e.g., 192.168.1.0/24&#10;One IP or CIDR per line"
                                className="flex w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[80px]"
                            />
                            <p className="text-xs text-slate-500">Only these IPs can access the application. Leave blank to allow all.</p>
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-sm font-medium text-slate-400">IP Blocklist</label>
                            <textarea 
                                name="ip_blocklist" 
                                value={policy?.ip_blocklist} 
                                onChange={handleChange} 
                                placeholder="e.g., 203.0.113.50&#10;One IP or CIDR per line"
                                className="flex w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[80px]"
                            />
                            <p className="text-xs text-slate-500">Always blocked from accessing the application.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SecurityPolicy;
