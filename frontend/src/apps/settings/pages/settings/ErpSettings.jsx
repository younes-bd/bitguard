import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Settings, Save, Bell, Shield, Clock, CreditCard, Calculator, FileText, Users, ShoppingBag, PieChart, Box, Wrench, Globe } from 'lucide-react';
import { settingsService } from '../../api/settingsService';
import toast from 'react-hot-toast';

const SettingRow = ({ icon: Icon, title, description, children }) => (
    <div className="flex items-start justify-between gap-6 py-5 border-b border-slate-800 last:border-0">
        <div className="flex items-start gap-4">
            {Icon && (
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={18} className="text-slate-400" />
                </div>
            )}
            <div>
                <h4 className="text-white font-medium text-sm">{title}</h4>
                <p className="text-slate-500 text-xs mt-0.5 max-w-md">{description}</p>
            </div>
        </div>
        <div className="flex-shrink-0">{children}</div>
    </div>
);

const Toggle = ({ value, onChange }) => {
    return (
        <button onClick={() => onChange(value === 'true' ? 'false' : 'true')}
            className={`w-11 h-6 rounded-full transition-colors relative ${value === 'true' ? 'bg-emerald-600' : 'bg-slate-700'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${value === 'true' ? 'translate-x-5' : ''}`} />
        </button>
    );
};

const ErpSettings = () => {
    const location = useLocation();
    const path = location.pathname.split('/').pop();
    
    const getModuleInfo = () => {
        switch(path) {
            case 'crm': return { title: 'CRM Settings', icon: Users, color: 'blue' };
            case 'sales': return { title: 'Sales Settings', icon: ShoppingBag, color: 'emerald' };
            case 'accounting': return { title: 'Accounting Settings', icon: PieChart, color: 'amber' };
            case 'inventory': return { title: 'Inventory Settings', icon: Box, color: 'purple' };
            case 'manufacturing': return { title: 'Manufacturing Settings', icon: Wrench, color: 'rose' };
            case 'website': return { title: 'Website Settings', icon: Globe, color: 'indigo' };
            default: return { title: 'Finance & ERP Settings', icon: Settings, color: 'slate' };
        }
    };
    const moduleInfo = getModuleInfo();
    const ModuleIcon = moduleInfo.icon;

    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        // Accounting
        fiscal_year_end: 'December',
        period_locking: 'true',
        global_tax_rate: '20',
        tax_id_number: '',
        default_payment_terms: 'Net 30',
        overdue_reminders: 'true',
        multi_level_approval: 'true',
        // CRM
        lead_scoring: 'true',
        auto_assign_leads: 'false',
        // Sales
        quotation_validity: '30',
        online_signature: 'true',
        // Inventory
        default_warehouse: 'Main',
        low_stock_alerts: 'true',
        // Manufacturing
        work_order_dependencies: 'true',
        // Website
        google_analytics_id: '',
        enable_blog: 'true'
    });

    useEffect(() => {
        settingsService.getSettings()
            .then(res => {
                const data = res.data?.results || res.data || [];
                const newSettings = { ...settings };
                data.forEach(s => {
                    if (newSettings.hasOwnProperty(s.key)) {
                        newSettings[s.key] = s.value;
                    }
                });
                setSettings(newSettings);
            })
            .catch(err => console.error("Error loading ERP settings:", err));
    }, []);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await settingsService.batchUpdateSettings(settings);
            toast.success('Settings saved successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <ModuleIcon className={`text-${moduleInfo.color}-500`} size={28} />
                        {moduleInfo.title}
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Configuration and operational parameters for this module</p>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                    <Save size={16} className={saving ? "animate-pulse" : ""} />
                    {saving ? "Saving..." : "Save Settings"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(path === 'accounting' || path === 'erp-settings') && (
                    <>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                                <Clock size={20} className="text-amber-400" />
                                Fiscal Period
                            </h3>
                            <SettingRow title="Fiscal Year End" description="Define the month your fiscal year closes">
                                <select value={settings.fiscal_year_end} onChange={(e) => handleChange('fiscal_year_end', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none">
                                    <option value="December">December (Default)</option>
                                    <option value="March">March</option>
                                    <option value="June">June</option>
                                    <option value="September">September</option>
                                </select>
                            </SettingRow>
                            <SettingRow title="Period Locking" description="Auto-lock accounting periods after closing">
                                <Toggle value={settings.period_locking} onChange={(val) => handleChange('period_locking', val)} />
                            </SettingRow>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                                <Calculator size={20} className="text-amber-400" />
                                Taxation & VAT
                            </h3>
                            <SettingRow title="Global VAT/Sales Tax Rate" description="Primary tax percentage for all service invoices">
                                <div className="flex items-center gap-2">
                                    <input type="number" value={settings.global_tax_rate} onChange={(e) => handleChange('global_tax_rate', e.target.value)} className="w-16 bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm" />
                                    <span className="text-slate-400">%</span>
                                </div>
                            </SettingRow>
                            <SettingRow title="Tax Identification Number" description="Display business TRN/VAT ID on all documents">
                                <input type="text" value={settings.tax_id_number} onChange={(e) => handleChange('tax_id_number', e.target.value)} placeholder="TRN-123456789" className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm" />
                            </SettingRow>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2">
                            <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                                <CreditCard size={20} className="text-amber-400" />
                                Accounts Receivable
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <SettingRow icon={FileText} title="Default Payment Terms" description="Set due date for new invoices created in the system">
                                    <select value={settings.default_payment_terms} onChange={(e) => handleChange('default_payment_terms', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300">
                                        <option value="Due on Receipt">Due on Receipt</option>
                                        <option value="Net 15">Net 15</option>
                                        <option value="Net 30">Net 30</option>
                                        <option value="Net 60">Net 60</option>
                                    </select>
                                </SettingRow>
                                <SettingRow icon={Bell} title="Overdue Auto-reminders" description="Auto-email clients when invoices become overdue">
                                    <Toggle value={settings.overdue_reminders} onChange={(val) => handleChange('overdue_reminders', val)} />
                                </SettingRow>
                                <SettingRow icon={Shield} title="Multi-level Approval" description="Large expenses require manager & finance team approval">
                                    <Toggle value={settings.multi_level_approval} onChange={(val) => handleChange('multi_level_approval', val)} />
                                </SettingRow>
                            </div>
                        </div>
                    </>
                )}

                {path === 'crm' && (
                    <>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                                <Users size={20} className="text-blue-400" />
                                Lead Management
                            </h3>
                            <SettingRow title="Lead Scoring" description="Automatically assign scores to leads based on interactions">
                                <Toggle value={settings.lead_scoring} onChange={(val) => handleChange('lead_scoring', val)} />
                            </SettingRow>
                            <SettingRow title="Auto-Assign Leads" description="Round-robin assignment for incoming leads">
                                <Toggle value={settings.auto_assign_leads} onChange={(val) => handleChange('auto_assign_leads', val)} />
                            </SettingRow>
                        </div>
                    </>
                )}

                {path === 'sales' && (
                    <>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                                <ShoppingBag size={20} className="text-emerald-400" />
                                Quotations & Orders
                            </h3>
                            <SettingRow title="Quotation Validity (Days)" description="Default validity duration for new quotations">
                                <input type="number" value={settings.quotation_validity} onChange={(e) => handleChange('quotation_validity', e.target.value)} className="w-20 bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm" />
                            </SettingRow>
                            <SettingRow title="Online Signature" description="Allow clients to sign quotations online">
                                <Toggle value={settings.online_signature} onChange={(val) => handleChange('online_signature', val)} />
                            </SettingRow>
                        </div>
                    </>
                )}

                {path === 'inventory' && (
                    <>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                                <Box size={20} className="text-purple-400" />
                                Stock & Warehouses
                            </h3>
                            <SettingRow title="Default Warehouse" description="Primary location for incoming inventory">
                                <select value={settings.default_warehouse} onChange={(e) => handleChange('default_warehouse', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300">
                                    <option value="Main">Main Warehouse</option>
                                    <option value="Secondary">Secondary Location</option>
                                </select>
                            </SettingRow>
                            <SettingRow title="Low Stock Alerts" description="Notify managers when items fall below reorder point">
                                <Toggle value={settings.low_stock_alerts} onChange={(val) => handleChange('low_stock_alerts', val)} />
                            </SettingRow>
                        </div>
                    </>
                )}

                {path === 'manufacturing' && (
                    <>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                                <Wrench size={20} className="text-rose-400" />
                                Production Control
                            </h3>
                            <SettingRow title="Work Order Dependencies" description="Require preceding operations to be complete before starting">
                                <Toggle value={settings.work_order_dependencies} onChange={(val) => handleChange('work_order_dependencies', val)} />
                            </SettingRow>
                        </div>
                    </>
                )}

                {path === 'website' && (
                    <>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-white font-semibold mb-4 text-lg flex items-center gap-2">
                                <Globe size={20} className="text-indigo-400" />
                                Site Configuration
                            </h3>
                            <SettingRow title="Google Analytics ID" description="Tracking ID for website analytics (G-XXXXXXXXXX)">
                                <input type="text" value={settings.google_analytics_id} onChange={(e) => handleChange('google_analytics_id', e.target.value)} placeholder="G-XXXXXXXXXX" className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm" />
                            </SettingRow>
                            <SettingRow title="Enable Blog" description="Show blog/news section on the website">
                                <Toggle value={settings.enable_blog} onChange={(val) => handleChange('enable_blog', val)} />
                            </SettingRow>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ErpSettings;
