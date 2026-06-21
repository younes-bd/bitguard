import React, { useState, useEffect } from 'react';
import { GitBranch, Plus, Search, CheckCircle, AlertCircle, Clock, Play, X, ChevronRight, Loader2, XCircle, RotateCcw, CheckSquare, User, Calendar, Download } from 'lucide-react';
import serviceService from '../../../../core/api/serviceService';
import reportingService from '../../../../core/api/reportingService';
import GenericModal from '../../../../core/components/shared/forms/GenericModal';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
    draft: { label: 'Draft', color: 'bg-slate-700 text-slate-300 border-slate-600' },
    submitted: { label: 'Submitted', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    approved: { label: 'Approved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    in_progress: { label: 'In Progress', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' },
    completed: { label: 'Completed', color: 'bg-emerald-700/20 text-emerald-300 border-emerald-700/30' },
    failed: { label: 'Failed', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    rolled_back: { label: 'Rolled Back', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
};

const RISK_COLOR = { low: 'text-emerald-400', medium: 'text-amber-400', high: 'text-rose-400', critical: 'text-rose-500' };

const CHANGE_FIELDS = [
    { name: 'title', label: 'Title', required: true },
    { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
    { name: 'risk_level', label: 'Risk Level', type: 'select', options: [
        { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }
    ], default: 'medium' },
    { name: 'scheduled_date', label: 'Scheduled Date', type: 'date' },
];

const TASK_FIELDS = [
    { name: 'title', label: 'Task Title', required: true },
    { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
    { name: 'due_date', label: 'Due Date', type: 'date' },
];

export default function ChangeRequestList() {
    const [changes, setChanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const fetchChanges = async () => {
        setLoading(true);
        try {
            const data = await serviceService.getChangeRequests();
            setChanges(Array.isArray(data) ? data : data.results || []);
        } catch { toast.error('Failed to load change requests'); }
        finally { setLoading(false); }
    };

    const fetchTasks = async (changeId) => {
        setTasksLoading(true);
        try {
            const data = await serviceService.getTasks(changeId);
            setTasks(Array.isArray(data) ? data : data.results || []);
        } catch { toast.error('Failed to load tasks'); }
        finally { setTasksLoading(false); }
    };

    useEffect(() => { fetchChanges(); }, []);

    const openDetail = (cr) => {
        setSelected(cr);
        fetchTasks(cr.id);
    };

    const handleCreate = async (formData) => {
        setActionLoading(true);
        try {
            await serviceService.createChangeRequest(formData);
            toast.success('Change request created');
            setIsModalOpen(false);
            fetchChanges();
        } catch { toast.error('Failed to create change request'); }
        finally { setActionLoading(false); }
    };

    const handleAction = async (action, id) => {
        setActionLoading(true);
        try {
            await serviceService[action](id);
            const labels = { submit: 'submitted', approve: 'approved', startWork: 'started', complete: 'completed', fail: 'marked as failed', rollback: 'rolled back' };
            toast.success(`Request ${labels[action] || action}`);
            fetchChanges();
            setSelected(prev => prev ? { ...prev, status: { submit: 'submitted', approve: 'approved', startWork: 'in_progress', complete: 'completed', fail: 'failed', rollback: 'rolled_back' }[action] || prev.status } : null);
        } catch { toast.error(`Failed to ${action} request`); }
        finally { setActionLoading(false); }
    };

    const handleCreateTask = async (formData) => {
        setActionLoading(true);
        try {
            await serviceService.createTask({ ...formData, change_request: selected.id });
            toast.success('Task added');
            setIsTaskModalOpen(false);
            fetchTasks(selected.id);
        } catch { toast.error('Failed to create task'); }
        finally { setActionLoading(false); }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            await serviceService.updateTask(taskId, { status: 'completed' });
            toast.success('Task completed');
            fetchTasks(selected.id);
        } catch { toast.error('Failed to update task'); }
    };

    const filtered = changes.filter(c => (c.title || '').toLowerCase().includes(search.toLowerCase()));

    const ActionButtons = ({ cr }) => {
        const s = cr.status;
        return (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-700/50">
                {s === 'draft' && <button onClick={(e) => { e.stopPropagation(); handleAction('submit', cr.id); }} disabled={actionLoading} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-1.5"><Play size={12} /> Submit</button>}
                {s === 'submitted' && <button onClick={(e) => { e.stopPropagation(); handleAction('approve', cr.id); }} disabled={actionLoading} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-1.5"><CheckCircle size={12} /> Approve</button>}
                {s === 'approved' && <button onClick={(e) => { e.stopPropagation(); handleAction('startWork', cr.id); }} disabled={actionLoading} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-1.5"><Play size={12} /> Start Work</button>}
                {s === 'in_progress' && <>
                    <button onClick={(e) => { e.stopPropagation(); handleAction('complete', cr.id); }} disabled={actionLoading} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-1.5"><CheckCircle size={12} /> Complete</button>
                    <button onClick={(e) => { e.stopPropagation(); handleAction('fail', cr.id); }} disabled={actionLoading} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-1.5"><XCircle size={12} /> Fail</button>
                    <button onClick={(e) => { e.stopPropagation(); handleAction('rollback', cr.id); }} disabled={actionLoading} className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-1.5"><RotateCcw size={12} /> Rollback</button>
                </>}
            </div>
        );
    };

    if (loading && changes.length === 0) return (
        <div className="flex items-center justify-center min-h-[400px] gap-4 flex-col">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading change requests...</p>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <GitBranch className="text-indigo-500" size={28} /> Change Requests
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage IT service change lifecycle</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95">
                    <Plus size={18} /> New Request
                </button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="text" placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                    <GitBranch size={40} className="mx-auto mb-3 text-slate-700" />
                    <p className="font-bold text-slate-400">No Change Requests Found</p>
                    <p className="text-sm mt-1">Create your first change request to track IT service changes</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map(cr => {
                        const statusCfg = STATUS_CONFIG[cr.status] || STATUS_CONFIG.draft;
                        return (
                            <div key={cr.id} onClick={() => openDetail(cr)}
                                className="bg-slate-900 border border-slate-700/50 rounded-2xl p-5 hover:border-indigo-500/40 transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-white font-bold text-sm flex-1 pr-2 group-hover:text-indigo-200 transition-colors">{cr.title}</h3>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shrink-0 ${statusCfg.color}`}>
                                        {statusCfg.label}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-xs line-clamp-2 mb-3">{cr.description}</p>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold uppercase ${RISK_COLOR[cr.risk_level] || 'text-slate-400'}`}>
                                        â¬¥ {cr.risk_level || 'low'} risk
                                    </span>
                                    {cr.scheduled_date && (
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <Calendar size={10} /> {cr.scheduled_date}
                                        </span>
                                    )}
                                </div>
                                <ActionButtons cr={cr} />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Slide-over Detail Panel */}
            {selected && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end" onClick={() => setSelected(null)}>
                    <div className="w-full max-w-xl bg-slate-950 border-l border-slate-800 h-full overflow-y-auto flex flex-col shadow-2xl"
                        onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-800 flex justify-between items-start sticky top-0 bg-slate-950 z-10">
                            <div>
                                <h2 className="text-xl font-bold text-white">{selected.title}</h2>
                                <span className={`mt-1 inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${STATUS_CONFIG[selected.status]?.color || ''}`}>
                                    {STATUS_CONFIG[selected.status]?.label || selected.status}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={async () => {
                                        try {
                                            await reportingService.generateReport(null, 'services.ChangeRequest', selected.id);
                                            toast.success('Document downloaded');
                                        } catch(e) {
                                            toast.error('Failed to download document');
                                        }
                                    }}
                                    className="text-slate-400 hover:text-white transition-colors p-1 flex items-center gap-1 text-xs font-bold"
                                >
                                    <Download size={18} />
                                </button>
                                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white transition-colors p-1"><X size={22} /></button>
                            </div>
                        </div>
                        <div className="flex-1 p-6 space-y-6">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</p>
                                <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800">{selected.description || 'No description provided.'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                    <p className="text-xs text-slate-500 mb-1">Risk Level</p>
                                    <p className={`font-bold uppercase text-sm ${RISK_COLOR[selected.risk_level]}`}>{selected.risk_level || 'low'}</p>
                                </div>
                                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                    <p className="text-xs text-slate-500 mb-1">Scheduled</p>
                                    <p className="text-white text-sm font-bold">{selected.scheduled_date || 'Unscheduled'}</p>
                                </div>
                            </div>

                            {/* Tasks */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Implementation Tasks</p>
                                    <button onClick={() => setIsTaskModalOpen(true)}
                                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                                        <Plus size={12} /> Add Task
                                    </button>
                                </div>
                                {tasksLoading ? (
                                    <div className="text-center py-6 text-slate-500 text-sm">Loading tasks...</div>
                                ) : tasks.length === 0 ? (
                                    <div className="text-center py-6 text-slate-600 text-sm border border-dashed border-slate-800 rounded-xl">No tasks yet</div>
                                ) : (
                                    <div className="space-y-2">
                                        {tasks.map(task => (
                                            <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                                                <button onClick={() => task.status !== 'completed' && handleCompleteTask(task.id)}
                                                    className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${task.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 hover:border-indigo-400'}`}>
                                                    {task.status === 'completed' && <CheckCircle size={12} className="text-white" />}
                                                </button>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>{task.title}</p>
                                                    {task.due_date && <p className="text-xs text-slate-500">{task.due_date}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Lifecycle Actions</p>
                                <div className="flex flex-wrap gap-2">
                                    <ActionButtons cr={selected} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <GenericModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
                title="Create Change Request" fields={CHANGE_FIELDS} onSubmit={handleCreate} loading={actionLoading} />
            <GenericModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}
                title="Add Implementation Task" fields={TASK_FIELDS} onSubmit={handleCreateTask} loading={actionLoading} />
        </div>
    );
}

