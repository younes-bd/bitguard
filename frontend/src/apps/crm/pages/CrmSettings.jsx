import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Globe, Database, Mail, Clock, ListChecks, Target, MessageSquare } from 'lucide-react';

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
            className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-blue-600' : 'bg-slate-700'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : ''}`} />
        </button>
    );
};

const CrmSettings = () => {
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Settings className="text-blue-400" size={28} />
                        Sales & CRM Settings
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Configure sales pipeline, lead management, and activities</p>
                </div>
                <button 
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                    <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Sales Pipeline */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <ListChecks size={20} className="text-blue-400" />
                        Sales Pipeline
                    </h3>
                    <SettingRow title="Pipeline Stages" description="Define the stages for your sales deals">
                        <div className="flex flex-col gap-2">
                            {['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'].map(stage => (
                                <div key={stage} className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
                                    {stage}
                                </div>
                            ))}
                        </div>
                    </SettingRow>
                    <SettingRow title="Probability Distribution" description="Automatically set deal probability based on stage">
                        <Toggle defaultOn />
                    </SettingRow>
                </div>

                {/* Lead Management */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <Target size={20} className="text-blue-400" />
                        Lead Scoring
                    </h3>
                    <SettingRow title="Email Engagement" description="Add points for lead opening/clicking emails">
                        <input type="number" defaultValue={5} className="w-16 bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm" />
                    </SettingRow>
                    <SettingRow title="Inactivity Decay" description="Deduct points for leads with no activity for 30 days">
                        <Toggle defaultOn />
                    </SettingRow>
                </div>

                {/* Activity Types */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <MessageSquare size={20} className="text-blue-400" />
                        Activity & Task Types
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SettingRow icon={Mail} title="Email Tracking" description="Automatically log outgoing sales emails">
                            <Toggle defaultOn />
                        </SettingRow>
                        <SettingRow icon={Clock} title="Task Deadlines" description="Auto-notify when a sales task is overdue">
                            <Toggle defaultOn />
                        </SettingRow>
                        <SettingRow icon={Shield} title="Data Residency" description="Enforce data location for sensitive client info">
                            <Toggle />
                        </SettingRow>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrmSettings;
