import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, Circle, Clock, ChevronDown, ChevronRight, Plus, X } from 'lucide-react';
import client from '../../../../core/api/client';
import GenericModal from '../../../../core/components/shared/forms/GenericModal';
import toast from 'react-hot-toast';

const TASK_CATEGORIES = [
    { key: 'it_setup', label: 'IT Setup', color: 'text-blue-400', border: 'border-blue-500/20' },
    { key: 'hr_admin', label: 'HR Admin', color: 'text-purple-400', border: 'border-purple-500/20' },
    { key: 'training', label: 'Training', color: 'text-amber-400', border: 'border-amber-500/20' },
];

const TASK_FIELDS = [
    { name: 'title', label: 'Task Title', required: true },
    { name: 'category', label: 'Category', type: 'select', options: TASK_CATEGORIES.map(c => ({ value: c.key, label: c.label })), default: 'it_setup' },
    { name: 'assignee', label: 'Assignee', required: true },
    { name: 'due_date', label: 'Due Date', type: 'date' },
];

export default function OnboardingWorkflow() {
    const [instances, setInstances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchInstances = async () => {
        setLoading(true);
        try {
            const res = await client.get('hrm/onboarding/');
            setInstances(res.data?.results || res.data || []);
        } catch { toast.error('Failed to load onboarding instances'); }
        finally { setLoading(false); }
    };

    const fetchTasks = async (id) => {
        setTasksLoading(true);
        try {
            const res = await client.get(`hrm/onboarding-tasks/?onboarding=${id}`);
            setTasks(res.data?.results || res.data || []);
        } catch { toast.error('Failed to load tasks'); }
        finally { setTasksLoading(false); }
    };

    useEffect(() => { fetchInstances(); }, []);

    const openInstance = (inst) => {
        setSelected(inst);
        fetchTasks(inst.id);
    };

    const handleAddTask = async (formData) => {
        setActionLoading(true);
        try {
            await client.post(`hrm/onboarding-tasks/`, { ...formData, onboarding: selected.id });
            toast.success('Task added');
            setIsTaskModalOpen(false);
            fetchTasks(selected.id);
        } catch { toast.error('Failed to add task'); }
        finally { setActionLoading(false); }
    };

    const handleCompleteTask = async (taskId, current) => {
        try {
            await client.patch(`hrm/onboarding-tasks/${taskId}/`, { status: current === 'done' ? 'pending' : 'done' });
            fetchTasks(selected.id);
            fetchInstances();
        } catch { toast.error('Failed to update task'); }
    };

    const calcProgress = (inst) => {
        const total = inst.task_count || 0;
        const done = inst.completed_tasks || 0;
        return total > 0 ? Math.round((done / total) * 100) : 0;
    };

    const tasksByCategory = (catKey) => tasks.filter(t => t.category === catKey);

    if (loading && instances.length === 0) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading onboarding workflows...</p>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <UserPlus className="text-pink-400" size={28} /> Employee Onboarding
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Track new hire onboarding progress across IT, HR, and Training</p>
            </div>

            {instances.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl text-slate-500">
                    <UserPlus size={40} className="mx-auto mb-3 text-slate-700" />
                    <p className="font-bold text-slate-400">No Active Onboarding</p>
                    <p className="text-sm mt-1">Start onboarding from the Employees page</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {instances.map(inst => {
                        const pct = calcProgress(inst);
                        return (
                            <div key={inst.id} onClick={() => openInstance(inst)}
                                className="bg-slate-900 border border-slate-700/50 hover:border-pink-500/30 rounded-2xl p-5 cursor-pointer transition-all group">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-white font-bold group-hover:text-pink-200 transition-colors">{inst.employee_name}</p>
                                        <p className="text-slate-500 text-xs">{inst.department} Â· Started {inst.start_date}</p>
                                    </div>
                                    <span className="text-xl font-black text-pink-400">{pct}%</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-1.5">
                                    <div className="bg-pink-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                                </div>
                                <p className="text-xs text-slate-500 mt-2">{inst.completed_tasks || 0} / {inst.task_count || 0} tasks completed</p>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Slide-over panel */}
            {selected && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end" onClick={() => setSelected(null)}>
                    <div className="w-full max-w-xl bg-slate-950 border-l border-slate-800 h-full overflow-y-auto shadow-2xl"
                        onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-800 sticky top-0 bg-slate-950 z-10 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-white">{selected.employee_name}</h2>
                                <p className="text-slate-400 text-sm">{selected.department} Â· {selected.start_date}</p>
                            </div>
                            <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white p-1"><X size={22} /></button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Onboarding Tasks</p>
                                <button onClick={() => setIsTaskModalOpen(true)} className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors font-bold">
                                    <Plus size={12} /> Add Task
                                </button>
                            </div>
                            {tasksLoading ? (
                                <div className="text-center py-8 text-slate-500 text-sm">Loading tasks...</div>
                            ) : (
                                TASK_CATEGORIES.map(cat => {
                                    const catTasks = tasksByCategory(cat.key);
                                    if (catTasks.length === 0) return null;
                                    return (
                                        <div key={cat.key}>
                                            <p className={`text-xs font-black uppercase tracking-widest mb-2 ${cat.color}`}>{cat.label}</p>
                                            <div className="space-y-2">
                                                {catTasks.map(task => (
                                                    <div key={task.id} onClick={() => handleCompleteTask(task.id, task.status)}
                                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${task.status === 'done' ? 'bg-slate-900/50 border-slate-800/50 opacity-60' : `bg-slate-900 ${cat.border} hover:opacity-90`}`}>
                                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${task.status === 'done' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                                                            {task.status === 'done' && <CheckCircle size={12} className="text-white" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-slate-500' : 'text-slate-200'}`}>{task.title}</p>
                                                            {task.assignee && <p className="text-xs text-slate-500">Assignee: {task.assignee}</p>}
                                                        </div>
                                                        {task.due_date && <p className="text-xs text-slate-500 shrink-0">{task.due_date}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            <GenericModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}
                title="Add Onboarding Task" fields={TASK_FIELDS} onSubmit={handleAddTask} loading={actionLoading} />
        </div>
    );
}

