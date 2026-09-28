import React, { useState, useEffect } from 'react';
import { parameterService } from '../../../core/api/parameterService';
import { Save, Loader2, Inbox as InboxIcon } from 'lucide-react';
import toast from 'react-hot-toast';


export default function CampaignsSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        enabled: false,
        provider: 'smtp',
        api_key: '',
        sender_name: '',
        sender_email: ''
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await parameterService.getSettings();
            const data = res.data?.results || res.data || [];
            
            const current = { ...settings };
            
            data.forEach(item => {
                if (item.key === 'campaigns_enabled') current.enabled = item.value === 'true';
                if (item.key === 'campaigns_provider') current.provider = item.value;
                if (item.key === 'campaigns_api_key') current.api_key = item.value;
                if (item.key === 'campaigns_sender_name') current.sender_name = item.value;
                if (item.key === 'campaigns_sender_email') current.sender_email = item.value;
            });
            
            setSettings(current);
        } catch (error) {
            toast.error('Failed to load Campaigns settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                campaigns_enabled: settings.enabled ? 'true' : 'false',
                campaigns_provider: settings.provider,
                campaigns_api_key: settings.api_key,
                campaigns_sender_name: settings.sender_name,
                campaigns_sender_email: settings.sender_email
            };
            
            await parameterService.batchUpdateSettings(payload);
            toast.success('Campaigns settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-yellow-500 w-8 h-8" /></div>;

    return (
        <div className="p-6 max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
                    <InboxIcon className="text-yellow-500" />
                    Email Campaigns
                </h1>
                <p className="text-slate-400">Configure mass mailing provider settings.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                            <InboxIcon className="text-yellow-500 w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Campaign Engine</h3>
                            <p className="text-sm text-slate-400">Enable automated email journeys and mass mailings</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.enabled} onChange={e => setSettings(p => ({...p, enabled: e.target.checked}))} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                    </label>
                </div>
                {settings.enabled && (
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                        <div>
                            <label className="text-sm font-medium text-slate-400">Provider</label>
                            <select value={settings.provider} onChange={e => setSettings(p => ({...p, provider: e.target.value}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:ring-yellow-500 focus:border-yellow-500 transition-colors">
                                <option value="smtp">Standard SMTP</option>
                                <option value="sendgrid">SendGrid</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">API Key</label>
                            <input type="password" value={settings.api_key} onChange={e => setSettings(p => ({...p, api_key: e.target.value}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:ring-yellow-500 focus:border-yellow-500 transition-colors" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Sender Name</label>
                            <input value={settings.sender_name} onChange={e => setSettings(p => ({...p, sender_name: e.target.value}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:ring-yellow-500 focus:border-yellow-500 transition-colors" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Sender Email</label>
                            <input type="email" value={settings.sender_email} onChange={e => setSettings(p => ({...p, sender_email: e.target.value}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:ring-yellow-500 focus:border-yellow-500 transition-colors" />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Settings
                </button>
            </div>
        </div>
    );
}
