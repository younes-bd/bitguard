import React, { useState, useEffect } from 'react';
import { Save, Loader2, Cpu } from 'lucide-react';
import { agentsService } from '../../../agents/api/agentsService';
import toast from 'react-hot-toast';

export default function AiEngineSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settingsId, setSettingsId] = useState(null);
    const [settings, setSettings] = useState({
        enabled: false,
        provider: 'openai',
        api_key: ''
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await agentsService.getAISettings().catch(() => ({ data: [] }));
            const dataList = res.data?.results || res.data || [];
            
            if (dataList.length > 0) {
                const row = dataList[0];
                setSettingsId(row.id);
                setSettings({
                    enabled: row.is_active,
                    provider: row.preferred_provider,
                    api_key: ''
                });
            }
        } catch (error) {
            toast.error('Failed to load AI Engine settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                is_active: settings.enabled,
                preferred_provider: settings.provider
            };
            if (settings.api_key) {
                if (settings.provider === 'openai') {
                    payload.openai_api_key = settings.api_key;
                } else if (settings.provider === 'anthropic') {
                    payload.anthropic_api_key = settings.api_key;
                }
            }

            if (settingsId) {
                await agentsService.updateAISettings(settingsId, payload);
            } else {
                await agentsService.createAISettings(payload);
            }
            toast.success('AI Engine settings saved');
            setSettings(p => ({ ...p, api_key: '' })); // Clear after save
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;
    }

    return (
        <div className="max-w-4xl animate-fade-in">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">AI Engine Settings</h1>
                <p className="text-slate-400">Configure your connection to OpenAI, Anthropic, or other LLMs.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Cpu className="text-purple-500 w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">AI Engine Active</h3>
                            <p className="text-sm text-slate-400">Enable or disable global AI features</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.enabled} onChange={e => setSettings(p => ({...p, enabled: e.target.checked}))} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                </div>
                
                {settings.enabled && (
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                        <div>
                            <label className="text-sm font-medium text-slate-400">Provider</label>
                            <select value={settings.provider} onChange={e => setSettings(p => ({...p, provider: e.target.value}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:ring-purple-500 focus:border-purple-500 transition-colors">
                                <option value="openai">OpenAI</option>
                                <option value="anthropic">Anthropic</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">API Key <span className="text-xs text-slate-500">(Leave empty to keep existing key)</span></label>
                            <input type="password" placeholder={settings.provider === 'openai' ? 'sk-...' : 'sk-ant-...'} value={settings.api_key} onChange={e => setSettings(p => ({...p, api_key: e.target.value}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:ring-purple-500 focus:border-purple-500 transition-colors" />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end pb-8">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-purple-500/20"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Settings
                </button>
            </div>
        </div>
    );
}
