import React, { useState, useEffect } from 'react';
import { parameterService } from '../../../core/api/parameterService';
import { Save, Loader2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';


export default function WhatsappSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        enabled: false,
        phone_number_id: '',
        access_token: '',
        webhook_verify_token: ''
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
                if (item.key === 'whatsapp_enabled') current.enabled = item.value === 'true';
                if (item.key === 'whatsapp_phone_number_id') current.phone_number_id = item.value;
                if (item.key === 'whatsapp_access_token') current.access_token = item.value;
                if (item.key === 'whatsapp_webhook_verify_token') current.webhook_verify_token = item.value;
            });
            
            setSettings(current);
        } catch (error) {
            toast.error('Failed to load WhatsApp settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                whatsapp_enabled: settings.enabled ? 'true' : 'false',
                whatsapp_phone_number_id: settings.phone_number_id,
                whatsapp_access_token: settings.access_token,
                whatsapp_webhook_verify_token: settings.webhook_verify_token
            };
            
            await parameterService.batchUpdateSettings(payload);
            toast.success('WhatsApp settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-green-500 w-8 h-8" /></div>;

    return (
        <div className="p-6 max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
                    <MessageCircle className="text-green-500" />
                    WhatsApp Business API
                </h1>
                <p className="text-slate-400">Configure Meta WhatsApp Business integration.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <MessageCircle className="text-green-500 w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">WhatsApp Integration</h3>
                            <p className="text-sm text-slate-400">Enable receiving and sending messages via WhatsApp</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.enabled} onChange={e => setSettings(p => ({...p, enabled: e.target.checked}))} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>
                {settings.enabled && (
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                        <div>
                            <label className="text-sm font-medium text-slate-400">Phone Number ID</label>
                            <input value={settings.phone_number_id} onChange={e => setSettings(p => ({...p, phone_number_id: e.target.value}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:ring-green-500 focus:border-green-500 transition-colors" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Access Token</label>
                            <input type="password" value={settings.access_token} onChange={e => setSettings(p => ({...p, access_token: e.target.value}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:ring-green-500 focus:border-green-500 transition-colors" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Webhook Verify Token</label>
                            <input value={settings.webhook_verify_token} onChange={e => setSettings(p => ({...p, webhook_verify_token: e.target.value}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:ring-green-500 focus:border-green-500 transition-colors" />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Settings
                </button>
            </div>
        </div>
    );
}
