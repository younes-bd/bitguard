import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Globe, Database, Mail, Clock, Megaphone, Target, Link as LinkIcon, Share2 } from 'lucide-react';

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
    const [on, setOn] = useState(defaultOn);
    return (
        <button onClick={() => setOn(!on)}
            className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-purple-600' : 'bg-slate-700'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : ''}`} />
        </button>
    );
};

const MarketingSettings = () => {
    const [saving, setSaving] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Settings className="text-purple-400" size={28} />
                        Marketing Automation Settings
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Configure tracking domains, email templates, and campaign defaults</p>
                </div>
                <button 
                    onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 1000); }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                    <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Email Configuration */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <Mail size={20} className="text-purple-400" />
                        Campaign Email Setup
                    </h3>
                    <SettingRow title="Default Sender Email" description="Address used for all outgoing campaign communications">
                        <input type="email" defaultValue="hello@bitguard.com" className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm" />
                    </SettingRow>
                    <SettingRow title="Custom Tracking Domain" description="CNAME record for white-labeled link tracking (e.g., mail.bitguard.tech)">
                        <input type="text" placeholder="mail.company.com" className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm" />
                    </SettingRow>
                </div>

                {/* Campaign Defaults */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <Target size={20} className="text-purple-400" />
                        Targeting & UTMs
                    </h3>
                    <SettingRow title="Auto-append UTMs" description="Automatically add utm_source, utm_medium to campaign links">
                        <Toggle defaultOn />
                    </SettingRow>
                    <SettingRow title="Lead Segment Sync" description="Auto-sync new CRM leads to active marketing segments">
                        <Toggle defaultOn />
                    </SettingRow>
                </div>

                {/* Tracking & Analytics */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <LinkIcon size={20} className="text-purple-400" />
                        Tracking & Compliance
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SettingRow icon={Globe} title="Pixel Tracking" description="Enable Facebook/LinkedIn conversion pixels">
                            <Toggle />
                        </SettingRow>
                        <SettingRow icon={Share2} title="Social Auto-post" description="Automatically post new campaign results to social media">
                            <Toggle />
                        </SettingRow>
                        <SettingRow icon={Shield} title="Double Opt-in" description="Enforce verification emails for all new subscribers">
                            <Toggle defaultOn />
                        </SettingRow>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketingSettings;
