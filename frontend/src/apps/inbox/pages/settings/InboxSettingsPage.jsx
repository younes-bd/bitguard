import React, { useState, useEffect } from 'react';
import { parameterService } from '../../../core/api/parameterService';
import { Bell, Save, Loader2, Smartphone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';


export default function InboxSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        email_inbox: true,
        sms_inbox: false,
        push_inbox: true,
        daily_digest: true,
        weekly_summary: false,
        twilio_sid: '',
        twilio_token: '',
        twilio_number: ''
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await parameterService.getSettings();
            const data = res.data?.results || res.data || [];
            
            // Map settings array to object
            const currentSettings = { ...settings };
            data.forEach(item => {
                if (item.key in currentSettings) {
                    currentSettings[item.key] = item.value === 'true' ? true : (item.value === 'false' ? false : item.value);
                }
            });
            
            setSettings(currentSettings);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load notification settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Convert object to dictionary for batch update
            const payload = {};
            Object.keys(settings).forEach(key => {
                payload[key] = typeof settings[key] === 'boolean' ? (settings[key] ? 'true' : 'false') : settings[key];
            });
            
            await parameterService.batchUpdateSettings(payload);
            toast.success('Notification settings saved successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 max-w-4xl flex justify-center py-12">
                <Loader2 className="animate-spin text-purple-500 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
                    <Bell className="text-purple-500" />
                    Notification Preferences
                </h1>
                <p className="text-slate-400">Manage how and when your team receives alerts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Inbox */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                        <Mail className="w-4 h-4 text-purple-400" /> System Inbox
                    </h3>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-200">Email Inbox</p>
                            <p className="text-xs text-slate-500">Receive alerts via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.email_inbox} onChange={e => setSettings(p => ({...p, email_inbox: e.target.checked}))} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-200">Push Inbox</p>
                            <p className="text-xs text-slate-500">In-app browser push alerts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.push_inbox} onChange={e => setSettings(p => ({...p, push_inbox: e.target.checked}))} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                        <div>
                            <p className="text-sm font-medium text-slate-200">Daily Digest</p>
                            <p className="text-xs text-slate-500">Summary of the day's events</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.daily_digest} onChange={e => setSettings(p => ({...p, daily_digest: e.target.checked}))} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                </div>

                {/* SMS Provider */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-semibold text-white flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-purple-400" /> SMS Provider (Twilio)
                        </h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.sms_inbox} onChange={e => setSettings(p => ({...p, sms_inbox: e.target.checked}))} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>

                    {settings.sms_inbox && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-400">Account SID</label>
                                <input
                                    value={settings.twilio_sid}
                                    onChange={e => setSettings(p => ({...p, twilio_sid: e.target.value}))}
                                    className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">Auth Token</label>
                                <input
                                    type="password"
                                    value={settings.twilio_token}
                                    onChange={e => setSettings(p => ({...p, twilio_token: e.target.value}))}
                                    className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">Sender Number</label>
                                <input
                                    value={settings.twilio_number}
                                    onChange={e => setSettings(p => ({...p, twilio_number: e.target.value}))}
                                    className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                                    placeholder="+1234567890"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Preferences
                </button>
            </div>
        </div>
    );
}
