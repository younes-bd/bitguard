import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2, FileCode2 } from 'lucide-react';
import reportingService from '../../../../core/api/reportingService';

export default function ReportingSettings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await reportingService.getSettings();
            if (res && res.results && res.results.length > 0) {
                setSettings(res.results[0]);
            } else if (res && res.length > 0) {
                setSettings(res[0]);
            } else {
                setSettings({
                    paper_format: 'A4',
                    margin_top: 15,
                    margin_bottom: 15,
                    margin_left: 15,
                    margin_right: 15,
                    company_header_html: '',
                    company_footer_html: ''
                });
            }
        } catch (err) {
            console.error(err);
            setSettings({
                paper_format: 'A4',
                margin_top: 15,
                margin_bottom: 15,
                margin_left: 15,
                margin_right: 15,
                company_header_html: '',
                company_footer_html: ''
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (settings.id) {
                await reportingService.updateSettings(settings.id, settings);
            } else {
                await reportingService.createSettings(settings);
            }
            // re-fetch to get updated id if it was a create
            fetchSettings();
        } catch (err) {
            console.error('Failed to save settings:', err);
        } finally {
            setSaving(false);
        }
    };

    if (!settings) {
        return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 font-['Outfit']">
                    <Settings className="text-blue-500 w-8 h-8" />
                    Reporting Settings
                </h1>
                <p className="text-slate-400 mt-2">Configure default layout and company headers for generated PDFs.</p>
            </div>

            <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-8 space-y-8">
                    
                    {/* Paper Settings */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <FileCode2 size={20} className="text-slate-500" />
                            Document Layout
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-400 text-sm mb-2 font-medium">Paper Format</label>
                                <select 
                                    value={settings.paper_format}
                                    onChange={(e) => setSettings({...settings, paper_format: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="A4">A4 (210 x 297 mm)</option>
                                    <option value="Letter">US Letter (8.5 x 11 in)</option>
                                    <option value="Legal">Legal (8.5 x 14 in)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm mb-2 font-medium">Margins (mm)</label>
                                <div className="grid grid-cols-4 gap-2">
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-1">Top</span>
                                        <input type="number" value={settings.margin_top} onChange={e => setSettings({...settings, margin_top: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-1">Bottom</span>
                                        <input type="number" value={settings.margin_bottom} onChange={e => setSettings({...settings, margin_bottom: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-1">Left</span>
                                        <input type="number" value={settings.margin_left} onChange={e => setSettings({...settings, margin_left: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-1">Right</span>
                                        <input type="number" value={settings.margin_right} onChange={e => setSettings({...settings, margin_right: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-blue-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-800" />

                    {/* Headers & Footers */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <FileCode2 size={20} className="text-slate-500" />
                            Global Header & Footer
                        </h3>
                        <div>
                            <label className="block text-slate-400 text-sm mb-2 font-medium">Company Header HTML</label>
                            <textarea 
                                value={settings.company_header_html || ''}
                                onChange={e => setSettings({...settings, company_header_html: e.target.value})}
                                placeholder="<div class='header'>...</div>"
                                className="w-full bg-[#1e1e1e] border border-slate-800 rounded-xl p-4 text-emerald-400 font-mono text-sm focus:outline-none focus:border-blue-500"
                                rows="4"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-2 font-medium">Company Footer HTML</label>
                            <textarea 
                                value={settings.company_footer_html || ''}
                                onChange={e => setSettings({...settings, company_footer_html: e.target.value})}
                                placeholder="<div class='footer'>Page <span class='page'></span></div>"
                                className="w-full bg-[#1e1e1e] border border-slate-800 rounded-xl p-4 text-emerald-400 font-mono text-sm focus:outline-none focus:border-blue-500"
                                rows="4"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
}
