import React, { useState, useEffect } from 'react';
import { iamService } from '../../../../core/api/iamService';
import { ShieldCheck, Plus, Pencil, Trash2, Loader2, Info, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import client from '../../../../core/api/client';

const RecordRules = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [roles, setRoles] = useState([]);
    const [contentTypes, setContentTypes] = useState([]);
    const [form, setForm] = useState({ name: '', role: '', content_type: '', domain_filter: '[]', is_global: false });

    const fetchRules = async () => {
        try {
            setLoading(true);
            const data = await iamService.getRecordRules();
            setRules(data || []);
        } catch (error) {
            toast.error("Failed to fetch record rules");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
        client.get('iam/roles/').then(r => setRoles(r.data?.data?.roles || r.data?.data || r.data?.results || r.data || []));
        client.get('iam/content-types/').then(r => {
            const grouped = r.data?.data || r.data || {};
            const flat = Object.values(grouped).flat();
            setContentTypes(flat);
        });
    }, []);
    const openCreate = () => {
        setEditingRule(null);
        setForm({ name: '', role: '', content_type: '', domain_filter: '[]', is_global: false });
        setIsModalOpen(true);
    };

    const openEdit = (rule) => {
        setEditingRule(rule);
        setForm({
            name: rule.name,
            role: rule.role || '',
            content_type: rule.content_type || '',
            domain_filter: typeof rule.domain_filter === 'string' ? rule.domain_filter : JSON.stringify(rule.domain_force || rule.domain_filter || []),
            is_global: rule.is_global || false
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingRule) {
                await iamService.updateRecordRule(editingRule.id, form);
                toast.success('Record rule updated');
            } else {
                await iamService.createRecordRule(form);
                toast.success('Record rule created');
            }
            setIsModalOpen(false);
            fetchRules();
        } catch (err) {
            toast.error('Failed to save record rule');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this rule?")) return;
        try {
            await iamService.deleteRecordRule(id);
            toast.success("Rule deleted successfully");
            fetchRules();
        } catch (error) {
            toast.error("Failed to delete rule");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="animate-spin text-purple-500 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
                        <ShieldCheck className="text-purple-500" />
                        Record Rules
                    </h1>
                    <p className="text-slate-400">Row-level security policies equivalent to Odoo's ir.rule</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors">
                    <Plus className="w-4 h-4" />
                    New Rule
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-950/50 border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-slate-300">Name</th>
                                <th className="px-6 py-3 font-semibold text-slate-300">Model</th>
                                <th className="px-6 py-3 font-semibold text-slate-300">Domain Filter</th>
                                <th className="px-6 py-3 font-semibold text-slate-300">Operations</th>
                                <th className="px-6 py-3 font-semibold text-slate-300 w-[100px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {rules.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-slate-500">
                                        <Info className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                                        No record rules configured
                                    </td>
                                </tr>
                            ) : (
                                rules.map((rule) => (
                                    <tr key={rule.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-200">{rule.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                                                {rule.model}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-xs bg-slate-950 p-1 rounded font-mono text-purple-400">
                                                {rule.domain_force || rule.domain_filter || '[]'}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1">
                                                {rule.perm_read && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400">R</span>}
                                                {rule.perm_write && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400">W</span>}
                                                {rule.perm_create && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">C</span>}
                                                {rule.perm_unlink && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400">D</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button className="p-1 text-slate-500 hover:text-purple-400 transition-colors" onClick={() => openEdit(rule)}>
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button className="p-1 text-slate-500 hover:text-rose-400 transition-colors" onClick={() => handleDelete(rule.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white">{editingRule ? 'Edit Record Rule' : 'New Record Rule'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-slate-400">Name</label>
                                <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
                                    className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Rule name" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">Role</label>
                                <select value={form.role} onChange={e => setForm(p => ({...p, role: e.target.value}))}
                                    className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    <option value="">-- All Roles (Global) --</option>
                                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">Model</label>
                                <select value={form.content_type} onChange={e => setForm(p => ({...p, content_type: e.target.value}))}
                                    className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    <option value="">-- Select Model --</option>
                                    {contentTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">Domain Filter (JSON)</label>
                                <textarea value={form.domain_filter} onChange={e => setForm(p => ({...p, domain_filter: e.target.value}))}
                                    rows={3}
                                    className="mt-1 flex w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder='[["field", "=", "value"]]' />
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="is_global" checked={form.is_global} onChange={e => setForm(p => ({...p, is_global: e.target.checked}))}
                                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-purple-500" />
                                <label htmlFor="is_global" className="text-sm text-slate-300">Global Rule (applies to all roles)</label>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={handleSave} className="flex-1 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium">
                                {editingRule ? 'Save Changes' : 'Create Rule'}
                            </button>
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-md border border-slate-700 text-slate-400 hover:text-white text-sm">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecordRules;
