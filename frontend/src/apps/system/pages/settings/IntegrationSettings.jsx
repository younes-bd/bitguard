import React, { useState, useEffect } from 'react';
import { Save, Loader2, Webhook, BarChart, MessageSquare, MessageCircle, Cpu, Mail as MailIcon, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsService } from '../../api/settingsService';
import { aiAgentService } from '../../../ai_agent/api/aiAgentService';

export default function IntegrationSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [aiSettingsId, setAiSettingsId] = useState(null);
    const [integrations, setIntegrations] = useState({
        google_analytics: { enabled: false, tracking_id: '' },
        slack: { enabled: false, webhook_url: '' },
        zapier: { enabled: false, api_key: '' },
        sms: { enabled: false, provider: 'twilio', account_sid: '', auth_token: '', from_number: '' },
        whatsapp: { enabled: false, phone_number_id: '', access_token: '', webhook_verify_token: '' },
        ai_engine: { enabled: false, provider: 'openai', api_key: '' },
        mass_mailing: { enabled: false, provider: 'smtp', api_key: '', sender_name: '', sender_email: '' }
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const [sysRes, aiRes] = await Promise.all([
                settingsService.getSettings(),
                aiAgentService.getAISettings().catch(() => ({ data: [] }))
            ]);
            
            const sysData = sysRes.data?.results || sysRes.data || [];
            const aiDataList = aiRes.data?.results || aiRes.data || [];
            
            const current = { ...integrations };
            
            sysData.forEach(item => {
                if (item.key === 'google_analytics_enabled') current.google_analytics.enabled = item.value === 'true';
                if (item.key === 'google_analytics_tracking_id') current.google_analytics.tracking_id = item.value;
                if (item.key === 'slack_enabled') current.slack.enabled = item.value === 'true';
                if (item.key === 'slack_webhook_url') current.slack.webhook_url = item.value;
                if (item.key === 'zapier_enabled') current.zapier.enabled = item.value === 'true';
                if (item.key === 'zapier_api_key') current.zapier.api_key = item.value;
                if (item.key === 'sms_enabled') current.sms.enabled = item.value === 'true';
                if (item.key === 'sms_provider') current.sms.provider = item.value;
                if (item.key === 'sms_account_sid') current.sms.account_sid = item.value;
                if (item.key === 'sms_auth_token') current.sms.auth_token = item.value;
                if (item.key === 'sms_from_number') current.sms.from_number = item.value;
                if (item.key === 'whatsapp_enabled') current.whatsapp.enabled = item.value === 'true';
                if (item.key === 'whatsapp_phone_number_id') current.whatsapp.phone_number_id = item.value;
                if (item.key === 'whatsapp_access_token') current.whatsapp.access_token = item.value;
                if (item.key === 'whatsapp_webhook_verify_token') current.whatsapp.webhook_verify_token = item.value;
                if (item.key === 'mass_mailing_enabled') current.mass_mailing.enabled = item.value === 'true';
                if (item.key === 'mass_mailing_provider') current.mass_mailing.provider = item.value;
                if (item.key === 'mass_mailing_api_key') current.mass_mailing.api_key = item.value;
                if (item.key === 'mass_mailing_sender_name') current.mass_mailing.sender_name = item.value;
                if (item.key === 'mass_mailing_sender_email') current.mass_mailing.sender_email = item.value;
            });

            if (aiDataList.length > 0) {
                const aiRow = aiDataList[0];
                setAiSettingsId(aiRow.id);
                current.ai_engine.enabled = aiRow.is_active;
                current.ai_engine.provider = aiRow.preferred_provider;
                current.ai_engine.api_key = '';
            }
            
            setIntegrations(current);
        } catch (error) {
            toast.error('Failed to load integration settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                google_analytics_enabled: integrations.google_analytics.enabled ? 'true' : 'false',
                google_analytics_tracking_id: integrations.google_analytics.tracking_id,
                slack_enabled: integrations.slack.enabled ? 'true' : 'false',
                slack_webhook_url: integrations.slack.webhook_url,
                zapier_enabled: integrations.zapier.enabled ? 'true' : 'false',
                zapier_api_key: integrations.zapier.api_key,
                sms_enabled: integrations.sms.enabled ? 'true' : 'false',
                sms_provider: integrations.sms.provider,
                sms_account_sid: integrations.sms.account_sid,
                sms_auth_token: integrations.sms.auth_token,
                sms_from_number: integrations.sms.from_number,
                whatsapp_enabled: integrations.whatsapp.enabled ? 'true' : 'false',
                whatsapp_phone_number_id: integrations.whatsapp.phone_number_id,
                whatsapp_access_token: integrations.whatsapp.access_token,
                whatsapp_webhook_verify_token: integrations.whatsapp.webhook_verify_token,
                mass_mailing_enabled: integrations.mass_mailing.enabled ? 'true' : 'false',
                mass_mailing_provider: integrations.mass_mailing.provider,
                mass_mailing_api_key: integrations.mass_mailing.api_key,
                mass_mailing_sender_name: integrations.mass_mailing.sender_name,
                mass_mailing_sender_email: integrations.mass_mailing.sender_email
            };
            
            await settingsService.batchUpdateSettings(payload);

            const aiPayload = {
                is_active: integrations.ai_engine.enabled,
                preferred_provider: integrations.ai_engine.provider,
            };
            if (integrations.ai_engine.api_key) {
                if (integrations.ai_engine.provider === 'openai') {
                    aiPayload.openai_api_key = integrations.ai_engine.api_key;
                } else {
                    aiPayload.anthropic_api_key = integrations.ai_engine.api_key;
                }
            }
            
            if (aiSettingsId) {
                await aiAgentService.saveAISettings(aiSettingsId, aiPayload);
            } else {
                const newRes = await aiAgentService.createAISettings(aiPayload);
                setAiSettingsId(newRes.data?.id);
            }

            toast.success('Integration settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-purple-500 w-8 h-8" /></div>;

    return (
        <div className="p-6 max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Integrations & Webhooks</h1>
                <p className="text-slate-400">Connect third-party services and configure external APIs</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <BarChart className="text-blue-500 w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Google Analytics 4</h3>
                                <p className="text-sm text-slate-400">Track portal and storefront visitors</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={integrations.google_analytics.enabled} onChange={e => setIntegrations(p => ({...p, google_analytics: {...p.google_analytics, enabled: e.target.checked}}))} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                    </div>
                    {integrations.google_analytics.enabled && (
                        <div className="space-y-4 pt-4 border-t border-slate-800">
                            <div>
                                <label className="text-sm font-medium text-slate-400">Measurement ID</label>
                                <input value={integrations.google_analytics.tracking_id} onChange={e => setIntegrations(p => ({...p, google_analytics: {...p.google_analytics, tracking_id: e.target.value}}))} placeholder="G-XXXXXXXXXX" className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#4A154B]/20 rounded-lg flex items-center justify-center">
                                <MessageSquare className="text-[#E01E5A] w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Slack Notifications</h3>
                                <p className="text-sm text-slate-400">Send system alerts to a Slack channel</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={integrations.slack.enabled} onChange={e => setIntegrations(p => ({...p, slack: {...p.slack, enabled: e.target.checked}}))} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A154B]"></div>
                        </label>
                    </div>
                    {integrations.slack.enabled && (
                        <div className="space-y-4 pt-4 border-t border-slate-800">
                            <div>
                                <label className="text-sm font-medium text-slate-400">Webhook URL</label>
                                <input type="password" value={integrations.slack.webhook_url} onChange={e => setIntegrations(p => ({...p, slack: {...p.slack, webhook_url: e.target.value}}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                <Webhook className="text-orange-500 w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Zapier</h3>
                                <p className="text-sm text-slate-400">Enable Zapier webhooks and triggers</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={integrations.zapier.enabled} onChange={e => setIntegrations(p => ({...p, zapier: {...p.zapier, enabled: e.target.checked}}))} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                    {integrations.zapier.enabled && (
                        <div className="space-y-4 pt-4 border-t border-slate-800">
                            <div>
                                <label className="text-sm font-medium text-slate-400">API Key (Generated automatically)</label>
                                <input readOnly type="password" value={integrations.zapier.api_key} className="mt-1 flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-500 cursor-not-allowed" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                                <Smartphone className="text-indigo-500 w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">SMS & Voice</h3>
                                <p className="text-sm text-slate-400">Configure Twilio for outbound SMS</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={integrations.sms.enabled} onChange={e => setIntegrations(p => ({...p, sms: {...p.sms, enabled: e.target.checked}}))} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                    </div>
                    {integrations.sms.enabled && (
                        <div className="space-y-4 pt-4 border-t border-slate-800">
                            <div>
                                <label className="text-sm font-medium text-slate-400">Provider</label>
                                <select value={integrations.sms.provider} onChange={e => setIntegrations(p => ({...p, sms: {...p.sms, provider: e.target.value}}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                                    <option value="twilio">Twilio</option>
                                    <option value="messagebird">MessageBird</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">Account SID</label>
                                <input type="password" value={integrations.sms.account_sid} onChange={e => setIntegrations(p => ({...p, sms: {...p.sms, account_sid: e.target.value}}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">Auth Token</label>
                                <input type="password" value={integrations.sms.auth_token} onChange={e => setIntegrations(p => ({...p, sms: {...p.sms, auth_token: e.target.value}}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">From Number</label>
                                <input value={integrations.sms.from_number} onChange={e => setIntegrations(p => ({...p, sms: {...p.sms, from_number: e.target.value}}))} placeholder="+1234567890" className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#25D366]/20 rounded-lg flex items-center justify-center">
                                <MessageCircle className="text-[#25D366] w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">WhatsApp Cloud API</h3>
                                <p className="text-sm text-slate-400">Connect official WhatsApp Business API</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={integrations.whatsapp.enabled} onChange={e => setIntegrations(p => ({...p, whatsapp: {...p.whatsapp, enabled: e.target.checked}}))} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]"></div>
                        </label>
                    </div>
                    {integrations.whatsapp.enabled && (
                        <div className="space-y-4 pt-4 border-t border-slate-800">
                            <div>
                                <label className="text-sm font-medium text-slate-400">Phone Number ID</label>
                                <input value={integrations.whatsapp.phone_number_id} onChange={e => setIntegrations(p => ({...p, whatsapp: {...p.whatsapp, phone_number_id: e.target.value}}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">Access Token</label>
                                <input type="password" value={integrations.whatsapp.access_token} onChange={e => setIntegrations(p => ({...p, whatsapp: {...p.whatsapp, access_token: e.target.value}}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">Webhook Verify Token</label>
                                <input value={integrations.whatsapp.webhook_verify_token} onChange={e => setIntegrations(p => ({...p, whatsapp: {...p.whatsapp, webhook_verify_token: e.target.value}}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <Cpu className="text-purple-500 w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">AI Engine</h3>
                                <p className="text-sm text-slate-400">Configure LLM provider</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={integrations.ai_engine.enabled} onChange={e => setIntegrations(p => ({...p, ai_engine: {...p.ai_engine, enabled: e.target.checked}}))} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                        </label>
                    </div>
                    {integrations.ai_engine.enabled && (
                        <div className="space-y-4 pt-4 border-t border-slate-800">
                            <div>
                                <label className="text-sm font-medium text-slate-400">Provider</label>
                                <select value={integrations.ai_engine.provider} onChange={e => setIntegrations(p => ({...p, ai_engine: {...p.ai_engine, provider: e.target.value}}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                                    <option value="openai">OpenAI</option>
                                    <option value="anthropic">Anthropic</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">API Key (Leave empty to keep existing)</label>
                                <input type="password" placeholder="sk-..." value={integrations.ai_engine.api_key} onChange={e => setIntegrations(p => ({...p, ai_engine: {...p.ai_engine, api_key: e.target.value}}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Email Marketing */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                <MailIcon className="text-yellow-500 w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Email Campaigns</h3>
                                <p className="text-sm text-slate-400">Configure SMTP or Mailchimp for mass mailings</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={integrations.mass_mailing.enabled} onChange={e => setIntegrations(p => ({...p, mass_mailing: {...p.mass_mailing, enabled: e.target.checked}}))} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                        </label>
                    </div>
                    {integrations.mass_mailing.enabled && (
                        <div className="space-y-4 pt-4 border-t border-slate-800">
                            <div>
                                <label className="text-sm font-medium text-slate-400">API Key</label>
                                <input type="password" value={integrations.mass_mailing.api_key} onChange={e => setIntegrations(p => ({...p, mass_mailing: {...p.mass_mailing, api_key: e.target.value}}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">Sender Name</label>
                                <input value={integrations.mass_mailing.sender_name} onChange={e => setIntegrations(p => ({...p, mass_mailing: {...p.mass_mailing, sender_name: e.target.value}}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">Sender Email</label>
                                <input value={integrations.mass_mailing.sender_email} onChange={e => setIntegrations(p => ({...p, mass_mailing: {...p.mass_mailing, sender_email: e.target.value}}))} className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end pb-8">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Settings
                </button>
            </div>
        </div>
    );
}
