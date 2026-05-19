import React, { useState } from 'react';
import { Settings, Save, Monitor, ShieldAlert, Laptop2, Wrench, CloudCog, Bell } from 'lucide-react';

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

const Toggle = ({ defaultOn = false }) => {
    const [on, setOn] = useState(defaultOn);
    return (
        <button onClick={() => setOn(!on)}
            className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-teal-600' : 'bg-slate-700'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : ''}`} />
        </button>
    );
};

const ItamSettings = () => {
    const [saving, setSaving] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Settings className="text-teal-400" size={28} />
                        ITAM Settings
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Configure asset lifecycle, compliance, and warranty alerts</p>
                </div>
                <button 
                    onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 1000); }}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                    <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Asset Lifecycle */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <Laptop2 size={20} className="text-teal-400" />
                        Asset Lifecycle
                    </h3>
                    <SettingRow title="Default Depreciation Period" description="Standard lifespan for hardware assets (years)">
                        <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none">
                            <option>3 Years</option>
                            <option>4 Years</option>
                            <option>5 Years (Default)</option>
                            <option>7 Years</option>
                        </select>
                    </SettingRow>
                    <SettingRow title="Auto-Retire Assets" description="Automatically mark assets as retired after depreciation period">
                        <Toggle />
                    </SettingRow>
                </div>

                {/* Notifications & Compliance */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <ShieldAlert size={20} className="text-teal-400" />
                        Notifications & Compliance
                    </h3>
                    <SettingRow title="Warranty Expiration Alerts" description="Alert threshold before asset warranty expires">
                        <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none">
                            <option>15 Days</option>
                            <option>30 Days (Default)</option>
                            <option>60 Days</option>
                            <option>90 Days</option>
                        </select>
                    </SettingRow>
                    <SettingRow title="Email Alerts" description="Send email notifications for critical asset events">
                        <Toggle defaultOn />
                    </SettingRow>
                </div>

                {/* Global Settings */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <CloudCog size={20} className="text-teal-400" />
                        Global Configurations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SettingRow icon={Monitor} title="Asset Prefix" description="Prefix used for auto-generated asset tags">
                            <input type="text" defaultValue="BG-AST-" className="w-32 bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm" />
                        </SettingRow>
                        <SettingRow icon={Wrench} title="Maintenance Scheduling" description="Require approval for all maintenance requests">
                            <Toggle defaultOn />
                        </SettingRow>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItamSettings;
