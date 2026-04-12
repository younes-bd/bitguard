import React, { useState } from 'react';
import { Settings, Save, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';

const ApprovalSettings = () => {
    const [settings, setSettings] = useState({
        autoEscalateAfterHours: 48,
        requireCommentsOnReject: true,
        enableMultiStepApproval: true,
        notifyRequesterOnDecision: true,
        allowSelfApproval: false,
        purchaseThreshold: 5000,
        expenseAutoApprove: false,
    });
    const [saving, setSaving] = useState(false);

    const handleToggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

    const handleSave = async () => {
        setSaving(true);
        setTimeout(() => { setSaving(false); alert('Settings saved.'); }, 800);
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Settings className="text-orange-400" size={28} /> Approval Settings
                </h1>
                <p className="text-slate-400">Configure approval workflows, thresholds, and escalation rules.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
                {[
                    { key: 'enableMultiStepApproval', label: 'Multi-Step Approval Chains', desc: 'Enable sequential multi-approver workflows for complex requests.' },
                    { key: 'requireCommentsOnReject', label: 'Require Comments on Rejection', desc: 'Approvers must provide a reason when rejecting a request.' },
                    { key: 'notifyRequesterOnDecision', label: 'Notify on Decision', desc: 'Send email/notification to the requester when their request is decided.' },
                    { key: 'allowSelfApproval', label: 'Allow Self-Approval', desc: 'Permit users to approve their own requests (not recommended for compliance).' },
                    { key: 'expenseAutoApprove', label: 'Auto-Approve Expenses Under Threshold', desc: 'Automatically approve expense claims below the purchase threshold.' },
                ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-5">
                        <div>
                            <p className="text-white font-medium">{item.label}</p>
                            <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
                        </div>
                        <button onClick={() => handleToggle(item.key)} className="text-slate-400 hover:text-white transition-colors">
                            {settings[item.key] ? <ToggleRight size={32} className="text-orange-500" /> : <ToggleLeft size={32} />}
                        </button>
                    </div>
                ))}
                <div className="p-5 flex items-center justify-between">
                    <div>
                        <p className="text-white font-medium">Auto-Escalation Timeout</p>
                        <p className="text-slate-500 text-sm">Auto-escalate pending approvals after this many hours.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" value={settings.autoEscalateAfterHours} onChange={e => setSettings({...settings, autoEscalateAfterHours: parseInt(e.target.value) || 0})}
                            className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-center" />
                        <span className="text-slate-500 text-sm">hours</span>
                    </div>
                </div>
                <div className="p-5 flex items-center justify-between">
                    <div>
                        <p className="text-white font-medium">Purchase Approval Threshold</p>
                        <p className="text-slate-500 text-sm">Purchases above this amount require explicit approval.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">$</span>
                        <input type="number" value={settings.purchaseThreshold} onChange={e => setSettings({...settings, purchaseThreshold: parseInt(e.target.value) || 0})}
                            className="w-28 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-center" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2">
                    {saving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
};

export default ApprovalSettings;
