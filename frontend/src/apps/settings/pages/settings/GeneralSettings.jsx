import React, { useState, useEffect, useRef } from 'react';
import {
    Settings, Building2, Globe, Save, Loader2, Upload, Shield,
    Clock, Database, Mail, Key, RefreshCw, Trash2
} from 'lucide-react';
import client from '../../../../core/api/client';
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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [companyForm, setCompanyForm] = useState({});
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const logoRef = useRef();

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [companyRes, settingsRes] = await Promise.all([
                settingsService.getMyCompany(),
                settingsService.getSettings()
            ]);
            const c = companyRes.data?.data || companyRes.data || {};
            const s = settingsRes.data?.results || settingsRes.data?.data || settingsRes.data || [];
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
            });
            setLogoPreview(c.logo || null);
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

    const handleSaveGeneral = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            Object.entries(companyForm).forEach(([k, v]) => { if (v !== undefined) formData.append(k, v); });
            if (logoFile) formData.append('logo', logoFile);
            await settingsService.updateMyCompany(formData);
            toast.success('Company settings saved');
            setLogoFile(null);
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
                                className="w-24 h-24 rounded-xl bg-slate-800 border-2 border-dashed border-slate-700 hover:border-purple-500 flex items-center justify-center cursor-pointer transition-colors overflow-hidden"
                            >
                                {logoPreview
                                    ? <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
                                    : <Upload className="w-6 h-6 text-slate-500" />
                                }
                            </div>
                            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                            <p className="text-xs text-slate-500 text-center mt-1">Click to upload</p>
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
                                <option value="UTC">UTC</option>
                                <option value="America/New_York">America/New_York</option>
                                <option value="America/Los_Angeles">America/Los_Angeles</option>
                                <option value="Europe/London">Europe/London</option>
                                <option value="Europe/Paris">Europe/Paris</option>
                                <option value="Asia/Dubai">Asia/Dubai</option>
                                <option value="Asia/Tokyo">Asia/Tokyo</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Default Language</label>
                            <select
                                value={companyForm.language || 'en'}
                                onChange={e => setCompanyForm(p => ({...p, language: e.target.value}))}
                                className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="en">English</option>
                                <option value="fr">French</option>
                                <option value="ar">Arabic</option>
                                <option value="es">Spanish</option>
                                <option value="de">German</option>
                            </select>
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
                        <div className="grid grid-cols-2 gap-4">
                            <a href="/admin/settings/logs" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">API Keys</p>
                                <p className="text-sm text-slate-500 mt-1">Manage API credentials for external integrations</p>
                            </a>
                            <a href="/admin/settings/general?tab=webhooks" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">Webhooks</p>
                                <p className="text-sm text-slate-500 mt-1">Configure outbound event notifications</p>
                            </a>
                            <a href="/admin/settings/email-servers-outgoing" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">Outgoing Mail (SMTP)</p>
                                <p className="text-sm text-slate-500 mt-1">Configure SMTP servers for sending email</p>
                            </a>
                            <a href="/admin/settings/email-servers-incoming" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">Incoming Mail (IMAP)</p>
                                <p className="text-sm text-slate-500 mt-1">Fetch emails from IMAP/POP3 servers</p>
                            </a>
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
                            <a href="/admin/settings/security-policy" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">Security Policy</p>
                                <p className="text-sm text-slate-500 mt-1">Password rules, MFA, session timeouts</p>
                            </a>
                            <a href="/admin/settings/access-rights" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">Access Rights</p>
                                <p className="text-sm text-slate-500 mt-1">Role-based model-level permissions</p>
                            </a>
                            <a href="/admin/settings/record-rules" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">Record Rules</p>
                                <p className="text-sm text-slate-500 mt-1">Row-level security filters per role</p>
                            </a>
                            <a href="/admin/settings/groups" className="block p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-colors">
                                <p className="font-medium text-slate-200">User Groups</p>
                                <p className="text-sm text-slate-500 mt-1">Manage user roles and group membership</p>
                            </a>
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
        </div>
    );
}
