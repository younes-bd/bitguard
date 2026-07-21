import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    GripVertical, Plus, X, Clock, User, 
    CalendarDays, Layers, ArrowLeft, MoreHorizontal,
    Flag, CheckCircle2, MessageSquare, Paperclip
} from 'lucide-react';
import projectsService from '../../../../core/api/projectsService';
import { toast } from 'react-hot-toast';
import GenericModal from '../../../../core/components/shared/forms/GenericModal';

const COLUMNS = [
    { id: 'backlog', label: 'Backlog', color: 'slate' },
    { id: 'todo', label: 'To Do', color: 'blue' },
    { id: 'in_progress', label: 'In Progress', color: 'amber' },
    { id: 'review', label: 'In Review', color: 'violet' },
    { id: 'done', label: 'Done', color: 'emerald' },
];

const priorityConfig = { 
    low: { color: 'text-slate-400', label: 'Low' }, 
    medium: { color: 'text-blue-400', label: 'Medium' }, 
    high: { color: 'text-amber-500', label: 'High' }, 
    critical: { color: 'text-rose-500', label: 'Critical' } 
};

const TaskCard = ({ task, onDragStart }) => (
    <div
        draggable
        onDragStart={() => onDragStart(task)}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 cursor-grab active:cursor-grabbing hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all group select-none relative overflow-hidden shadow-sm"
    >
        <div className="flex items-start justify-between gap-3 mb-3">
            <h4 className="text-white text-sm font-black leading-tight flex-1 tracking-tight group-hover:text-cyan-400 transition-colors">
                {task.title}
            </h4>
            <button className="text-slate-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                <MoreHorizontal size={14} />
            </button>
        </div>
        
        {task.description && (
            <p className="text-slate-500 text-[11px] leading-relaxed mb-4 line-clamp-2 font-medium">
                {task.description}
            </p>
        )}

        <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full bg-current ${priorityConfig[task.priority]?.color ?? 'text-slate-500'}`} />
                <span className={`text-[9px] font-black uppercase tracking-widest ${priorityConfig[task.priority]?.color ?? 'text-slate-500'}`}>
                    {task.priority}
                </span>
            </div>
            
            <div className="flex -space-x-1">
                {task.assignee_name ? (
                    <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[8px] font-black text-slate-400" title={task.assignee_name}>
                        {task.assignee_name[0]}
                    </div>
                ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-slate-600">
                        <User size={10} />
                    </div>
                )}
            </div>
        </div>

        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-800/50 text-[9px] font-black text-slate-600 uppercase tracking-tighter">
            <span className="flex items-center gap-1"><Clock size={10} /> {task.estimated_hours || 0}H</span>
            {task.due_date && <span className="flex items-center gap-1"><CalendarDays size={10} /> {task.due_date}</span>}
        </div>
    </div>
);

const KanbanBoard = () => {
    const { id: projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dragging, setDragging] = useState(null);
    const [dragOver, setDragOver] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeColumn, setActiveColumn] = useState(null);
    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const params = projectId ? { project: projectId } : {};
            const [t, p] = await Promise.all([
                projectsService.getTasks(params),
                projectId ? projectsService.getProject(projectId).catch(() => null) : Promise.resolve(null),
            ]);
            setTasks(Array.isArray(t) ? t : t?.results ?? []);
            setProject(p);
        } catch (e) {
            toast.error("Failed to sync Kanban state");
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    useEffect(() => {
        if (projectId) {
            projectsService.getMembers(projectId).then(m => setMembers(m || []));
        } else {
            import('../../../../core/api/hrmService').then(({ hrmService }) => {
                hrmService.getEmployees().then(e => setMembers(e?.results ?? e ?? []));
            });
        }
    }, [projectId]);

    const handleDragStart = (task) => setDragging(task);
    const handleDragOver = (e, colId) => { e.preventDefault(); setDragOver(colId); };

    const handleDrop = async (e, colId) => {
        e.preventDefault();
        if (!dragging || dragging.status === colId) {
            setDragOver(null);
            return;
        }
        
        // Optimistic update
        const originalTasks = [...tasks];
        setTasks(prev => prev.map(t => t.id === dragging.id ? { ...t, status: colId } : t));
        setDragging(null);
        setDragOver(null);
        
        try {
            await projectsService.moveTask(dragging.id, colId);
        } catch (error) {
            setTasks(originalTasks);
            toast.error("Status transition failed");
        }
    };

    const handleCreateFullTask = async (formData) => {
        try {
            const payload = { ...formData, status: activeColumn };
            if (projectId) payload.project = projectId;
            const task = await projectsService.createTask(payload);
            setTasks(prev => [...prev, task]);
            setIsModalOpen(false);
            toast.success("Task created");
        } catch (e) {
            toast.error("Failed to create task");
        }
    };

    const TASK_FIELDS = [
        { name: 'title', label: 'Task Title', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'assignee', label: 'Assignee', type: 'select', options: members.map(m => ({ value: m.id || m.user_id, label: m.first_name ? `${m.first_name} ${m.last_name}` : (m.name || 'User') })) },
        { name: 'priority', label: 'Priority', type: 'select', options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'critical', label: 'Critical' }
        ], default: 'medium' },
        { name: 'due_date', label: 'Due Date', type: 'date' },
        { name: 'estimated_hours', label: 'Estimated Hours', type: 'number', step: '0.5' }
    ];

    const colTasks = (colId) => tasks.filter(t => t.status === colId);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest animate-pulse">Initializing Board...</p>
        </div>
    );

    return (
        <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link to={projectId ? `/admin/projects/${projectId}` : "/admin/projects"} className="text-slate-500 hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-3xl font-black text-white tracking-tighter font-['Outfit']">
                            {project?.name ?? 'Global Kanban'}
                        </h1>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Operational flow orchestration and status synchronization.</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-3 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl hover:text-white transition-all">
                        <MoreHorizontal size={20} />
                    </button>
                    <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-900/20">
                        Board Settings
                    </button>
                </div>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 flex-1 custom-scrollbar items-start">
                {COLUMNS.map(col => (
                    <div key={col.id}
                        className={`flex-shrink-0 w-80 flex flex-col rounded-[2.5rem] p-2 transition-all duration-300
                            ${dragOver === col.id ? 'bg-cyan-500/5 ring-2 ring-cyan-500/20' : 'bg-slate-900/40 border border-slate-800/50'}`}
                        onDragOver={e => handleDragOver(e, col.id)}
                        onDrop={e => handleDrop(e, col.id)}
                        onDragLeave={() => setDragOver(null)}
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-black uppercase tracking-[0.2em] ${dragOver === col.id ? 'text-cyan-400' : 'text-slate-400'}`}>
                                    {col.label}
                                </span>
                                <span className="text-[10px] font-black text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                                    {colTasks(col.id).length}
                                </span>
                            </div>
                            <button 
                                onClick={() => { setActiveColumn(col.id); setIsModalOpen(true); }}
                                className="w-8 h-8 flex items-center justify-center bg-slate-800 rounded-xl text-slate-500 hover:text-cyan-400 hover:bg-slate-700 transition-all"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        {/* Cards Container */}
                        <div className="flex-1 px-2 space-y-4 min-h-[300px]">
                            {colTasks(col.id).map(task => (
                                <TaskCard key={task.id} task={task} onDragStart={handleDragStart} />
                            ))}

                            {colTasks(col.id).length > 0 && (
                                <button
                                    onClick={() => { setActiveColumn(col.id); setIsModalOpen(true); }}
                                    className="w-full py-2.5 mt-2 rounded-xl border border-slate-800/50 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
                                >
                                    <Plus size={14} /> Add Task
                                </button>
                            )}

                            {colTasks(col.id).length === 0 && (
                                <div className="h-32 border-2 border-dashed border-slate-800/50 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-slate-700 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group cursor-pointer"
                                     onClick={() => { setActiveColumn(col.id); setIsModalOpen(true); }}
                                >
                                    <Layers size={24} className="opacity-20 group-hover:text-cyan-400 group-hover:opacity-100 transition-colors" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:text-cyan-400 group-hover:opacity-100 transition-colors">Add Task</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            <GenericModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Create Task in ${COLUMNS.find(c => c.id === activeColumn)?.label}`}
                fields={TASK_FIELDS}
                onSubmit={handleCreateFullTask}
            />
        </div>
    );
};
export default KanbanBoard;

