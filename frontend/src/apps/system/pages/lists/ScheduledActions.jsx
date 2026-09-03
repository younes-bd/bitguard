import React, { useState, useEffect } from 'react';
import { Play, Clock, CheckCircle2, XCircle, Search, Calendar, Power, X } from 'lucide-react';
import { settingsService } from '../../api/settingsService';
import toast from 'react-hot-toast';

export default function ScheduledActions() {
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAction, setEditingAction] = useState(null);
    const [form, setForm] = useState({
        name: '',
        model_name: '',
        method_name: '',
        interval_number: 1,
        interval_type: 'days',
        is_active: true
    });

    const fetchActions = async () => {
        setLoading(true);
        try {
            const res = await settingsService.getScheduledActions();
            const d = res.data;
            const data = Array.isArray(d?.data) ? d.data
                : Array.isArray(d?.results) ? d.results
                : Array.isArray(d) ? d : [];
            setActions(data);
        } catch (error) {
            console.error('Failed to fetch scheduled actions', error);
            toast.error('Failed to load scheduled actions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActions();
    }, []);

    const toggleAction = async (action) => {
        try {
            await settingsService.toggleScheduledAction(action.id, !action.is_active);
            setActions(actions.map(a => a.id === action.id ? { ...a, is_active: !a.is_active } : a));
            toast.success(`Action ${!action.is_active ? 'enabled' : 'disabled'}`);
        } catch (error) {
            toast.error('Failed to toggle action');
        }
    };

    const runAction = async (actionId) => {
        try {
            await settingsService.runScheduledAction(actionId);
            toast.success('Action executed successfully!');
            fetchActions();
        } catch (error) {
            toast.error('Failed to run action manually');
        }
    };

    const deleteAction = async (actionId) => {
        if (!window.confirm("Are you sure you want to delete this scheduled action?")) return;
        try {
            await settingsService.deleteScheduledAction(actionId);
            setActions(actions.filter(a => a.id !== actionId));
        } catch (error) {
            toast.error('Failed to delete action');
        }
    };

    const openModal = (action = null) => {
        if (action) {
            setEditingAction(action);
            setForm({
                name: action.name,
                model_name: action.model_name || '',
                method_name: action.method_name || '',
                interval_number: action.interval_number,
                interval_type: action.interval_type,
                is_active: action.is_active
            });
        } else {
            setEditingAction(null);
            setForm({
                name: '',
                model_name: '',
                method_name: '',
                interval_number: 1,
                interval_type: 'days',
                is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAction) {
                await settingsService.updateScheduledAction(editingAction.id, form);
            } else {
                await settingsService.createScheduledAction(form);
            }
            setIsModalOpen(false);
            fetchActions();
        } catch (error) {
                        if (error.response?.status === 400) {
                toast.error('This action is already registered or there is a conflict.');
            } else {
                toast.error('Failed to save scheduled action');
            }
        }
    };

    const safeActions = Array.isArray(actions) ? actions : [];
    const filteredActions = safeActions.filter(a => 
        (a?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (a?.model_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Clock className="text-blue-500" size={28} />
                        Scheduled Actions
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Manage recurring background jobs and automation scripts.</p>
                </div>
                <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold transition-colors">
                    + New Action
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search actions..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                                <th className="p-4 font-semibold">Action Name</th>
                                <th className="p-4 font-semibold">Model / Method</th>
                                <th className="p-4 font-semibold">Interval</th>
                                <th className="p-4 font-semibold">Next Execution</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Last Error</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">
                                        <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                                        Loading scheduled actions...
                                    </td>
                                </tr>
                            ) : filteredActions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">
                                        No scheduled actions found.
                                    </td>
                                </tr>
                            ) : (
                                filteredActions.map((action) => (
                                    <tr key={action.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold text-white">{action.name}</div>
                                            <div className="text-xs text-slate-500 mt-1">Last run: {action.last_run ? new Date(action.last_run).toLocaleString() : 'Never'}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-mono text-blue-400 bg-blue-500/10 inline-block px-2 py-0.5 rounded">
                                                {action.model_name || 'custom'}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">{action.method_name || 'execute_code()'}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-slate-300">
                                                Every {action.interval_number} {action.interval_type}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-slate-300 flex items-center gap-1.5">
                                                <Calendar size={14} className="text-slate-500" />
                                                {action.next_run ? new Date(action.next_run).toLocaleString() : 'Not scheduled'}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => toggleAction(action)}
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${
                                                    action.is_active 
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                                                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                                                }`}
                                            >
                                                {action.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                {action.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs text-red-400 max-w-[150px] truncate" title={action.last_error || ''}>
                                                {action.last_error ? (action.last_error.substring(0, 50) + (action.last_error.length > 50 ? '...' : '')) : '-'}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => runAction(action.id)}
                                                    className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-blue-600 rounded-lg transition-colors tooltip-trigger"
                                                    title="Run Manually"
                                                >
                                                    <Play size={16} />
                                                </button>
                                                <button onClick={() => openModal(action)} className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-2 py-1">
                                                    Edit
                                                </button>
                                                <button onClick={() => deleteAction(action.id)} className="text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1">
                                                    Delete
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white">{editingAction ? 'Edit Scheduled Action' : 'New Scheduled Action'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-1">Action Name</label>
                                <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. Daily Backup" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-1">Model Name</label>
                                    <input required type="text" value={form.model_name} onChange={e => setForm({...form, model_name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. base.User" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-1">Method Name</label>
                                    <input required type="text" value={form.method_name} onChange={e => setForm({...form, method_name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. process_queue" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-1">Interval Number</label>
                                    <input required type="number" min="1" value={form.interval_number} onChange={e => setForm({...form, interval_number: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-1">Interval Type</label>
                                    <select value={form.interval_type} onChange={e => setForm({...form, interval_type: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500">
                                        <option value="minutes">Minutes</option>
                                        <option value="hours">Hours</option>
                                        <option value="days">Days</option>
                                        <option value="weeks">Weeks</option>
                                        <option value="months">Months</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-5 h-5 accent-blue-500 rounded bg-slate-950 border-slate-700" />
                                <label htmlFor="is_active" className="text-sm font-semibold text-slate-300 cursor-pointer">Active</label>
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">Save Action</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
