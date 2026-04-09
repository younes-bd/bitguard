import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Globe, Database, Mail, Clock, CreditCard, Calculator, FileText } from 'lucide-react';

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
            className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-emerald-600' : 'bg-slate-700'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : ''}`} />
        </button>
    );
};

const ErpSettings = () => {
    const [saving, setSaving] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Settings className="text-emerald-400" size={28} />
                        Finance & ERP Settings
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Configure fiscal year, tax rules, and invoicing behavior</p>
                </div>
                <button 
                    onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 1000); }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                    <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Financial Period */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <Clock size={20} className="text-emerald-400" />
                        Fiscal Period
                    </h3>
                    <SettingRow title="Fiscal Year End" description="Define the month your fiscal year closes">
                        <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none">
                            <option>December (Default)</option>
                            <option>March</option>
                            <option>June</option>
                            <option>September</option>
                        </select>
                    </SettingRow>
                    <SettingRow title="Period Locking" description="Auto-lock accounting periods after closing">
                        <Toggle defaultOn />
                    </SettingRow>
                </div>

                {/* Tax & Invoicing */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <Calculator size={20} className="text-emerald-400" />
                        Taxation & VAT
                    </h3>
                    <SettingRow title="Global VAT/Sales Tax Rate" description="Primary tax percentage for all service invoices">
                        <div className="flex items-center gap-2">
                            <input type="number" defaultValue={20} className="w-16 bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm" />
                            <span className="text-slate-400">%</span>
                        </div>
                    </SettingRow>
                    <SettingRow title="Tax Identification Number" description="Display business TRN/VAT ID on all documents">
                        <input type="text" placeholder="TRN-123456789" className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm" />
                    </SettingRow>
                </div>

                {/* Payment & Terms */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <CreditCard size={20} className="text-emerald-400" />
                        Accounts Receivable
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SettingRow icon={FileText} title="Default Payment Terms" description="Set due date for new invoices created in the system">
                            <select defaultValue="Net 30" className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300">
                                <option>Due on Receipt</option>
                                <option>Net 15</option>
                                <option>Net 30</option>
                                <option>Net 60</option>
                            </select>
                        </SettingRow>
                        <SettingRow icon={Bell} title="Overdue Auto-reminders" description="Auto-email clients when invoices become overdue">
                            <Toggle defaultOn />
                        </SettingRow>
                        <SettingRow icon={Shield} title="Multi-level Approval" description="Large expenses require manager & finance team approval">
                            <Toggle defaultOn />
                        </SettingRow>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErpSettings;
