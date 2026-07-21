import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import { settingsService } from '../../../settings/api/settingsService';

const DocumentSettings = () => {
    const [settings, setSettings] = useState({
        DOC_VER_ENABLED: true,
        DOC_AUTO_ARCHIVE_DAYS: 365,
        DOC_MAX_SIZE: 50,
        DOC_ALLOWED_EXT: '.pdf,.docx,.xlsx,.pptx,.txt,.md,.csv,.zip',
        DOC_DELETE_APPROVAL: true,
        DOC_AUDIT_TRAIL: true,
        DOC_RETENTION_POLICY: false,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setLoading(true);
        settingsService.getSettings()
            .then(res => {
                const apiSettings = res.data?.results || res.data || [];
                const mapped = { ...settings };
                apiSettings.forEach(s => {
                    if (settings.hasOwnProperty(s.key)) {
                        mapped[s.key] = s.setting_type === 'boolean' ? (s.value === 'true') : 
                                         s.setting_type === 'integer' ? parseInt(s.value) : s.value;
                    }
                });
                setSettings(mapped);
            })
            .catch(err => console.error('Failed to load document settings:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleToggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

    const handleSave = async () => {
        setSaving(true);
        try {
            await settingsService.batchUpdateSettings(settings);
            alert('Document settings updated successfully.');
        } catch (err) {
            console.error('Failed to save settings:', err);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <Loader2 className="animate-spin text-purple-500" size={32} />
        </div>
    );

    return (
        <div className="space-y-6 max-w-3xl animate-in fade-in duration-300">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3 font-['Outfit']">
                    <Settings className="text-purple-400" size={28} /> Document Settings
                </h1>
                <p className="text-slate-400">Configure storage, versioning, and document retention policies.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800 shadow-2xl">
                {[
                    { key: 'DOC_VER_ENABLED', label: 'Enable Version History', desc: 'Keep historical versions of documents when updated.' },
                    { key: 'DOC_DELETE_APPROVAL', label: 'Require Approval for Deletion', desc: 'Documents cannot be permanently deleted without admin approval.' },
                    { key: 'DOC_AUDIT_TRAIL', label: 'Audit Trail', desc: 'Log all document access, edits, and deletions for compliance.' },
                    { key: 'DOC_RETENTION_POLICY', label: 'Auto-Archive Policy', desc: 'Automatically archive documents older than the retention period.' },
                ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-5 hover:bg-slate-800/20 transition-colors">
                        <div>
                            <p className="text-white font-medium">{item.label}</p>
                            <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
                        </div>
                        <button onClick={() => handleToggle(item.key)} className="transition-transform active:scale-90">
                            {settings[item.key] ? <ToggleRight size={36} className="text-purple-500" /> : <ToggleLeft size={36} className="text-slate-600" />}
                        </button>
                    </div>
                ))}
                
                <div className="p-5 flex items-center justify-between">
                    <div>
                        <p className="text-white font-medium">Max File Size</p>
                        <p className="text-slate-500 text-sm">Maximum upload size per document in megabytes.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" value={settings.DOC_MAX_SIZE} 
                            onChange={e => setSettings({...settings, DOC_MAX_SIZE: parseInt(e.target.value) || 0})}
                            className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-center focus:ring-1 focus:ring-purple-500" />
                        <span className="text-slate-500 text-sm font-bold">MB</span>
                    </div>
                </div>

                <div className="p-5 flex items-center justify-between">
                    <div>
                        <p className="text-white font-medium">Retention Period</p>
                        <p className="text-slate-500 text-sm">Auto-archive documents after this many days.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" value={settings.DOC_AUTO_ARCHIVE_DAYS} 
                            onChange={e => setSettings({...settings, DOC_AUTO_ARCHIVE_DAYS: parseInt(e.target.value) || 0})}
                            className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-center focus:ring-1 focus:ring-purple-500" />
                        <span className="text-slate-500 text-sm font-bold">days</span>
                    </div>
                </div>

                <div className="p-5">
                    <p className="text-white font-medium mb-1">Allowed File Extensions</p>
                    <p className="text-slate-500 text-sm mb-3">Comma-separated list of permitted file types.</p>
                    <input type="text" value={settings.DOC_ALLOWED_EXT} 
                        onChange={e => setSettings({...settings, DOC_ALLOWED_EXT: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm font-mono focus:ring-1 focus:ring-purple-500" />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button onClick={handleSave} disabled={saving}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/30 active:scale-95 disabled:opacity-50 flex items-center gap-2">
                    {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                    {saving ? 'Synchronizing...' : 'Save Configuration'}
                </button>
            </div>
        </div>
    );
};

export default DocumentSettings;
