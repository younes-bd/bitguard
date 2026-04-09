import React, { useState } from 'react';
import { Settings, Save, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';

const ItsmSettings = () => {
    const [settings, setSettings] = useState({
        autoApprovelow: false,
        requireRollbackPlan: true,
        cabRequiredForHigh: true,
        maxConcurrentChanges: 5,
        changeWindowStart: '22:00',
        changeWindowEnd: '06:00',
        notifyOnStatusChange: true,
    });
    const [saving, setSaving] = useState(false);

    const handleToggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

    const handleSave = async () => {
        setSaving(true);
        // Simulates save — in production, POST to backend
        setTimeout(() => { setSaving(false); alert('Settings saved.'); }, 800);
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Settings className="text-indigo-400" size={28} /> ITSM Settings
                </h1>
                <p className="text-slate-400">Configure change control workflows and policies.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
                {[
                    { key: 'autoApprovelow', label: 'Auto-approve Low-Risk Changes', desc: 'Automatically approve changes classified as low risk without CAB review.' },
                    { key: 'requireRollbackPlan', label: 'Require Rollback Plan', desc: 'Every change request must include a rollback strategy before submission.' },
                    { key: 'cabRequiredForHigh', label: 'CAB Required for High Risk', desc: 'High-risk changes require Change Advisory Board quorum approval.' },
                    { key: 'notifyOnStatusChange', label: 'Status Change Notifications', desc: 'Send email notifications when a change request status is updated.' },
                ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-5">
                        <div>
                            <p className="text-white font-medium">{item.label}</p>
                            <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
                        </div>
                        <button onClick={() => handleToggle(item.key)} className="text-slate-400 hover:text-white transition-colors">
                            {settings[item.key] ? <ToggleRight size={32} className="text-indigo-500" /> : <ToggleLeft size={32} />}
                        </button>
                    </div>
                ))}
                <div className="p-5 flex items-center justify-between">
                    <div>
                        <p className="text-white font-medium">Max Concurrent Changes</p>
                        <p className="text-slate-500 text-sm">Maximum number of changes allowed in progress simultaneously.</p>
                    </div>
                    <input type="number" value={settings.maxConcurrentChanges} onChange={e => setSettings({...settings, maxConcurrentChanges: parseInt(e.target.value) || 0})}
                        className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-center" />
                </div>
                <div className="p-5 flex items-center justify-between">
                    <div>
                        <p className="text-white font-medium">Change Window</p>
                        <p className="text-slate-500 text-sm">Recommended hours for executing changes (e.g. off-peak).</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="time" value={settings.changeWindowStart} onChange={e => setSettings({...settings, changeWindowStart: e.target.value})}
                            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" />
                        <span className="text-slate-500">to</span>
                        <input type="time" value={settings.changeWindowEnd} onChange={e => setSettings({...settings, changeWindowEnd: e.target.value})}
                            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2">
                    {saving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
};

export default ItsmSettings;
