import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Globe, Database, Mail, Clock, FileText, CheckCircle2, History, RefreshCw } from 'lucide-react';

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
            className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-violet-600' : 'bg-slate-700'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : ''}`} />
        </button>
    );
};

const ContractSettings = () => {
    const [saving, setSaving] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Settings className="text-violet-400" size={28} />
                        Contracts & SLA Settings
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Configure service levels, renewal terms, and document templates</p>
                </div>
                <button 
                    onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 1000); }}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                    <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* SLA Tiers */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <Shield size={20} className="text-violet-400" />
                        SLA Tier Defaults
                    </h3>
                    <SettingRow title="Default SLA Tier" description="Standard service level for new contracts">
                        <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300">
                            <option>Standard (NBD)</option>
                            <option selected>Professional (4h)</option>
                            <option>Mission Critical (1h)</option>
                        </select>
                    </SettingRow>
                    <SettingRow title="Breach Notifications" description="Notify account managers when an SLA breach occurs">
                        <Toggle defaultOn />
                    </SettingRow>
                </div>

                {/* Templates & Logistics */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <FileText size={20} className="text-violet-400" />
                        Contract Lifecycle
                    </h3>
                    <SettingRow title="Default Term Length" description="Standard duration for new service agreements (months)">
                        <input type="number" defaultValue={12} className="w-16 bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm" />
                    </SettingRow>
                    <SettingRow title="Grace Period for Renewal" description="Days to continue service after contract expiry">
                        <input type="number" defaultValue={15} className="w-16 bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm" />
                    </SettingRow>
                </div>

                {/* Automations */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <RefreshCw size={20} className="text-violet-400" />
                        Auto-Renewal & Compliance
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SettingRow icon={History} title="Auto-renew Contracts" description="Automatically extend contracts with notice period">
                            <Toggle defaultOn />
                        </SettingRow>
                        <SettingRow icon={CheckCircle2} title="Master Service Agreement" description="Enforce global MSA signing before specific contracts">
                            <Toggle defaultOn />
                        </SettingRow>
                        <SettingRow icon={Mail} title="Renewal Reminders" description="Notify clients 30 days before contract expiry">
                            <Toggle defaultOn />
                        </SettingRow>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractSettings;
