import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Globe, Database, Mail, Clock, Truck, Package, CheckSquare, Factory } from 'lucide-react';

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
            className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-orange-600' : 'bg-slate-700'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : ''}`} />
        </button>
    );
};

const ScmSettings = () => {
    const [saving, setSaving] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Settings className="text-orange-400" size={28} />
                        Procurement & SCM Settings
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage inventory, vendors, and purchase order policies</p>
                </div>
                <button 
                    onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 1000); }}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                    <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Inventory Management */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <Package size={20} className="text-orange-400" />
                        Inventory Rules
                    </h3>
                    <SettingRow title="Auto-reorder Threshold" description="Fire notification when stock drops below minimum safety stock">
                        <Toggle defaultOn />
                    </SettingRow>
                    <SettingRow title="Default Lead Time" description="Used to project expected arrival of new stock (days)">
                        <input type="number" defaultValue={7} className="w-16 bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm" />
                    </SettingRow>
                </div>

                {/* Vendor Management */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <Factory size={20} className="text-orange-400" />
                        Vendor Policies
                    </h3>
                    <SettingRow title="Preferred Vendor Enforcement" description="Only allow users to create POs from preferred vendors">
                        <Toggle />
                    </SettingRow>
                    <SettingRow title="Vetting Requirements" description="Require background check and compliance flags for new vendors">
                        <Toggle defaultOn />
                    </SettingRow>
                </div>

                {/* Purchase Order Flow */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <CheckSquare size={20} className="text-orange-400" />
                        PO Approval Workflow
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SettingRow icon={Shield} title="Multi-step Approval" description="Force secondary approval for POs exceeding $5,000">
                            <Toggle defaultOn />
                        </SettingRow>
                        <SettingRow icon={Mail} title="Auto-send to Vendor" description="Send PDF copy to vendor upon final approval">
                            <Toggle />
                        </SettingRow>
                        <SettingRow icon={Clock} title="Audit Logging" description="Track every change to PO status and line items">
                            <Toggle defaultOn />
                        </SettingRow>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScmSettings;
