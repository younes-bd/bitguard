import React, { useState } from 'react';
import { Settings, Save, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';

const DocumentSettings = () => {
    const [settings, setSettings] = useState({
        enableVersioning: true,
        autoArchiveAfterDays: 365,
        maxFileSizeMB: 50,
        allowedExtensions: '.pdf,.docx,.xlsx,.pptx,.txt,.md,.csv,.zip',
        requireApprovalForDelete: true,
        enableAuditTrail: true,
        retentionPolicyEnabled: false,
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
                    <Settings className="text-purple-400" size={28} /> Document Settings
                </h1>
                <p className="text-slate-400">Configure storage, versioning, and document retention policies.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
                {[
                    { key: 'enableVersioning', label: 'Enable Version History', desc: 'Keep historical versions of documents when updated.' },
                    { key: 'requireApprovalForDelete', label: 'Require Approval for Deletion', desc: 'Documents cannot be permanently deleted without admin approval.' },
                    { key: 'enableAuditTrail', label: 'Audit Trail', desc: 'Log all document access, edits, and deletions for compliance.' },
                    { key: 'retentionPolicyEnabled', label: 'Auto-Archive Policy', desc: 'Automatically archive documents older than the retention period.' },
                ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-5">
                        <div>
                            <p className="text-white font-medium">{item.label}</p>
                            <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
                        </div>
                        <button onClick={() => handleToggle(item.key)} className="text-slate-400 hover:text-white transition-colors">
                            {settings[item.key] ? <ToggleRight size={32} className="text-purple-500" /> : <ToggleLeft size={32} />}
                        </button>
                    </div>
                ))}
                <div className="p-5 flex items-center justify-between">
                    <div>
                        <p className="text-white font-medium">Max File Size</p>
                        <p className="text-slate-500 text-sm">Maximum upload size per document in megabytes.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" value={settings.maxFileSizeMB} onChange={e => setSettings({...settings, maxFileSizeMB: parseInt(e.target.value) || 0})}
                            className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-center" />
                        <span className="text-slate-500 text-sm">MB</span>
                    </div>
                </div>
                <div className="p-5 flex items-center justify-between">
                    <div>
                        <p className="text-white font-medium">Retention Period</p>
                        <p className="text-slate-500 text-sm">Auto-archive documents after this many days.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" value={settings.autoArchiveAfterDays} onChange={e => setSettings({...settings, autoArchiveAfterDays: parseInt(e.target.value) || 0})}
                            className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-center" />
                        <span className="text-slate-500 text-sm">days</span>
                    </div>
                </div>
                <div className="p-5">
                    <p className="text-white font-medium mb-1">Allowed File Extensions</p>
                    <p className="text-slate-500 text-sm mb-3">Comma-separated list of permitted file types.</p>
                    <input type="text" value={settings.allowedExtensions} onChange={e => setSettings({...settings, allowedExtensions: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm font-mono" />
                </div>
            </div>

            <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2">
                    {saving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
};

export default DocumentSettings;
