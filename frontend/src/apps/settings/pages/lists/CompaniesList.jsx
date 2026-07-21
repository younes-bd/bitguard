import React, { useState, useEffect } from 'react';
import {
    Building2, Search, Plus, Globe, Edit2, XCircle, CheckCircle2,
    Loader2, X, Users, Calendar, CreditCard, MoreVertical, Trash2, RefreshCw
} from 'lucide-react';
import client from '../../../../core/api/client';
import toast from 'react-hot-toast';

// Helper: extract array from standard_response { success, message, data: [...] }
function extractList(res) {
    const d = res?.data;
    if (Array.isArray(d)) return d;
    if (d && Array.isArray(d.data)) return d.data;
    if (d && Array.isArray(d.results)) return d.results;
    if (d && Array.isArray(d.tenants)) return d.tenants;
    return [];
}

const PLAN_COLORS = {
    free:       'text-slate-400 bg-slate-500/10 border-slate-500/20',
    starter:    'text-blue-400 bg-blue-500/10 border-blue-500/20',
    professional: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    enterprise: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

const EMPTY_CREATE = { name: '', domain: '', subscription_plan: 'free', is_active: true };

const CompaniesList = () => {
    const [companies, setCompanies]     = useState([]);
    const [loading, setLoading]         = useState(true);
    const [searchTerm, setSearchTerm]   = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen]   = useState(false);
    const [openMenuId, setOpenMenuId]   = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [createForm, setCreateForm]   = useState(EMPTY_CREATE);
    const [editForm, setEditForm]       = useState({ name: '', domain: '', subscription_plan: 'free' });

    useEffect(() => { fetchCompanies(); }, []);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const res = await client.get('tenants/');
            setCompanies(extractList(res));
        } catch (error) {
            toast.error('Failed to load companies');
            setCompanies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!createForm.name) return toast.error('Company name is required');
        setActionLoading(true);
        try {
            await client.post('tenants/', createForm);
            toast.success(`Workspace "${createForm.name}" created`);
            setIsCreateOpen(false);
            setCreateForm(EMPTY_CREATE);
            fetchCompanies();
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to create company');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await client.patch(`tenants/${selectedCompany.id}/`, editForm);
            toast.success('Company updated');
            setIsEditOpen(false);
            setCompanies(companies.map(c => c.id === selectedCompany.id ? { ...c, ...editForm } : c));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update company');
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleActive = async (company) => {
        const newStatus = !company.is_active;
        setOpenMenuId(null);
        try {
            await client.patch(`tenants/${company.id}/`, { is_active: newStatus });
            toast.success(newStatus ? `"${company.name}" activated` : `"${company.name}" suspended`);
            setCompanies(companies.map(c => c.id === company.id ? { ...c, is_active: newStatus } : c));
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (company) => {
        if (!window.confirm(`Permanently delete workspace "${company.name}"? This cannot be undone.`)) return;
        setOpenMenuId(null);
        try {
            await client.delete(`tenants/${company.id}/`);
            toast.success('Workspace deleted');
            fetchCompanies();
        } catch { toast.error('Failed to delete workspace'); }
    };

    const openEdit = (company) => {
        setSelectedCompany(company);
        setEditForm({ name: company.name || '', domain: company.domain || '', subscription_plan: company.subscription_plan || 'free' });
        setIsEditOpen(true);
        setOpenMenuId(null);
    };

    const safe = Array.isArray(companies) ? companies : [];
    const filtered = safe.filter(c =>
        (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.domain || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const planLabel = (p) => p ? p.charAt(0).toUpperCase() + p.slice(1) : 'Free';

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-500" onClick={() => setOpenMenuId(null)}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Building2 className="text-blue-400" /> Companies / Workspaces
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">
                        Manage tenant workspaces — <span className="text-white font-semibold">{safe.length}</span> workspace{safe.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchCompanies} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors" title="Refresh">
                        <RefreshCw size={16} />
                    </button>
                    <button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                        <Plus size={16} /> New Workspace
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="text" placeholder="Search workspaces by name or domain..."
                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500" />
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-xs uppercase bg-slate-950/60 text-slate-500 border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Workspace</th>
                                <th className="px-4 py-4 font-semibold">Domain</th>
                                <th className="px-4 py-4 font-semibold">Plan</th>
                                <th className="px-4 py-4 font-semibold text-center">Users</th>
                                <th className="px-4 py-4 font-semibold">Created</th>
                                <th className="px-4 py-4 font-semibold text-center">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-16 text-center text-slate-500">
                                        <Loader2 size={24} className="mx-auto mb-3 animate-spin" />
                                        Loading workspaces…
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-16 text-center text-slate-500">
                                        <Building2 size={40} className="mx-auto mb-3 opacity-20" />
                                        <p className="font-semibold">No workspaces found</p>
                                        <p className="text-xs mt-1 text-slate-600">Create a new workspace to get started.</p>
                                    </td>
                                </tr>
                            ) : filtered.map(company => {
                                const planColor = PLAN_COLORS[company.subscription_plan] || PLAN_COLORS.free;
                                return (
                                    <tr key={company.id} className="hover:bg-slate-800/40 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                    {(company.name || 'W')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-200">{company.name}</div>
                                                    <div className="text-xs text-slate-500">{company.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            {company.domain ? (
                                                <a href={`https://${company.domain}`} target="_blank" rel="noopener noreferrer"
                                                    className="text-blue-400 hover:underline text-xs font-mono flex items-center gap-1"
                                                    onClick={e => e.stopPropagation()}>
                                                    <Globe size={11} /> {company.domain}
                                                </a>
                                            ) : <span className="text-slate-600 text-xs">—</span>}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${planColor}`}>
                                                {planLabel(company.subscription_plan)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="text-slate-300 font-semibold flex items-center justify-center gap-1">
                                                <Users size={12} className="text-slate-500" />
                                                {company.user_count ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-slate-500 text-xs">
                                            {company.created_at ? new Date(company.created_at).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            {company.is_active ? (
                                                <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold uppercase">
                                                    <CheckCircle2 size={13} /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-red-400 text-xs font-bold uppercase">
                                                    <XCircle size={13} /> Suspended
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                            <div className="relative flex justify-end">
                                                <button onClick={() => setOpenMenuId(openMenuId === company.id ? null : company.id)}
                                                    className="p-1.5 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                    <MoreVertical size={15} />
                                                </button>
                                                {openMenuId === company.id && (
                                                    <div className="absolute right-0 top-8 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-10 overflow-hidden w-48">
                                                        <button onClick={() => openEdit(company)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                                                            <Edit2 size={14} /> Edit Details
                                                        </button>
                                                        <button onClick={() => handleToggleActive(company)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                                                            {company.is_active ? <><XCircle size={14} className="text-amber-400" /> Suspend</> : <><CheckCircle2 size={14} className="text-emerald-400" /> Activate</>}
                                                        </button>
                                                        <div className="border-t border-slate-700" />
                                                        <button onClick={() => handleDelete(company)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                                                            <Trash2 size={14} /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2"><Building2 size={18} /> New Workspace</h3>
                            <button onClick={() => setIsCreateOpen(false)}><X size={20} className="text-slate-400 hover:text-white" /></button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="p-6 space-y-4">
                                {[['Company Name *', 'name', 'text', 'e.g. Acme Corp'], ['Domain', 'domain', 'text', 'e.g. acme.bitguard.com']].map(([label, key, type, ph]) => (
                                    <div key={key}>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
                                        <input type={type} value={createForm[key]} onChange={e => setCreateForm(p => ({ ...p, [key]: e.target.value }))}
                                            placeholder={ph} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Subscription Plan</label>
                                    <select value={createForm.subscription_plan} onChange={e => setCreateForm(p => ({ ...p, subscription_plan: e.target.value }))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                                        {['free', 'starter', 'professional', 'enterprise'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                                    </select>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={createForm.is_active} onChange={e => setCreateForm(p => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 accent-blue-500" />
                                    <span className="text-sm text-slate-300">Active immediately</span>
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 p-6 border-t border-slate-800">
                                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
                                <button type="submit" disabled={actionLoading} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                                    {actionLoading ? 'Creating…' : 'Create Workspace'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditOpen && selectedCompany && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2"><Edit2 size={16} /> Edit: {selectedCompany.name}</h3>
                            <button onClick={() => setIsEditOpen(false)}><X size={20} className="text-slate-400 hover:text-white" /></button>
                        </div>
                        <form onSubmit={handleEdit}>
                            <div className="p-6 space-y-4">
                                {[['Company Name', 'name', 'text', ''], ['Domain', 'domain', 'text', 'e.g. acme.bitguard.com']].map(([label, key, type, ph]) => (
                                    <div key={key}>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
                                        <input type={type} value={editForm[key]} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))}
                                            placeholder={ph} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Subscription Plan</label>
                                    <select value={editForm.subscription_plan} onChange={e => setEditForm(p => ({ ...p, subscription_plan: e.target.value }))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                                        {['free', 'starter', 'professional', 'enterprise'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 p-6 border-t border-slate-800">
                                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
                                <button type="submit" disabled={actionLoading} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                                    {actionLoading ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompaniesList;
