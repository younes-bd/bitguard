import React, { useState, useEffect } from 'react';
import { X, Building2, Globe, CreditCard, ShieldCheck, Save, Loader2, Check } from 'lucide-react';
import client from '../../../../core/api/client';

const AVAILABLE_MODULES = [
    { id: 'core', name: 'Core System', description: 'Base identity and tenant management (Required)', required: true },
    { id: 'crm', name: 'CRM', description: 'Client relationship and deal tracking' },
    { id: 'hrm', name: 'HRM', description: 'Employee management and leave requests' },
    { id: 'services', name: 'ITSM', description: 'Service catalog and support tickets' },
    { id: 'soc', name: 'SOC', description: 'Security operations and incident response' },
    { id: 'maintenance', name: 'ITAM', description: 'IT asset management and procurement' },
    { id: 'projects', name: 'Projects', description: 'Project tracking and milestones' },
    { id: 'contracts', name: 'Contracts', description: 'SLA and service contract management' },
    { id: 'billing', name: 'Billing', description: 'Invoicing and subscription management' },
];

const TenantManagerModal = ({ isOpen, onClose, tenant, onSaved }) => {
    const [formData, setFormData] = useState({
        name: '',
        domain: '',
        subscription_plan: 'free',
        is_active: true,
        allowed_modules: ['core']
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (tenant) {
            setFormData({
                name: tenant.name || '',
                domain: tenant.domain || '',
                subscription_plan: tenant.subscription_plan || 'free',
                is_active: tenant.is_active ?? true,
                allowed_modules: tenant.allowed_modules || ['core']
            });
        } else {
            setFormData({
                name: '',
                domain: '',
                subscription_plan: 'free',
                is_active: true,
                allowed_modules: ['core']
            });
        }
        setError(null);
    }, [tenant, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleModule = (moduleId, isRequired) => {
        if (isRequired) return; // Cannot toggle required modules
        setFormData(prev => {
            const current = new Set(prev.allowed_modules);
            if (current.has(moduleId)) {
                current.delete(moduleId);
            } else {
                current.add(moduleId);
            }
            return { ...prev, allowed_modules: Array.from(current) };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (tenant?.id) {
                await client.patch(`tenants/${tenant.id}/`, formData);
            } else {
                await client.post(`tenants/`, formData);
            }
            onSaved();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save tenant');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                            <Building2 size={20} className="text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">
                                {tenant ? 'Edit Tenant' : 'New Tenant'}
                            </h2>
                            <p className="text-xs text-slate-400">Manage client workspace and entitlements</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form id="tenant-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                                <Globe size={16} className="text-violet-400" />
                                Basic Configuration
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400">Tenant Name</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        required
                                        value={formData.name} 
                                        onChange={handleChange}
                                        placeholder="e.g. Acme Corp"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400">Domain / Subdomain</label>
                                    <input 
                                        type="text" 
                                        name="domain" 
                                        required
                                        value={formData.domain} 
                                        onChange={handleChange}
                                        placeholder="e.g. acme.bitguard.tech"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400 flex items-center gap-2">
                                        <CreditCard size={14} /> Subscription Plan
                                    </label>
                                    <select 
                                        name="subscription_plan" 
                                        value={formData.subscription_plan} 
                                        onChange={handleChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                                    >
                                        <option value="free">Free Tier</option>
                                        <option value="pro">Pro Plan</option>
                                        <option value="enterprise">Enterprise</option>
                                    </select>
                                </div>
                                <div className="space-y-2 flex flex-col justify-end">
                                    <label className="flex items-center gap-3 p-3 border border-slate-800 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors">
                                        <input 
                                            type="checkbox" 
                                            name="is_active" 
                                            checked={formData.is_active} 
                                            onChange={handleChange}
                                            className="w-4 h-4 rounded border-slate-700 text-violet-500 focus:ring-violet-500/30 bg-slate-900"
                                        />
                                        <span className="text-sm font-medium text-slate-200">Tenant Active</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Module Entitlements */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                                <ShieldCheck size={16} className="text-emerald-400" />
                                Module Entitlements
                            </h3>
                            <p className="text-xs text-slate-400">Toggle the applications this tenant is allowed to access.</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {AVAILABLE_MODULES.map(mod => {
                                    const isEnabled = formData.allowed_modules.includes(mod.id);
                                    return (
                                        <div 
                                            key={mod.id}
                                            onClick={() => toggleModule(mod.id, mod.required)}
                                            className={`relative p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1
                                                ${isEnabled ? 'bg-violet-500/10 border-violet-500/50' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}
                                                ${mod.required ? 'opacity-70 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className={`text-sm font-bold ${isEnabled ? 'text-violet-300' : 'text-slate-300'}`}>
                                                    {mod.name}
                                                </span>
                                                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors
                                                    ${isEnabled ? 'bg-violet-500 border-violet-500' : 'bg-slate-900 border-slate-700'}
                                                `}>
                                                    {isEnabled && <Check size={12} className="text-white" />}
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-slate-500 leading-tight">
                                                {mod.description}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-end gap-3">
                    <button 
                        type="button" 
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="tenant-form"
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Tenant
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TenantManagerModal;
