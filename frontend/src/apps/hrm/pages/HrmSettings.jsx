import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Globe, Database, Mail, Clock, Users, Building2, Calendar, Briefcase } from 'lucide-react';

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
            className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-pink-600' : 'bg-slate-700'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : ''}`} />
        </button>
    );
};

const HrmSettings = () => {
    const [saving, setSaving] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Settings className="text-pink-400" size={28} />
                        Human Resources Settings
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Configure departments, leave policies, and work schedules</p>
                </div>
                <button 
                    onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 1000); }}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                    <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Organization Structure */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <Building2 size={20} className="text-pink-400" />
                        Departments & Structure
                    </h3>
                    <SettingRow title="Active Departments" description="Managed list of functional groups within the company">
                        <div className="flex flex-wrap gap-2 justify-end max-w-[200px]">
                            {['IT', 'Sales', 'Finance', 'HR', 'Support'].map(dept => (
                                <span key={dept} className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-400">{dept}</span>
                            ))}
                        </div>
                    </SettingRow>
                    <SettingRow title="Automatic Manager Assignment" description="Assign manager based on department head field">
                        <Toggle defaultOn />
                    </SettingRow>
                </div>

                {/* Absence & Leave */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <Calendar size={20} className="text-pink-400" />
                        Leave Policies
                    </h3>
                    <SettingRow title="Annual Leave Accrual" description="Days of annual leave granted per year per staff member">
                        <input type="number" defaultValue={21} className="w-16 bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm" />
                    </SettingRow>
                    <SettingRow title="Leave Carry-over" description="Allow unused leave days to roll into the next year">
                        <Toggle />
                    </SettingRow>
                </div>

                {/* Work Schedule */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2">
                    <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                        <Briefcase size={20} className="text-pink-400" />
                        Work & Time Policy
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SettingRow icon={Clock} title="Standard Work Hours" description="Define the default shift hours per week">
                            <input type="number" defaultValue={40} className="w-16 bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm" />
                        </SettingRow>
                        <SettingRow icon={Mail} title="Time-off Notifications" description="Notify entire team of approved leave via email">
                            <Toggle defaultOn />
                        </SettingRow>
                        <SettingRow icon={Shield} title="Confidential Information" description="Enforce view restrictions on employee private details">
                            <Toggle defaultOn />
                        </SettingRow>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HrmSettings;
