import React, { useState, useEffect, useRef } from 'react';
import { parameterService } from '../../../core/api/parameterService';
import { companyService } from '../../../core/api/companyService';
import { coreService } from '../../../core/api/coreService';
import { currencyService } from '../../../core/api/currencyService';
import { databaseBackupService } from '../../../core/api/databaseBackupService';
import { systemEventService } from '../../../core/api/systemEventService';
import { Link } from 'react-router-dom';
import {
    Building2, Save, Loader2, Upload, Shield,
    Database, Terminal, X, Key, Server, FileText, Globe
} from 'lucide-react';

import { settingsService } from '../../api/settingsService';
import toast from 'react-hot-toast';

export default function GeneralSettingsPage() {
    const [company, setCompany] = useState(null);
    const [configOptions, setConfigOptions] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [langLoading, setLangLoading] = useState(false);
    const [languages, setLanguages] = useState([]);
    
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

    const fetchStates = async (countryId) => {
        if (!countryId) {
            setStates([]);
            return;
        }
        try {
            const res = await coreService.getStates(countryId);
            setStates(res.data?.results || res.data || []);
        } catch (e) {
            // silent catch or toast
        }
    };

    const handleCountryChange = async (e) => {
        const newCountryId = e.target.value;
        setCompanyForm({ ...companyForm, country: newCountryId, state: '' });
        fetchStates(newCountryId);
    };

    const loadAll = async () => {
        setLoading(true);
        try {
            const [companyRes, configRes, currencyRes, countryRes] = await Promise.all([
                companyService.getMyCompany().catch(e => { return { data: {} }; }),
                coreService.getConfigOptions().catch(e => { return { data: null }; }),
                currencyService.getAll().catch(e => { return { data: { results: [] } }; }),
                coreService.getCountries().catch(e => { return { data: { results: [] } }; })
            ]);
            const c = companyRes.data?.data || companyRes.data || {};
            const curr = currencyRes.data?.results || currencyRes.data || [];
            const cntry = countryRes.data?.results || countryRes.data || [];
            
            setConfigOptions(configRes.data);
            setCurrencies(curr);
            setCountries(cntry);
            setCompany(c);
            setCompanyForm({
                name: c.name || '',
                phone: c.phone || '',
                email: c.email || '',
                website: c.website || '',
                timezone: c.timezone || 'UTC',
                language: c.language || 'en',
                default_currency: c.default_currency || '',
                vat: c.vat || '',
                multi_company: c.multi_company || false,
                twitter: c.twitter || '',
                linkedin: c.linkedin || '',
                paper_format: c.paper_format || 'A4',
                font: c.font || 'Inter',
                header_text: c.header_text || '',
                footer_text: c.footer_text || '',
                street: c.street || '',
                street2: c.street2 || '',
                city: c.city || '',
                state: c.state || '',
                zip_code: c.zip_code || '',
                country: c.country || '',
            });
            setLogoPreview(c.logo || null);
            setFaviconPreview(c.favicon || null);

            if (c.country) {
                fetchStates(c.country);
            }
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
            await companyService.updateMyCompany(formData);
            toast.success('Company settings saved');
            setLogoFile(null);
            setFaviconFile(null);
            // Refresh form state to match server
            await loadAll();
        } catch (err) {
            toast.error('Failed to save company settings');
        } finally {
            setSaving(false);
        }
    };

    const handleDiscard = () => {
        setLogoFile(null);
        setFaviconFile(null);
        loadAll(); // Revert back to original server state
    };

    const handleRetentionAction = async (action) => {
        setSaving(true);
        try {
            if (action === 'backup') {
                await databaseBackupService.triggerBackup();
                toast.success('Backup triggered successfully');
            } else if (action === 'prune') {
                await parameterService.pruneAuditLogs(90);
                toast.success('Audit logs older than 90 days pruned');
            } else if (action === 'cache') {
                await parameterService.clearCache();
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
                <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
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
                            <h3 className="font-semibold text-white">Address & Identity</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Street</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                    value={companyForm.street}
                                    onChange={e => setCompanyForm({ ...companyForm, street: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Street 2</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                    value={companyForm.street2}
                                    onChange={e => setCompanyForm({ ...companyForm, street2: e.target.value })}
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
                                    <label className="block text-sm font-medium text-slate-400 mb-1">State / Province</label>
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                        value={companyForm.state || ''}
                                        onChange={e => setCompanyForm({ ...companyForm, state: e.target.value })}
                                        disabled={!companyForm.country}
                                    >
                                        <option value="">Select State</option>
                                        {states.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">ZIP / Postal Code</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                        value={companyForm.zip_code}
                                        onChange={e => setCompanyForm({ ...companyForm, zip_code: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Country</label>
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                        value={companyForm.country || ''}
                                        onChange={handleCountryChange}
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">VAT / Tax ID</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                    value={companyForm.vat}
                                    onChange={e => setCompanyForm({ ...companyForm, vat: e.target.value })}
                                    placeholder="e.g. GB123456789"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Timezone</label>
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                        value={companyForm.timezone}
                                        onChange={e => setCompanyForm({ ...companyForm, timezone: e.target.value })}
                                    >
                                        {configOptions?.timezones?.map(tz => (
                                            <option key={tz} value={tz}>{tz}</option>
                                        )) || (
                                            <>
                                                <option value="UTC">UTC</option>
                                                <option value="America/New_York">America/New_York</option>
                                                <option value="Europe/Paris">Europe/Paris</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Default Currency</label>
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                        value={companyForm.default_currency}
                                        onChange={e => setCompanyForm({ ...companyForm, default_currency: e.target.value })}
                                    >
                                        <option value="">-- Select Currency --</option>
                                        {currencies.map(curr => (
                                            <option key={curr.id} value={curr.id}>
                                                {curr.name} ({curr.symbol})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Language</label>
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                        value={companyForm.language}
                                        onChange={e => setCompanyForm({ ...companyForm, language: e.target.value })}
                                        disabled={langLoading}
                                    >
                                        {langLoading ? <option>Loading...</option> : languages.map(l => (
                                            <option key={l.code} value={l.code}>{l.name}</option>
                                        ))}
                                        {languages.length === 0 && !langLoading && <option value="en">English</option>}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Multi-Company Setup</label>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only" 
                                                checked={companyForm.multi_company}
                                                onChange={e => setCompanyForm({ ...companyForm, multi_company: e.target.checked })}
                                            />
                                            <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${companyForm.multi_company ? 'bg-blue-600' : 'bg-slate-700'}`} onClick={() => setCompanyForm({ ...companyForm, multi_company: !companyForm.multi_company })}></div>
                                            <div className={`absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full transition-transform pointer-events-none ${companyForm.multi_company ? 'translate-x-5' : ''}`}></div>
                                        </div>
                                        <span className="text-sm text-slate-300">Enable Sub-Tenants</span>
                                    </div>
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
                                    {configOptions?.paper_formats?.map(pf => (
                                        <option key={pf.id} value={pf.id}>{pf.name}</option>
                                    )) || (
                                        <>
                                            <option value="A4">A4</option>
                                            <option value="Letter">US Letter</option>
                                        </>
                                    )}
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
                                <p className="font-semibold text-slate-200">Prune System Events</p>
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

                {/* Section: Multi-Company */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Multi-Company</h2>
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900">
                        <div className="relative mt-0.5" onClick={() => setCompanyForm({...companyForm, multi_company: !companyForm.multi_company})}>
                            <div className={`w-10 h-5 rounded-full transition-colors ${companyForm.multi_company ? 'bg-blue-600' : 'bg-slate-700'}`}></div>
                            <div className={`absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full transition-transform ${companyForm.multi_company ? 'translate-x-5' : ''}`}></div>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-200 cursor-pointer" onClick={() => setCompanyForm({...companyForm, multi_company: !companyForm.multi_company})}>Allow Multi-Company</p>
                            <p className="text-sm text-slate-500">Enable users to switch between multiple company contexts without logging out.</p>
                        </div>
                    </div>
                </div>

                {/* Section: Discuss & Email */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Discuss & Email</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Link to="/admin/settings/outgoing-mail" className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900 hover:border-blue-500 transition-colors">
                            <Server className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                                <p className="font-semibold text-slate-200">Outgoing Mail Servers</p>
                                <p className="text-sm text-slate-500">Configure SMTP servers for sending system emails</p>
                            </div>
                        </Link>
                        <Link to="/admin/settings/email-templates" className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900 hover:border-blue-500 transition-colors">
                            <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                                <p className="font-semibold text-slate-200">Email Templates</p>
                                <p className="text-sm text-slate-500">Create and manage automated email notification templates</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Section: Customer Portal */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Customer Portal</h2>
                    <Link to="/admin/settings/portal" className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900 hover:border-blue-500 transition-colors">
                        <Globe className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                            <p className="font-semibold text-slate-200">Customer Portal</p>
                            <p className="text-sm text-slate-500">Allow customers to access their orders, invoices, and support tickets via a self-service portal</p>
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    );
}
