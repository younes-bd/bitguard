import React, { useState, useEffect } from 'react';
import {
    Settings, Globe, Shield, Bell, Database,
    Save, Sliders, Image as ImageIcon, CheckCircle2, Paintbrush,
    Mail, MessageSquare, Smartphone, Server, Key
} from 'lucide-react';
import { sysadminService } from '../api/sysadminService';
import client from '../../../core/api/client';

import { useLocation } from 'react-router-dom';

const PlatformSettings = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'general';
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        const tab = queryParams.get('tab');
        if (tab) setActiveTab(tab);
    }, [location.search]);
    const [settings, setSettings] = useState({
        company_name: 'BitGuard Corp',
        support_email: 'support@bitguard.com',
        default_currency: 'USD ($)',
        timezone: 'UTC (GMT+0)',
        primary_color: '#3b82f6',
        accent_color: '#10b981',
        brand_font: 'Inter'
    });
    
    // Notification Preferences State
    const [notificationPrefs, setNotificationPrefs] = useState([]);

    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        // Load System Settings
        sysadminService.getSettings()
            .then(res => {
                const data = res.data?.results || res.data || [];
                const newSettings = { ...settings };
                data.forEach(s => {
                    if (newSettings.hasOwnProperty(s.key)) {
                        newSettings[s.key] = s.value;
                    }
                });
                setSettings(newSettings);
            })
            .catch(err => console.error("Error loading settings:", err));

        // Load Notification Preferences
        client.get('/notifications/preferences/')
            .then(res => {
                setNotificationPrefs(res.data);
            })
            .catch(err => console.error("Error loading notification prefs:", err));
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handlePrefChange = (id, field, value) => {
        setNotificationPrefs(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (activeTab === 'general' || activeTab === 'branding') {
                await sysadminService.batchUpdateSettings(settings);
            } else if (activeTab === 'notifications') {
                await client.put('/notifications/preferences/', notificationPrefs);
            }
            setNotification({ type: 'success', message: 'Settings saved successfully!' });
        } catch (error) {
            console.error(error);
            setNotification({ type: 'error', message: 'Failed to save settings.' });
        } finally {
            setSaving(false);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const tabs = [
        { id: 'general', icon: Globe, label: 'General & Regional' },
        { id: 'branding', icon: Paintbrush, label: 'Branding & Identity' },
        { id: 'security', icon: Shield, label: 'Security & Auth Policy' },
        { id: 'notifications', icon: Bell, label: 'Omni-Channel Notifications' },
        { id: 'retention', icon: Database, label: 'Data Retention' },
        { id: 'integrations', icon: Sliders, label: 'Integrations' },
    ];

    return (
        <div className="space-y-6 relative max-w-7xl mx-auto">
            {notification && (
                <div className={`absolute top-0 right-0 p-4 rounded-xl shadow-xl flex items-center space-x-3 z-50 animate-in fade-in-0 text-white ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold text-sm">{notification.message}</span>
                </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Enterprise Settings</h1>
                    <p className="text-slate-400 mt-1">Configure global application preferences, security, and Identity policies.</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-colors font-bold disabled:opacity-50 shadow-lg shadow-blue-900/20">
                    <Save size={18} className={saving ? 'animate-pulse' : ''} />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* Vertical Tabs Sidebar (macOS / Stripe Style) */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-3 flex flex-col gap-1 sticky top-24 backdrop-blur-md">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border-none cursor-pointer
                                    ${activeTab === tab.id 
                                        ? 'bg-blue-600/15 text-blue-400 shadow-[inset_4px_0_0_0_rgba(59,130,246,1)]' 
                                        : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'}
                                `}
                            >
                                <tab.icon size={18} className={activeTab === tab.id ? 'text-blue-400' : 'text-slate-500'} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-8 pb-20">

                    {/* GENERAL TAB */}
                    {activeTab === 'general' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl">
                                <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">General Information</h2>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-300">Company Name</label>
                                            <input type="text" value={settings.company_name} onChange={(e) => handleChange('company_name', e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-300">Support Email</label>
                                            <input type="email" value={settings.support_email} onChange={(e) => handleChange('support_email', e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Platform Logo</label>
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 bg-slate-950 border border-slate-700 rounded-2xl flex items-center justify-center shadow-inner">
                                                <img src="/assets/logo/logo.png" className="w-12 h-12 object-contain brightness-0 invert" alt="Logo" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors cursor-pointer bg-slate-950/50">
                                                    <ImageIcon size={28} className="text-slate-500 mb-2" />
                                                    <span className="text-sm font-medium text-slate-300">Click to upload or drag & drop</span>
                                                    <span className="text-xs text-slate-500 mt-1">SVG, PNG, JPG up to 2MB</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl">
                                <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Regional Settings</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Default Currency</label>
                                        <select value={settings.default_currency} onChange={(e) => handleChange('default_currency', e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all">
                                            <option value="USD ($)">USD ($)</option>
                                            <option value="EUR (€)">EUR (€)</option>
                                            <option value="DZD (DA)">DZD (DA)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Timezone</label>
                                        <select value={settings.timezone} onChange={(e) => handleChange('timezone', e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all">
                                            <option value="UTC (GMT+0)">UTC (GMT+0)</option>
                                            <option value="EST (GMT-5)">EST (GMT-5)</option>
                                            <option value="CET (GMT+1)">CET (GMT+1)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BRANDING TAB */}
                    {activeTab === 'branding' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl">
                                <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Branding & Identity</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Primary Brand Color</label>
                                        <div className="flex gap-3">
                                            <input type="color" value={settings.primary_color} onChange={(e) => handleChange('primary_color', e.target.value)} className="h-11 w-14 bg-slate-950 border border-slate-700 rounded-xl cursor-pointer p-1" />
                                            <input type="text" value={settings.primary_color} onChange={(e) => handleChange('primary_color', e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-mono" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Accent Color</label>
                                        <div className="flex gap-3">
                                            <input type="color" value={settings.accent_color} onChange={(e) => handleChange('accent_color', e.target.value)} className="h-11 w-14 bg-slate-950 border border-slate-700 rounded-xl cursor-pointer p-1" />
                                            <input type="text" value={settings.accent_color} onChange={(e) => handleChange('accent_color', e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-mono" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Global Font Family</label>
                                        <select value={settings.brand_font} onChange={(e) => handleChange('brand_font', e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all">
                                            <option value="Inter">Inter (Default)</option>
                                            <option value="Oswald">Oswald (Accent)</option>
                                            <option value="Roboto">Roboto</option>
                                            <option value="Outfit">Outfit</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Website Header Position</label>
                                        <select className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all">
                                            <option value="fixed">Fixed (Sticky)</option>
                                            <option value="absolute">Absolute (Overlay)</option>
                                            <option value="static">Static</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NOTIFICATIONS TAB */}
                    {activeTab === 'notifications' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl">
                                <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Omni-Channel Notification Routing</h2>
                                <p className="text-slate-400 text-sm mb-6">Choose how you want to receive alerts and notifications for different modules across the enterprise.</p>
                                
                                <div className="space-y-4">
                                    <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <div className="col-span-6">Module / Category</div>
                                        <div className="col-span-2 text-center flex justify-center items-center gap-1.5"><Smartphone size={14} /> In-App</div>
                                        <div className="col-span-2 text-center flex justify-center items-center gap-1.5"><Mail size={14} /> Email</div>
                                        <div className="col-span-2 text-center flex justify-center items-center gap-1.5"><MessageSquare size={14} /> SMS</div>
                                    </div>

                                    {notificationPrefs.map(pref => (
                                        <div key={pref.id} className="grid grid-cols-12 gap-4 px-4 py-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors items-center">
                                            <div className="col-span-6">
                                                <div className="font-bold text-slate-200 uppercase tracking-wide text-sm">{pref.type}</div>
                                            </div>
                                            <div className="col-span-2 flex justify-center">
                                                <input type="checkbox" checked={pref.in_app_enabled} onChange={(e) => handlePrefChange(pref.id, 'in_app_enabled', e.target.checked)} className="w-5 h-5 accent-blue-500 rounded bg-slate-950 border-slate-700 cursor-pointer" />
                                            </div>
                                            <div className="col-span-2 flex justify-center">
                                                <input type="checkbox" checked={pref.email_enabled} onChange={(e) => handlePrefChange(pref.id, 'email_enabled', e.target.checked)} className="w-5 h-5 accent-blue-500 rounded bg-slate-950 border-slate-700 cursor-pointer" />
                                            </div>
                                            <div className="col-span-2 flex justify-center">
                                                <input type="checkbox" checked={pref.sms_enabled} onChange={(e) => handlePrefChange(pref.id, 'sms_enabled', e.target.checked)} className="w-5 h-5 accent-blue-500 rounded bg-slate-950 border-slate-700 cursor-pointer" />
                                            </div>
                                        </div>
                                    ))}
                                    {notificationPrefs.length === 0 && (
                                        <div className="text-center py-8 text-slate-500">Loading preferences...</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECURITY TAB (Auth/Identity Merger) */}
                    {activeTab === 'security' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl">
                                <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Authentication & Identity Policy</h2>
                                <p className="text-slate-400 text-sm mb-6">Manage global security policies that apply to all enterprise users and tenants.</p>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                                        <div>
                                            <h3 className="text-slate-200 font-bold">Enforce Two-Factor Authentication (2FA)</h3>
                                            <p className="text-xs text-slate-500 mt-1">Require all administrative users to configure 2FA via Authenticator App.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                                        <div>
                                            <h3 className="text-slate-200 font-bold">Password Expiration</h3>
                                            <p className="text-xs text-slate-500 mt-1">Force users to reset their passwords every 90 days.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                        </label>
                                    </div>
                                    
                                    <div className="space-y-2 pt-4 border-t border-slate-800">
                                        <label className="text-sm font-semibold text-slate-300">Session Timeout (Minutes)</label>
                                        <input type="number" defaultValue={60} className="w-full max-w-xs bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* RETENTION TAB */}
                    {activeTab === 'retention' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Database className="text-blue-500" /> Data Retention Policies
                                </h3>
                                <div className="space-y-4 max-w-lg">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-slate-300">Audit Log Retention Period (Days)</label>
                                        <p className="text-xs text-slate-500">Logs older than this threshold will be permanently deleted upon pruning.</p>
                                        <select className="bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all">
                                            <option value="30">30 Days</option>
                                            <option value="90">90 Days</option>
                                            <option value="365">1 Year</option>
                                            <option value="1825">5 Years (Compliance)</option>
                                        </select>
                                    </div>
                                    <button onClick={() => {
                                        sysadminService.pruneAuditLogs(90).then(res => alert(res.data.status));
                                    }} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-500 transition-colors text-sm">
                                        Prune Old Logs Now
                                    </button>
                                </div>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Server className="text-emerald-500" /> Database Backups
                                </h3>
                                <p className="text-sm text-slate-400 mb-4">Trigger an immediate snapshot of the primary database.</p>
                                <button onClick={() => {
                                    sysadminService.triggerBackup().then(() => alert('Backup triggered successfully'));
                                }} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-500 transition-colors text-sm mb-6">
                                    Trigger Backup Snapshot
                                </button>
                                
                                <div className="border border-slate-800 rounded-xl overflow-hidden">
                                    <div className="bg-slate-950 p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Backups</div>
                                    <div className="p-4 text-sm text-slate-300">Use the backend API to fetch and render backups here.</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* INTEGRATIONS TAB */}
                    {activeTab === 'integrations' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Key className="text-purple-500" /> API Keys
                                    </h3>
                                    <button onClick={() => {
                                        const name = prompt("Enter API Key Name:");
                                        if (name) sysadminService.createApiKey({name}).then(res => alert(`Save this secret, it won't be shown again:\n${res.data.raw_secret}`));
                                    }} className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-purple-500 transition-colors">
                                        Generate Key
                                    </button>
                                </div>
                                <div className="border border-slate-800 rounded-xl overflow-hidden">
                                    <div className="bg-slate-950 p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Active Keys</div>
                                    <div className="p-4 text-sm text-slate-300">Use the backend API to fetch and render API keys here.</div>
                                </div>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Globe className="text-blue-500" /> Webhook Endpoints
                                    </h3>
                                    <button onClick={() => {
                                        const url = prompt("Enter Webhook URL:");
                                        if (url) sysadminService.createWebhook({name: 'New Hook', url, events: ['*']}).then(() => alert('Webhook created'));
                                    }} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-500 transition-colors">
                                        Add Webhook
                                    </button>
                                </div>
                                <div className="border border-slate-800 rounded-xl overflow-hidden">
                                    <div className="bg-slate-950 p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Endpoints</div>
                                    <div className="p-4 text-sm text-slate-300">Use the backend API to fetch and render Webhooks here.</div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default PlatformSettings;
