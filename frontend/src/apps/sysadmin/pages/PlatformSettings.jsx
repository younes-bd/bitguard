import React, { useState, useEffect } from 'react';
import {
    Settings, Globe, Shield, Bell, Database,
    Save, Sliders, Image as ImageIcon, CheckCircle2
} from 'lucide-react';
import { sysadminService } from '../api/sysadminService';

const PlatformSettings = () => {
    const [settings, setSettings] = useState({
        company_name: 'BitGuard Corp',
        support_email: 'support@bitguard.com',
        default_currency: 'USD ($)',
        timezone: 'UTC (GMT+0)'
    });
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
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
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await sysadminService.batchUpdateSettings(settings);
            setNotification({ type: 'success', message: 'Platform settings saved successfully!' });
        } catch (error) {
            console.error(error);
            setNotification({ type: 'error', message: 'Failed to save settings.' });
        } finally {
            setSaving(false);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    return (
        <div className="space-y-6 relative">
            {notification && (
                <div className={`absolute top-0 right-0 p-4 rounded-xl shadow-xl flex items-center space-x-3 z-50 animate-in fade-in-0 text-white ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold text-sm">{notification.message}</span>
                </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Platform Settings</h1>
                    <p className="text-slate-400">Configure global application preferences.</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50">
                    <Save size={18} className={saving ? 'animate-pulse' : ''} />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Navigation Sidebar (Settings Specific) */}
                <div className="lg:col-span-1 space-y-2">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2">
                        {[
                            { icon: Globe, label: 'General', active: true },
                            { icon: Shield, label: 'Security Policy', active: false },
                            { icon: Bell, label: 'Notifications', active: false },
                            { icon: Database, label: 'Data Retention', active: false },
                            { icon: Sliders, label: 'Integrations', active: false },
                        ].map((item, idx) => (
                            <button
                                key={idx}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors bg-transparent border-none cursor-pointer
                                    ${item.active ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
                                `}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-2 space-y-6">

                    {/* General Settings Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">General Information</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Company Name</label>
                                    <input type="text" value={settings.company_name} onChange={(e) => handleChange('company_name', e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Support Email</label>
                                    <input type="email" value={settings.support_email} onChange={(e) => handleChange('support_email', e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500/50" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Platform Logo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center">
                                        <img src="/assets/logo/logo.png" className="w-10 h-10 object-contain brightness-0 invert" alt="Logo" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="border-2 border-dashed border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:border-slate-700 transition-colors cursor-pointer bg-slate-950/50">
                                            <ImageIcon size={24} className="text-slate-500 mb-2" />
                                            <span className="text-sm text-slate-400">Click to upload or drag & drop</span>
                                            <span className="text-xs text-slate-600">SVG, PNG, JPG up to 2MB</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Regional Settings */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Regional Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Default Currency</label>
                                <select value={settings.default_currency} onChange={(e) => handleChange('default_currency', e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500/50">
                                    <option value="USD ($)">USD ($)</option>
                                    <option value="EUR (€)">EUR (€)</option>
                                    <option value="DZD (DA)">DZD (DA)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Timezone</label>
                                <select value={settings.timezone} onChange={(e) => handleChange('timezone', e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500/50">
                                    <option value="UTC (GMT+0)">UTC (GMT+0)</option>
                                    <option value="EST (GMT-5)">EST (GMT-5)</option>
                                    <option value="CET (GMT+1)">CET (GMT+1)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PlatformSettings;
