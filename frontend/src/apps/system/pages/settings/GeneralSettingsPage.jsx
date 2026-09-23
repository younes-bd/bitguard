import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Building2, Save, Loader2, Upload, Shield,
    Database, Terminal, X, Key
} from 'lucide-react';
import { coreService } from '../../../core/api/coreService';
import { settingsService } from '../../api/settingsService';
import toast from 'react-hot-toast';

export default function GeneralSettingsPage() {
    const [company, setCompany] = useState(null);
    const [settings, setSettings] = useState([]);
    const [configOptions, setConfigOptions] = useState(null);
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
        toast.success(newMode ? 'Developer Mode activated' : 'Developer Mode deactivated');
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
            const [companyRes, settingsRes, configRes] = await Promise.all([
                settingsService.getMyCompany().catch(e => { console.error('Company load error:', e); return { data: {} }; }),
                settingsService.getSettings().catch(e => { console.error('Settings load error:', e); return { data: [] }; }),
                coreService.getConfigOptions().catch(e => { console.error('Config load error:', e); return { data: null }; })
            ]);
            const c = companyRes.data?.data || companyRes.data || {};
            const s = settingsRes.data?.results || settingsRes.data?.data || settingsRes.data || [];
            setConfigOptions(configRes.data);
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
            console.error(err);
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
            await settingsService.updateMyCompany(formData);
            toast.success('Company settings saved');
            setLogoFile(null);
            setFaviconFile(null);
            // Refresh form state to match server
            await loadAll();
        } catch (err) {
            toast.error('Failed to save company settings');
            setSaving(false);
        }
    };

    const handleDiscard = () => {
        setLogoFile(null);
        setFaviconFile(null);
        loadAll(); // Revert back to original server state
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

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="animate-spin text-purple-500 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Odoo Standard: Sticky Top Header with Actions */}
            <div className="sticky top-0 z-20 flex items-center gap-3 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800 p-4 mb-6">
                <button
                    onClick={handleSaveGeneral}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                </button>
                <button
                    onClick={handleDiscard}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-slate-300 bg-transparent hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                >
                    <X className="w-4 h-4" />
                    Discard
                </button>
            </div>

            {/* Continuous Scrolling Body */}
            <div className="px-6 max-w-7xl mx-auto space-y-12 pb-24">
                
                {/* Section: Company Information */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Company</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Block: Profile Info */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row gap-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex-shrink-0">
                                    <div 
                                        onClick={() => logoRef.current?.click()}
                                        className="w-24 h-24 rounded-xl bg-slate-800 border-2 border-dashed border-slate-700 hover:border-blue-500 flex items-center justify-center cursor-pointer transition-colors overflow-hidden relative group"
                                    >
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload className="w-6 h-6 text-slate-500" />
                                        )}
                                        <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                                            <span className="text-xs font-medium text-white">Logo</span>
                                        </div>
                                    </div>
                                    <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                                </div>
                                <div className="flex-shrink-0">
                                    <div 
                                        onClick={() => faviconRef.current?.click()}
                                        className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-dashed border-slate-700 hover:border-blue-500 flex items-center justify-center cursor-pointer transition-colors overflow-hidden relative group"
                                    >
                                        {faviconPreview ? (
                                            <img src={faviconPreview} alt="Favicon" className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload className="w-5 h-5 text-slate-500" />
                                        )}
                                        <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                                            <span className="text-xs font-medium text-white">Favicon</span>
                                        </div>
                                    </div>
                                    <input ref={faviconRef} type="file" accept="image/*" className="hidden" onChange={handleFaviconChange} />
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Company Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                        value={companyForm.name}
                                        onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                            value={companyForm.phone}
                                            onChange={e => setCompanyForm({ ...companyForm, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                                        <input
                                            type="email"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                            value={companyForm.email}
                                            onChange={e => setCompanyForm({ ...companyForm, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Website</label>
                                    <input
                                        type="url"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                        value={companyForm.website}
                                        onChange={e => setCompanyForm({ ...companyForm, website: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Block: Address */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Street</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                    value={companyForm.street}
                                    onChange={e => setCompanyForm({ ...companyForm, street: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">City</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                        value={companyForm.city}
                                        onChange={e => setCompanyForm({ ...companyForm, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Country</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                        value={companyForm.country}
                                        onChange={e => setCompanyForm({ ...companyForm, country: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Timezone</label>
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                        value={companyForm.timezone}
                                        onChange={e => setCompanyForm({ ...companyForm, timezone: e.target.value })}
                                    >
                                        <option value="UTC">UTC</option>
                                        <option value="America/New_York">America/New_York</option>
                                        <option value="Europe/Paris">Europe/Paris</option>
                                        <option value="Asia/Tokyo">Asia/Tokyo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Currency</label>
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                        value={companyForm.currency}
                                        onChange={e => setCompanyForm({ ...companyForm, currency: e.target.value })}
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="JPY">JPY (¥)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Block: Document Layout */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                            <h3 className="font-semibold text-white">Document Layout</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Paper Format</label>
                                <select
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                    value={companyForm.paper_format}
                                    onChange={e => setCompanyForm({ ...companyForm, paper_format: e.target.value })}
                                >
                                    <option value="A4">A4</option>
                                    <option value="Letter">US Letter</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Company Footer Text</label>
                                <textarea
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                    rows="2"
                                    value={companyForm.footer_text}
                                    onChange={e => setCompanyForm({ ...companyForm, footer_text: e.target.value })}
                                    placeholder="Displayed at the bottom of generated documents"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Access & Security */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Access & Security</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Link to="/admin/settings/security-policy" className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900 hover:border-blue-500 transition-colors">
                            <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                                <p className="font-semibold text-slate-200">Security Policy</p>
                                <p className="text-sm text-slate-500">Configure password rules, MFA, and session timeouts</p>
                            </div>
                        </Link>
                        <Link to="/admin/settings/access-rights" className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900 hover:border-blue-500 transition-colors">
                            <Key className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                                <p className="font-semibold text-slate-200">Access Rights</p>
                                <p className="text-sm text-slate-500">Manage role-based model-level permissions</p>
                            </div>
                        </Link>
                        <Link to="/admin/settings/record-rules" className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900 hover:border-blue-500 transition-colors">
                            <Database className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                                <p className="font-semibold text-slate-200">Record Rules</p>
                                <p className="text-sm text-slate-500">Enforce row-level security filters per role</p>
                            </div>
                        </Link>
                        <Link to="/admin/settings/groups" className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900 hover:border-blue-500 transition-colors">
                            <Building2 className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                                <p className="font-semibold text-slate-200">User Groups</p>
                                <p className="text-sm text-slate-500">Organize user roles and group membership</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Section: Data Retention */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Data Retention & Maintenance</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900">
                            <div>
                                <p className="font-semibold text-slate-200">Trigger Backup</p>
                                <p className="text-sm text-slate-500">Create an on-demand database backup snapshot</p>
                            </div>
                            <button
                                onClick={() => handleRetentionAction('backup')}
                                disabled={saving}
                                className="whitespace-nowrap px-4 py-2 rounded-lg bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 hover:bg-emerald-600/20 text-sm font-medium transition-colors"
                            >
                                Run Backup
                            </button>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900">
                            <div>
                                <p className="font-semibold text-slate-200">Prune Audit Logs</p>
                                <p className="text-sm text-slate-500">Delete audit log entries older than 90 days</p>
                            </div>
                            <button
                                onClick={() => handleRetentionAction('prune')}
                                disabled={saving}
                                className="whitespace-nowrap px-4 py-2 rounded-lg bg-amber-600/10 text-amber-500 border border-amber-600/20 hover:bg-amber-600/20 text-sm font-medium transition-colors"
                            >
                                Prune Logs
                            </button>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-rose-900/50 bg-slate-900">
                            <div>
                                <p className="font-semibold text-slate-200">Clear System Cache</p>
                                <p className="text-sm text-slate-500">Flush all application-level cached data</p>
                            </div>
                            <button
                                onClick={() => handleRetentionAction('cache')}
                                disabled={saving}
                                className="whitespace-nowrap px-4 py-2 rounded-lg border border-rose-800/50 text-rose-400 hover:bg-rose-900/30 text-sm font-medium transition-colors"
                            >
                                Clear Cache
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section: Developer Tools */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Developer Tools</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900">
                            <div className="relative mt-0.5">
                                <input 
                                    type="checkbox" 
                                    className="sr-only" 
                                    checked={isDevMode}
                                    onChange={toggleDevMode}
                                />
                                <div className={`w-10 h-5 rounded-full transition-colors ${isDevMode ? 'bg-blue-600' : 'bg-slate-700'}`}></div>
                                <div className={`absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full transition-transform ${isDevMode ? 'translate-x-5' : ''}`}></div>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-200 cursor-pointer" onClick={toggleDevMode}>Activate Developer Mode</p>
                                <p className="text-sm text-slate-500">Enable technical features, view IDs, and access advanced system settings</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
