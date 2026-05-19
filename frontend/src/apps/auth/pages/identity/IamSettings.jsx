import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Key, Clock, Fingerprint, Lock, Globe, Server, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { iamService } from '../../../../core/api/iamService';

const IamSettings = () => {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        password_complexity: 'high',
        session_timeout: '60',
        mfa_required: true,
        api_key_rotation: '90',
        ip_whitelist: '',
        failed_login_lock: '5',
        lock_duration: '30',
        concurrent_sessions: '1'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await iamService.getSecurityPolicy();
                if (data) setSettings(data);
            } catch (error) {
                console.error("Failed to load policy", error);
                toast.error("Failed to synchronize security policy");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await iamService.updateSecurityPolicy(settings);
            toast.success("Security Policy Synchronized Successfully");
        } catch (error) {
            console.error("Failed to save policy", error);
            toast.error("Protocol Error: Policy rejection");
        } finally {
            setSaving(false);
        }
    };

    const SettingGroup = ({ title, icon: Icon, children }) => (
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 space-y-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl">
                    <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight uppercase">{title}</h3>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );

    const SettingRow = ({ label, description, children }) => (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 border-b border-slate-800/50 last:border-0">
            <div className="space-y-1">
                <p className="text-sm font-bold text-slate-200 uppercase tracking-wide">{label}</p>
                <p className="text-xs text-slate-500">{description}</p>
            </div>
            <div className="flex items-center">
                {children}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                <p className="text-slate-500 font-mono text-sm uppercase tracking-widest animate-pulse">Synchronizing Security Vectors...</p>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tighter flex items-center gap-4 font-['Outfit']">
                        <ShieldAlert className="text-purple-500" size={40} />
                        Global IAM Policy
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Configure enterprise-grade security protocols and authentication guardrails.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-purple-900/20 transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    Commit Policies
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <SettingGroup title="Authentication" icon={Key}>
                    <SettingRow 
                        label="Password Complexity" 
                        description="Enforce minimum length, special characters, and entropy requirements."
                    >
                        <select 
                            value={settings.password_complexity}
                            onChange={(e) => setSettings({...settings, password_complexity: e.target.value})}
                            className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                            <option value="low">Standard (8 chars)</option>
                            <option value="medium">Medium (12 chars + Mixed)</option>
                            <option value="high">Enterprise (16 chars + MFA)</option>
                        </select>
                    </SettingRow>
                    <SettingRow 
                        label="MFA Enforcement" 
                        description="Require Multi-Factor Authentication for all administrative accounts."
                    >
                        <div className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.mfa_required} className="sr-only peer" onChange={() => setSettings({...settings, mfa_required: !settings.mfa_required})} />
                            <div className="w-12 h-6 bg-slate-800 rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6"></div>
                        </div>
                    </SettingRow>
                </SettingGroup>

                <SettingGroup title="Session Security" icon={Clock}>
                    <SettingRow 
                        label="Inactivity Timeout" 
                        description="Automatically terminate sessions after specified minutes of inactivity."
                    >
                        <div className="flex items-center gap-3">
                            <input 
                                type="number" 
                                value={settings.session_timeout} 
                                onChange={(e) => setSettings({...settings, session_timeout: e.target.value})}
                                className="w-20 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2 text-sm text-center" 
                            />
                            <span className="text-xs text-slate-500 font-bold uppercase">Minutes</span>
                        </div>
                    </SettingRow>
                    <SettingRow 
                        label="Concurrent Sessions" 
                        description="Limit the number of simultaneous active logins per principal."
                    >
                        <select 
                            value={settings.concurrent_sessions || '1'}
                            onChange={(e) => setSettings({...settings, concurrent_sessions: e.target.value})}
                            className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                            <option value="1">Strict (1 Session)</option>
                            <option value="3">Balanced (3 Sessions)</option>
                            <option value="unlimited">Unlimited</option>
                        </select>
                    </SettingRow>
                </SettingGroup>

                <SettingGroup title="Access Control" icon={Lock}>
                    <SettingRow 
                        label="Failed Login Threshold" 
                        description="Number of attempts before the principal account is automatically locked."
                    >
                        <input 
                            type="number" 
                            value={settings.failed_login_lock} 
                            onChange={(e) => setSettings({...settings, failed_login_lock: e.target.value})}
                            className="w-20 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2 text-sm text-center" 
                        />
                    </SettingRow>
                    <SettingRow 
                        label="Auto-Unlock Duration" 
                        description="Time in minutes before a locked account is automatically released."
                    >
                        <div className="flex items-center gap-3">
                            <input 
                                type="number" 
                                value={settings.lock_duration} 
                                onChange={(e) => setSettings({...settings, lock_duration: e.target.value})}
                                className="w-20 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2 text-sm text-center" 
                            />
                            <span className="text-xs text-slate-500 font-bold uppercase">Minutes</span>
                        </div>
                    </SettingRow>
                </SettingGroup>

                <SettingGroup title="Network & API" icon={Globe}>
                    <SettingRow 
                        label="IP Whitelisting" 
                        description="Restrict administrative access to specific CIDR ranges."
                    >
                        <input 
                            type="text" 
                            value={settings.ip_whitelist} 
                            onChange={(e) => setSettings({...settings, ip_whitelist: e.target.value})}
                            className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2 text-sm font-mono" 
                        />
                    </SettingRow>
                    <SettingRow 
                        label="API Key Expiration" 
                        description="Maximum lifetime for programmatic access tokens (days)."
                    >
                        <input 
                            type="number" 
                            value={settings.api_key_rotation} 
                            onChange={(e) => setSettings({...settings, api_key_rotation: e.target.value})}
                            className="w-20 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2 text-sm text-center" 
                        />
                    </SettingRow>
                </SettingGroup>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-10 flex flex-col md:flex-row gap-10 items-center">
                <div className="p-6 bg-purple-500/10 text-purple-400 rounded-3xl border border-purple-500/20">
                    <Fingerprint size={48} />
                </div>
                <div className="space-y-2 flex-1">
                    <h4 className="text-2xl font-bold text-white uppercase tracking-tight">Security Audit Log Persistence</h4>
                    <p className="text-slate-400 leading-relaxed text-sm">
                        All changes to the Global IAM Policy are cryptographically signed and stored in the immutable security audit trail. 
                        Ensure you have the required high-level clearance before committing these changes.
                    </p>
                </div>
                <button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-700 transition-all">
                    View Audit Logs
                </button>
            </div>
        </div>
    );
};

export default IamSettings;
