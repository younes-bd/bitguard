import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Globe, Database, Mail, Clock } from 'lucide-react';

const COLOR_MAP = {
    blue: { text: 'text-blue-400', bgHover: 'hover:bg-blue-500', bg: 'bg-blue-600' },
    teal: { text: 'text-teal-400', bgHover: 'hover:bg-teal-500', bg: 'bg-teal-600' },
    violet: { text: 'text-violet-400', bgHover: 'hover:bg-violet-500', bg: 'bg-violet-600' },
    emerald: { text: 'text-emerald-400', bgHover: 'hover:bg-emerald-500', bg: 'bg-emerald-600' },
    rose: { text: 'text-rose-400', bgHover: 'hover:bg-rose-500', bg: 'bg-rose-600' },
    amber: { text: 'text-amber-400', bgHover: 'hover:bg-amber-500', bg: 'bg-amber-600' },
};

const SettingRow = ({ icon: Icon, title, description, children }) => (
    <div className="flex items-start justify-between gap-6 py-5 border-b border-slate-800 last:border-0">
        <div className="flex items-start gap-4">
            {Icon && (
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={18} className="text-slate-400" />
                </div>
            )}
            <div>
                <h4 className="text-white font-medium text-sm">{title}</h4>
                <p className="text-slate-500 text-xs mt-0.5 max-w-md">{description}</p>
            </div>
        </div>
        <div className="flex-shrink-0">{children}</div>
    </div>
);

const Toggle = ({ on, onChange }) => {
    return (
        <button onClick={() => onChange(!on)}
            className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-blue-600' : 'bg-slate-700'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : ''}`} />
        </button>
    );
};

const ModuleSettings = ({ moduleName = 'Module', accentColor = 'blue', onSave }) => {
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        emailNotifications: true,
        autoRefresh: false,
        publicApi: true,
        twoFactor: false,
        dataRetention: 'Never',
        auditTrail: false,
    });

    const c = COLOR_MAP[accentColor] || COLOR_MAP.blue;

    const handleSave = async () => {
        setSaving(true);
        try {
            if (onSave) {
                await onSave(settings);
            } else {
                // Simulate network request
                await new Promise(r => setTimeout(r, 600));
            }
            alert('Settings saved successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Settings className={c.text} size={28} />
                        {moduleName} Settings
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Configure module preferences and behaviors</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className={`px-4 py-2 ${c.bg} ${c.bgHover} text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50`}>
                    <Save size={14} className={saving ? "animate-spin" : ""} /> 
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4 text-lg">General</h3>
                <SettingRow icon={Bell} title="Email Notifications" description="Receive email alerts for important events in this module">
                    <Toggle on={settings.emailNotifications} onChange={v => setSettings({...settings, emailNotifications: v})} />
                </SettingRow>
                <SettingRow icon={Clock} title="Auto-refresh Dashboard" description="Automatically refresh KPIs and data tables every 60 seconds">
                    <Toggle on={settings.autoRefresh} onChange={v => setSettings({...settings, autoRefresh: v})} />
                </SettingRow>
                <SettingRow icon={Globe} title="Public API Access" description="Allow external systems to query this module's data via REST API">
                    <Toggle on={settings.publicApi} onChange={v => setSettings({...settings, publicApi: v})} />
                </SettingRow>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4 text-lg">Security & Access</h3>
                <SettingRow icon={Shield} title="Require Two-Factor for Edits" description="Enforce 2FA verification before modifying critical records">
                    <Toggle on={settings.twoFactor} onChange={v => setSettings({...settings, twoFactor: v})} />
                </SettingRow>
                <SettingRow icon={Database} title="Data Retention Policy" description="Automatically archive records older than the configured retention period">
                    <select 
                        value={settings.dataRetention}
                        onChange={e => setSettings({...settings, dataRetention: e.target.value})}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:ring-2 focus:ring-blue-500/50 focus:outline-none">
                        <option>Never</option>
                        <option>90 Days</option>
                        <option>1 Year</option>
                        <option>3 Years</option>
                    </select>
                </SettingRow>
                <SettingRow icon={Mail} title="Audit Trail Notifications" description="Send a daily digest of all changes to module administrators">
                    <Toggle on={settings.auditTrail} onChange={v => setSettings({...settings, auditTrail: v})} />
                </SettingRow>
            </div>
        </div>
    );
};

export default ModuleSettings;
