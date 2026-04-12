import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Globe, Database, Mail, Clock, CreditCard, Layers, Zap, AlertCircle } from 'lucide-react';

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
            className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-indigo-600' : 'bg-slate-700'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : ''}`} />
        </button>
    );
};

const BillingSettings = () => {
    const [saving, setSaving] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Settings className="text-indigo-400" size={28} />
                        Billing & Subscription Settings
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Configure payment gateways, plans, and revenue policies</p>
                </div>
                <button 
                    onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 1000); }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                    <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Payment Gateway */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <CreditCard size={20} className="text-indigo-400" />
                        Stripe Integration
                    </h3>
                    <SettingRow title="Live Mode" description="Use live Stripe keys for real payment processing">
                        <Toggle />
                    </SettingRow>
                    <SettingRow title="Webhook Secret" description="Used to verify Stripe events (e.g., recurring payment success)">
                        <input type="password" value="whsec_********" className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm" />
                    </SettingRow>
                </div>

                {/* Subscription Policies */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <Layers size={20} className="text-indigo-400" />
                        Plan Management
                    </h3>
                    <SettingRow title="Subscription Grace Period" description="Days before account suspension for failed payments">
                        <input type="number" defaultValue={7} className="w-16 bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm" />
                    </SettingRow>
                    <SettingRow title="Proration Behavior" description="Calculate charges for mid-cycle plan changes">
                        <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300">
                            <option selected>Always Prorate</option>
                            <option>No Proration</option>
                        </select>
                    </SettingRow>
                </div>

                {/* Revenue & Dunning */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <Zap size={20} className="text-indigo-400" />
                        Dunning & Recovery
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SettingRow icon={Bell} title="Failed Payment Alerts" description="Notify admins immediately upon payment failure">
                            <Toggle defaultOn />
                        </SettingRow>
                        <SettingRow icon={AlertCircle} title="Termination Auto-lock" description="Lock tenant access if overdue balance exceeds 30 days">
                            <Toggle defaultOn />
                        </SettingRow>
                        <SettingRow icon={Shield} title="Invoice Reconciliation" description="Enable automated matches for wire transfer payments">
                            <Toggle />
                        </SettingRow>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingSettings;
