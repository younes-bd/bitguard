import React, { useState, useEffect } from 'react';
import { Terminal, Plus, Search, Edit2, Trash2, X, Play, Loader2, AlertCircle } from 'lucide-react';
import client from '@/core/api/client';
import toast from 'react-hot-toast';

const ACTION_TYPES = ['Execute Python Code', 'Send Email', 'Update Record', 'Create Record', 'Create Next Activity', 'Execute Webhook'];
const EMPTY_FORM = { name: '', model_name: '', action_type: 'Execute Python Code', code: '', is_active: true };

export default function ServerActions() {
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAction, setEditingAction] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [runningId, setRunningId] = useState(null);

    const fetchActions = async () => {
        setLoading(true);
        try {
            const res = await client.get('system/automated-actions/');
            setActions(res.data.results || res.data);
        } catch {
            toast.error('Failed to load server actions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchActions(); }, []);

    const openCreate = () => { setEditingAction(null); setForm(EMPTY_FORM); setIsModalOpen(true); };
    const openEdit = (a) => { setEditingAction(a); setForm(a); setIsModalOpen(true); };

    const handleSave = async () => {
        if (!form.name) return toast.error('Name is required.');
        setSaving(true);
        try {
            if (editingAction?.id) {
                await client.patch(`system/automated-actions/${editingAction.id}/`, form);
                toast.success('Server action updated');
            } else {
                await client.post('system/automated-actions/', form);
                toast.success('Server action created');
            }
            setIsModalOpen(false);
            fetchActions();
        } catch {
            toast.error('Failed to save server action');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete server action "${name}"?`)) return;
        try {
            await client.delete(`system/automated-actions/${id}/`);
            toast.success('Action deleted');
            fetchActions();
        } catch { toast.error('Failed to delete action'); }
    };

    const handleRun = async (id, name) => {
        setRunningId(id);
        try {
            const res = await client.post(`system/automated-actions/${id}/run/`);
            toast.success(res.data?.message || `Action "${name}" executed`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Execution failed');
        } finally { setRunningId(null); }
    };

    const safe = Array.isArray(actions) ? actions : [];
    const filtered = safe.filter(a => (a.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (a.model_name || '').toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Terminal className="text-blue-400" /> Server Actions
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Custom logic and automations executed on the backend</p>
                </div>
                <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20">
                    <Plus size={16} /> New Action
                </button>
            </div>

            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-start gap-3">
                <AlertCircle size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                    <div className="font-semibold text-blue-400 mb-1">Server Actions</div>
                    <div className="text-sm text-slate-400">
                        Server Actions allow you to trigger Python code on records directly.
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden min-h-[400px]">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input type="text" placeholder="Search actions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="text-xs uppercase bg-slate-950/80 text-slate-500 border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Action Name</th>
                                <th className="px-6 py-4 font-semibold">Model</th>
                                <th className="px-6 py-4 font-semibold">Action To Do</th>
                                <th className="px-4 py-4 font-semibold text-center">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500"><Loader2 className="animate-spin mx-auto w-6 h-6 mb-2"/> Loading actions...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-16 text-center text-slate-500">
                                    <Terminal size={40} className="mx-auto mb-3 opacity-20" />
                                    <p className="font-semibold text-slate-400">No server actions found</p>
                                    <p className="text-xs mt-1">Create an action to automate backend operations.</p>
                                </td></tr>
                            ) : filtered.map(action => (
                                <tr key={action.id} className="hover:bg-slate-800/40 transition-colors group">
                                    <td className="px-6 py-4 font-semibold text-slate-200">{action.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded text-xs font-mono">
                                            {action.model_name || 'â€”'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-blue-900/20 border border-blue-800/50 text-blue-400 rounded text-xs">
                                            {action.action_type || action.interval_type || 'Custom'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        {action.is_active ? (
                                            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md">Active</span>
                                        ) : (
                                            <span className="text-slate-500 text-xs font-bold uppercase bg-slate-800 px-2 py-1 rounded-md">Archived</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleRun(action.id, action.name)} disabled={runningId === action.id}
                                                className="p-1.5 bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded-lg transition-colors" title="Run now">
                                                <Play size={14} className={runningId === action.id ? 'animate-pulse text-emerald-500' : ''} />
                                            </button>
                                            <button onClick={() => openEdit(action)} className="p-1.5 bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"><Edit2 size={14} /></button>
                                            <button onClick={() => handleDelete(action.id, action.name)} className="p-1.5 bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white">{editingAction ? 'Edit Server Action' : 'New Server Action'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400 hover:text-white" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            {[['Action Name', 'name', 'text', 'e.g. Confirm Multiple Orders'], ['Model', 'model_name', 'text', 'e.g. Sale Order']].map(([label, key, type, ph]) => (
                                <div key={key}>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
                                    <input type={type} value={form[key] ?? ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                                </div>
                            ))}
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Action Type</label>
                                <select value={form.action_type} onChange={e => setForm(p => ({ ...p, action_type: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                                    {ACTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 accent-blue-500" />
                                <span className="text-sm text-slate-300">Active</span>
                            </label>
                        </div>
                        <div className="flex justify-end gap-3 p-6 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save Action'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
