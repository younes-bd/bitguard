import React, { useState, useEffect } from 'react';
import { Settings, Save, Globe, Code } from 'lucide-react';
import websiteService from '../../api/websiteService';

export default function CmsSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [websiteId, setWebsiteId] = useState(null);
    const [settings, setSettings] = useState({
        googleAnalyticsKey: '',
        plausibleDomain: '',
        defaultLanguage: 'en',
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await websiteService.getWebsites();
            if (data.length > 0) {
                // Get the default website, or just the first one if none is default
                const defaultSite = data.find(w => w.is_default) || data[0];
                setWebsiteId(defaultSite.id);
                setSettings({
                    googleAnalyticsKey: defaultSite.google_analytics_key || '',
                    plausibleDomain: defaultSite.plausible_domain || '',
                    defaultLanguage: defaultSite.language || 'en'
                });
            }
        } catch (error) {
            console.error("Failed to load settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!websiteId) {
            alert("No website found to update.");
            return;
        }
        setSaving(true);
        try {
            await websiteService.updateWebsite(websiteId, {
                google_analytics_key: settings.googleAnalyticsKey,
                plausible_domain: settings.plausibleDomain,
                language: settings.defaultLanguage
            });
            alert('Settings saved successfully!');
        } catch (error) {
            console.error("Failed to save settings:", error);
            alert("Error saving settings.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Settings className="text-sky-400" size={28} /> Website Settings
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Configure global website properties and integrations</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-sky-600/20 active:scale-95 disabled:opacity-50"
                >
                    <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            <div className="space-y-8">
                {/* General Settings */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden p-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                        <Globe className="text-slate-400" size={20} /> General
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300">Default Language</label>
                            <select 
                                value={settings.defaultLanguage}
                                onChange={(e) => setSettings({...settings, defaultLanguage: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="en">English (US)</option>
                                <option value="fr">French (FR)</option>
                                <option value="es">Spanish (ES)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Analytics */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden p-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                        <Code className="text-slate-400" size={20} /> Analytics & Tracking
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300">Google Analytics Measurement ID</label>
                            <input 
                                type="text" 
                                placeholder="G-XXXXXXXXXX"
                                value={settings.googleAnalyticsKey}
                                onChange={(e) => setSettings({...settings, googleAnalyticsKey: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                            />
                            <p className="text-xs text-slate-500 mt-1">Leave blank to disable GA4 tracking.</p>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300">Plausible Analytics Domain</label>
                            <input 
                                type="text" 
                                placeholder="example.com"
                                value={settings.plausibleDomain}
                                onChange={(e) => setSettings({...settings, plausibleDomain: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                            />
                            <p className="text-xs text-slate-500 mt-1">Leave blank to disable Plausible tracking.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

