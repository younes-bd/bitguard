import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Settings, Building2, Globe, Save, Loader2, Upload, Shield,
    Clock, Database, Mail, Key, RefreshCw, Trash2, Terminal
} from 'lucide-react';
import client from '@/core/api/client';
import { settingsService } from '../../api/settingsService';
import toast from 'react-hot-toast';

const TABS = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'integrations', label: 'Integrations', icon: Key },
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'retention', label: 'Retention', icon: Database },
];

export default function GeneralSettings() {
    const [activeTab, setActiveTab] = useState('general');
    const [company, setCompany] = useState(null);
    const [settings, setSettings] = useState([]);
    const [configOptions, setConfigOptions] = useState(null);
    const [integrations, setIntegrations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Developer Mode
    const [isDevMode, setIsDevMode] = useState(localStorage.getItem('bitguard_dev_mode') === 'true');
    const toggleDevMode = () => {
        const newMode = !isDevMode;
        setIsDevMode(newMode);
        localStorage.setItem('bitguard_dev_mode', newMode ? 'true' : 'false');
        
        // Add or remove ?debug=1 from the URL
        const url = new URL(window.location.href);
        if (newMode) {
            url.searchParams.set('debug', '1');
        } else {
            url.searchParams.delete('debug');
        }
        window.history.replaceState({}, '', url);
        window.location.assign(window.location.pathname);
    };
    const [companyForm, setCompanyForm] = useState({});
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const logoRef = useRef();
    const [faviconFile, setFaviconFile] = useState(null);
    const [faviconPreview, setFaviconPreview] = useState(null);
    const faviconRef = useRef();

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [companyRes, settingsRes, configRes, intRes] = await Promise.all([
                settingsService.getMyCompany(),
                settingsService.getSettings(),
                client.get('core/config-options/').catch(() => ({ data: null })),
                client.get('core/integrations-status/').catch(() => ({ data: null }))
            ]);
            const c = companyRes.data?.data || companyRes.data || {};
            const s = settingsRes.data?.results || settingsRes.data?.data || settingsRes.data || [];
            setConfigOptions(configRes.data);
            setIntegrations(intRes.data?.integrations);
            setCompany(c);
            setCompanyForm({
                name: c.name || '',
                phone: c.phone || '',
                email: c.email || '',
                website: c.website || '',
                street: c.street || '',
                city: c.city || '',
                country: c.country || '',
                timezone: c.timezone || 'UTC',
                language: c.language || 'en',
                currency: c.currency || 'USD',
                multi_company: c.multi_company || false,
                twitter: c.twitter || '',
                linkedin: c.linkedin || '',
                paper_format: c.paper_format || 'A4',
                font: c.font || 'Inter',
                header_text: c.header_text || '',
                footer_text: c.footer_text || '',
            });
            setLogoPreview(c.logo || null);
            setFaviconPreview(c.favicon || null);
            setSettings(Array.isArray(s) ? s : []);
        } catch (err) {
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleFaviconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFaviconFile(file);
            setFaviconPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveGeneral = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            Object.entries(companyForm).forEach(([k, v]) => { if (v !== undefined) formData.append(k, v); });
            if (logoFile) formData.append('logo', logoFile);
            if (faviconFile) formData.append('favicon', faviconFile);
            await client.patch('tenants/my-company/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Company settings saved');
            setLogoFile(null);
            setFaviconFile(null);
        } catch (err) {
            toast.error('Failed to save company settings');
        } finally {
            setSaving(false);
        }
    };

    const getSettingByKey = (key) => settings.find(s => s.key === key);

    const handleToggleSetting = async (key, currentValue) => {
        const newVal = currentValue === 'true' ? 'false' : 'true';
        try {
            await settingsService.batchUpdateSettings({ [key]: newVal });
            setSettings(prev => prev.map(s => s.key === key ? { ...s, value: newVal } : s));
            toast.success('Setting updated');
        } catch {
            toast.error('Failed to update setting');
        }
    };

    const handleRetentionAction = async (action) => {
        setSaving(true);
        try {
            if (action === 'backup') {
                await settingsService.triggerBackup();
                toast.success('Backup triggered successfully');
            } else if (action === 'prune') {
                await settingsService.pruneAuditLogs(90);
                toast.success('Audit logs older than 90 days pruned');
            } else if (action === 'cache') {
                await settingsService.clearCache();
                toast.success('Cache cleared successfully');
            }
        } catch {
            toast.error('Action failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-purple-500 w-8 h-8" />
        </div>
    );

    return (
        <div className="p-6 max-w-5xl space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
                        <Settings className="text-purple-500" />
                        General Settings
                    </h1>
                    <p className="text-slate-400">Configure your company information and platform preferences</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                            activeTab === tab.id
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* General Tab */}
            {activeTab === 'general' && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                    {/* Logo */}
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                            <div
                                onClick={() => logoRef.current?.click()}
                                className="w-24 h-24 rounded-xl bg-slate-800 border-2 border-dashed border-slate-700 hover:border-purple-500 flex items-center justify-center cursor-pointer transition-colors overflow-hidden relative group"
                            >
                                {logoPreview
                                    ? <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
                                    : <Upload className="w-6 h-6 text-slate-500" />
                                }
                                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                                    <span className="text-xs font-medium text-white">Logo</span>
                                </div>
                            </div>
                            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                            <p className="text-xs text-slate-500 text-center mt-1">Company Logo</p>
                        </div>
                        <div className="flex-shrink-0">
                            <div
                                onClick={() => faviconRef.current?.click()}
                                className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-dashed border-slate-700 hover:border-purple-500 flex items-center justify-center cursor-pointer transition-colors overflow-hidden relative group mt-4"
                            >
                                {faviconPreview
                                    ? <img src={faviconPreview} alt="Favicon" className="w-full h-full object-cover" />
                                    : <Upload className="w-5 h-5 text-slate-500" />
                                }
                                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                                    <span className="text-xs font-medium text-white">Favicon</span>
                                </div>
                            </div>
                            <input ref={faviconRef} type="file" accept="image/*" className="hidden" onChange={handleFaviconChange} />
                            <p className="text-xs text-slate-500 text-center mt-1">Favicon</p>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-sm font-medium text-slate-400">Company Name</label>
                                <input
                                    value={companyForm.name || ''}
                                    onChange={e => setCompanyForm(p => ({...p, name: e.target.value}))}
                                    className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Your Company Name"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">Phone</label>
                                <input
                                    value={companyForm.phone || ''}
                                    onChange={e => setCompanyForm(p => ({...p, phone: e.target.value}))}
                                    className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">Email</label>
                                <input
                                    value={companyForm.email || ''}
                                    onChange={e => setCompanyForm(p => ({...p, email: e.target.value}))}
                                    className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="info@company.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-400">Website</label>
                            <input
                                value={companyForm.website || ''}
                                onChange={e => setCompanyForm(p => ({...p, website: e.target.value}))}
                                className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="https://www.company.com"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Street Address</label>
                            <input
                                value={companyForm.street || ''}
                                onChange={e => setCompanyForm(p => ({...p, street: e.target.value}))}
                                className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="123 Main St"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">City</label>
                            <input
                                value={companyForm.city || ''}
                                onChange={e => setCompanyForm(p => ({...p, city: e.target.value}))}
                                className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="New York"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Country</label>
                            <input
                                value={companyForm.country || ''}
                                onChange={e => setCompanyForm(p => ({...p, country: e.target.value}))}
                                className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="United States"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Timezone</label>
                            <select
                                value={companyForm.timezone || 'UTC'}
                                onChange={e => setCompanyForm(p => ({...p, timezone: e.target.value}))}
                                className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                {configOptions?.timezones ? configOptions.timezones.map(tz => (
                                    <option key={tz} value={tz}>{tz}</option>
                                )) : (
                                    <>
                                        <option value="UTC">UTC</option>
                                        <option value="America/New_York">America/New_York</option>
                                    </>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Default Language</label>
                            <select
                                value={companyForm.language || 'en'}
                                onChange={e => setCompanyForm(p => ({...p, language: e.target.value}))}
                                className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                {configOptions?.languages ? configOptions.languages.map(lang => (
                                    <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                                )) : (
                                    <>
                                        <option value="en">English</option>
                                        <option value="fr">French</option>
                                    </>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Currency</label>
                            <select
                                value={companyForm.currency || 'USD'}
                                onChange={e => setCompanyForm(p => ({...p, currency: e.target.value}))}
                                className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                {configOptions?.currencies ? configOptions.currencies.map(curr => (
                                    <option key={curr} value={curr}>{curr}</option>
                                )) : (
                                    <>
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="EUR">EUR - Euro</option>
                                    </>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Multi-Company Mode</label>
                            <div className="mt-1 flex h-10 items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={companyForm.multi_company || false} onChange={e => setCompanyForm(p => ({...p, multi_company: e.target.checked}))} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                    <span className="ml-3 text-sm font-medium text-slate-300">Enable</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Twitter (X)</label>
                            <input
                                value={companyForm.twitter || ''}
                                onChange={e => setCompanyForm(p => ({...p, twitter: e.target.value}))}
                                className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="@yourcompany"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">LinkedIn</label>
                            <input
                                value={companyForm.linkedin || ''}
                                onChange={e => setCompanyForm(p => ({...p, linkedin: e.target.value}))}
                                className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="linkedin.com/company/..."
                            />
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mt-8 mb-4 border-b border-slate-800 pb-2">Document Layout</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-400">Paper Format</label>
                            <select
                                value={companyForm.paper_format || 'A4'}
                                onChange={e => setCompanyForm(p => ({...p, paper_format: e.target.value}))}
                                className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="A4">A4 (210 x 297 mm)</option>
                                <option value="Letter">US Letter (8.5 x 11 in)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Document Font</label>
                            <select
                                value={companyForm.font || 'Inter'}
                                onChange={e => setCompanyForm(p => ({...p, font: e.target.value}))}
                                className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="Inter">Inter (Sans Serif)</option>
                                <option value="Roboto">Roboto (Sans Serif)</option>
                                <option value="Merriweather">Merriweather (Serif)</option>
                                <option value="Courier New">Courier New (Monospace)</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="text-sm font-medium text-slate-400">Header Text</label>
                            <textarea
                                value={companyForm.header_text || ''}
                                onChange={e => setCompanyForm(p => ({...p, header_text: e.target.value}))}
                                className="mt-1 flex w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[60px]"
                                placeholder="Displayed at the top of generated documents"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-sm font-medium text-slate-400">Footer Text</label>
                            <textarea
                                value={companyForm.footer_text || ''}
                                onChange={e => setCompanyForm(p => ({...p, footer_text: e.target.value}))}
                                className="mt-1 flex w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[60px]"
                                placeholder="Displayed at the bottom of generated documents (e.g., Bank details, Registration number)"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleSaveGeneral}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
                <div className="space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                            <Key className="w-4 h-4 text-purple-400" /> API & Webhooks
                        </h3>
                        {integrations && (
                            <div className="mb-6 bg-slate-800/40 border border-slate-700 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-slate-300 mb-3">Third-Party Integrations</h4>
                                <div className="space-y-3">
                                    {Object.entries(integrations).map(([key, data]) => (
                                        <div key={key} className="flex items-center justify-between">
                                            <span className="text-sm text-slate-400 capitalize">{key}</span>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${data.connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                                {data.connected ? 'Connected' : 'Disconnected'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/admin/settings/api-keys" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">API Keys</p>
                                <p className="text-sm text-slate-500 mt-1">Manage API credentials for external integrations</p>
                            </Link>
                            <Link to="/admin/settings/webhooks" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">Webhooks</p>
                                <p className="text-sm text-slate-500 mt-1">Configure outbound event notifications</p>
                            </Link>
                            <Link to="/admin/settings/payment" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">Payment Providers</p>
                                <p className="text-sm text-slate-500 mt-1">Configure Stripe, PayPal, and payment gateways</p>
                            </Link>
                            <Link to="/admin/settings/notifications" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">Notifications</p>
                                <p className="text-sm text-slate-500 mt-1">Configure SMS and push notifications</p>
                            </Link>
                            <Link to="/admin/settings/outgoing-mail-servers" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">Outgoing Mail (SMTP)</p>
                                <p className="text-sm text-slate-500 mt-1">Configure SMTP servers for sending email</p>
                            </Link>
                            <Link to="/admin/settings/incoming-mail-servers" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">Incoming Mail (IMAP)</p>
                                <p className="text-sm text-slate-500 mt-1">Fetch emails from IMAP/POP3 servers</p>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Permissions Tab */}
            {activeTab === 'permissions' && (
                <div className="space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                            <Shield className="w-4 h-4 text-purple-400" /> Access & Security Configuration
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/admin/settings/security-policy" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">Security Policy</p>
                                <p className="text-sm text-slate-500 mt-1">Password rules, MFA, session timeouts</p>
                            </Link>
                            <Link to="/admin/settings/access-rights" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">Access Rights</p>
                                <p className="text-sm text-slate-500 mt-1">Role-based model-level permissions</p>
                            </Link>
                            <Link to="/admin/settings/record-rules" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">Record Rules</p>
                                <p className="text-sm text-slate-500 mt-1">Row-level security filters per role</p>
                            </Link>
                            <Link to="/admin/settings/groups" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">User Groups</p>
                                <p className="text-sm text-slate-500 mt-1">Manage user roles and group membership</p>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Retention Tab */}
            {activeTab === 'retention' && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                        <Database className="w-4 h-4 text-purple-400" /> Data Retention & Maintenance
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-slate-700 bg-slate-800/40">
                            <div>
                                <p className="font-medium text-slate-200">Trigger Backup</p>
                                <p className="text-sm text-slate-500">Create an on-demand database backup snapshot</p>
                            </div>
                            <button
                                onClick={() => handleRetentionAction('backup')}
                                disabled={saving}
                                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Run Backup'}
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-slate-700 bg-slate-800/40">
                            <div>
                                <p className="font-medium text-slate-200">Prune Audit Logs</p>
                                <p className="text-sm text-slate-500">Delete audit log entries older than 90 days</p>
                            </div>
                            <button
                                onClick={() => handleRetentionAction('prune')}
                                disabled={saving}
                                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                Prune Logs
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-rose-950/50 bg-slate-800/40">
                            <div>
                                <p className="font-medium text-slate-200">Clear System Cache</p>
                                <p className="text-sm text-slate-500">Flush all application-level cached data</p>
                            </div>
                            <button
                                onClick={() => handleRetentionAction('cache')}
                                disabled={saving}
                                className="px-4 py-2 rounded-lg border border-rose-800 text-rose-400 hover:bg-rose-900/30 text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                Clear Cache
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Developer Mode Section */}
            <div className="mt-8 border-t border-slate-800 pt-8 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-emerald-400" />
                        Developer Tools
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Enable technical features, view IDs, and access advanced system settings.</p>
                </div>
                <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                className="sr-only" 
                                checked={isDevMode}
                                onChange={toggleDevMode}
                            />
                            <div className={`w-11 h-6 rounded-full transition-colors ${isDevMode ? 'bg-emerald-500' : 'bg-slate-700 group-hover:bg-slate-600'}`}></div>
                            <div className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform ${isDevMode ? 'translate-x-full' : ''}`}></div>
                        </div>
                        <span className="text-sm font-medium text-slate-300 select-none group-hover:text-white transition-colors">
                            Activate Developer Mode
                        </span>
                    </label>
                </div>
            </div>
            
        </div>
    );
}
