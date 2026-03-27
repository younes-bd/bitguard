import React from 'react';
import { Settings, Save, Bell, Shield, Globe, Database, Mail, Clock } from 'lucide-react';

const SettingRow = ({ icon: Icon, title, description, children }) => (
    <div className="flex items-start justify-between gap-6 py-5 border-b border-slate-800 last:border-0">
        <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={18} className="text-slate-400" />
            </div>
            <div>
                <h4 className="text-white font-medium text-sm">{title}</h4>
                <p className="text-slate-500 text-xs mt-0.5 max-w-md">{description}</p>
            </div>
        </div>
        <div className="flex-shrink-0">{children}</div>
    </div>
);

const Toggle = ({ defaultOn = false }) => {
    const [on, setOn] = React.useState(defaultOn);
    return (
        <button onClick={() => setOn(!on)}
            className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-blue-600' : 'bg-slate-700'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : ''}`} />
        </button>
    );
};

const ModuleSettings = ({ moduleName = 'Module', accentColor = 'blue' }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <Settings className={`text-${accentColor}-400`} size={28} />
                    {moduleName} Settings
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Configure module preferences and behaviors</p>
            </div>
            <button className={`px-4 py-2 bg-${accentColor}-600 hover:bg-${accentColor}-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2`}>
                <Save size={14} /> Save Changes
            </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 text-lg">General</h3>
            <SettingRow icon={Bell} title="Email Notifications" description="Receive email alerts for important events in this module">
                <Toggle defaultOn />
            </SettingRow>
            <SettingRow icon={Clock} title="Auto-refresh Dashboard" description="Automatically refresh KPIs and data tables every 60 seconds">
                <Toggle />
            </SettingRow>
            <SettingRow icon={Globe} title="Public API Access" description="Allow external systems to query this module's data via REST API">
                <Toggle defaultOn />
            </SettingRow>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 text-lg">Security & Access</h3>
            <SettingRow icon={Shield} title="Require Two-Factor for Edits" description="Enforce 2FA verification before modifying critical records">
                <Toggle />
            </SettingRow>
            <SettingRow icon={Database} title="Data Retention Policy" description="Automatically archive records older than the configured retention period">
                <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:ring-2 focus:ring-blue-500/50 focus:outline-none">
                    <option>Never</option>
                    <option>90 Days</option>
                    <option>1 Year</option>
                    <option>3 Years</option>
                </select>
            </SettingRow>
            <SettingRow icon={Mail} title="Audit Trail Notifications" description="Send a daily digest of all changes to module administrators">
                <Toggle />
            </SettingRow>
        </div>
    </div>
);

export default ModuleSettings;
