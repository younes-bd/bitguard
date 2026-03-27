import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GripVertical, Plus, X, Clock, User, CalendarDays } from 'lucide-react';
import projectsService from '../../../core/api/projectsService';

const COLUMNS = [
    { id: 'backlog', label: 'Backlog', color: 'slate' },
    { id: 'todo', label: 'To Do', color: 'blue' },
    { id: 'in_progress', label: 'In Progress', color: 'amber' },
    { id: 'review', label: 'In Review', color: 'violet' },
    { id: 'done', label: 'Done', color: 'emerald' },
];

const priorityColors = { low: 'bg-slate-600', medium: 'bg-blue-600', high: 'bg-amber-500', critical: 'bg-red-600' };

const TaskCard = ({ task, onDrop, onDragStart }) => (
    <div
        draggable
        onDragStart={() => onDragStart(task)}
        className="bg-slate-950 border border-slate-800 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-slate-600 transition-colors group select-none"
    >
        <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-white text-sm font-medium leading-snug flex-1">{task.title}</p>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${priorityColors[task.priority] ?? 'bg-slate-500'}`} title={task.priority} />
        </div>
        {task.description && (
            <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2">{task.description}</p>
        )}
        <div className="flex items-center gap-3 flex-wrap">
            {task.assignee_name && (
                <span className="flex items-center gap-1 text-slate-400 text-[10px]">
                    <User size={10} /> {task.assignee_name}
                </span>
            )}
            {task.due_date && (
                <span className="flex items-center gap-1 text-slate-400 text-[10px]">
                    <CalendarDays size={10} /> {task.due_date}
                </span>
            )}
            {task.estimated_hours && (
                <span className="flex items-center gap-1 text-slate-500 text-[10px]">
                    <Clock size={10} /> {task.estimated_hours}h
                </span>
            )}
        </div>
    </div>
);

const KanbanBoard = () => {
    const { id: projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dragging, setDragging] = useState(null);
    const [dragOver, setDragOver] = useState(null);
    const [creating, setCreating] = useState(null); // column id being created in
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [project, setProject] = useState(null);

    const fetchData = useCallback(() => {
        const params = projectId ? { project: projectId } : {};
        Promise.all([
            projectsService.getTasks(params),
            projectId ? projectsService.getProject(projectId).catch(() => null) : Promise.resolve(null),
        ]).then(([t, p]) => {
            setTasks(Array.isArray(t) ? t : t?.results ?? []);
            setProject(p);
            setLoading(false);
        });
    }, [projectId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDragStart = (task) => setDragging(task);
    const handleDragOver = (e, colId) => { e.preventDefault(); setDragOver(colId); };

    const handleDrop = async (e, colId) => {
        e.preventDefault();
        if (!dragging || dragging.status === colId) return;
        // Optimistic update
        setTasks(prev => prev.map(t => t.id === dragging.id ? { ...t, status: colId } : t));
        setDragging(null);
        setDragOver(null);
        await projectsService.moveTask(dragging.id, colId).catch(() => fetchData());
    };

    const handleCreateTask = async (colId) => {
        if (!newTaskTitle.trim() || !projectId) return;
        const task = await projectsService.createTask({
            project: projectId,
            title: newTaskTitle.trim(),
            status: colId,
        }).catch(() => null);
        if (task) setTasks(prev => [...prev, task]);
        setNewTaskTitle('');
        setCreating(null);
    };

    const colTasks = (colId) => tasks.filter(t => t.status === colId);

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">
                        {project?.name ?? 'Kanban Board'}
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Drag tasks between columns to update status</p>
                </div>
                {projectId && (
                    <Link to={`/admin/projects/${projectId}`} className="text-sm text-cyan-400 hover:text-cyan-300 no-underline">← Project Detail</Link>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '60vh' }}>
                    {COLUMNS.map(col => (
                        <div key={col.id}
                            className={`flex-shrink-0 w-72 flex flex-col rounded-xl transition-colors
                                ${dragOver === col.id ? 'bg-slate-800/80' : 'bg-slate-900/60'}`}
                            onDragOver={e => handleDragOver(e, col.id)}
                            onDrop={e => handleDrop(e, col.id)}
                            onDragLeave={() => setDragOver(null)}
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full bg-${col.color}-500`} />
                                    <span className="text-white text-sm font-semibold">{col.label}</span>
                                    <span className="text-slate-500 text-xs bg-slate-800 px-1.5 py-0.5 rounded-full">
                                        {colTasks(col.id).length}
                                    </span>
                                </div>
                                {projectId && (
                                    <button onClick={() => setCreating(col.id)}
                                        className="text-slate-500 hover:text-white transition-colors">
                                        <Plus size={15} />
                                    </button>
                                )}
                            </div>

                            {/* Cards */}
                            <div className="flex-1 p-3 space-y-3 min-h-[200px]">
                                {colTasks(col.id).map(task => (
                                    <TaskCard key={task.id} task={task} onDragStart={handleDragStart} />
                                ))}

                                {/* Inline Create */}
                                {creating === col.id && (
                                    <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-3 space-y-2">
                                        <input autoFocus
                                            value={newTaskTitle}
                                            onChange={e => setNewTaskTitle(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') handleCreateTask(col.id); if (e.key === 'Escape') setCreating(null); }}
                                            placeholder="Task title..."
                                            className="w-full bg-transparent text-white text-sm placeholder-slate-500 outline-none"
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={() => handleCreateTask(col.id)}
                                                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded-lg font-semibold transition-colors">
                                                Add
                                            </button>
                                            <button onClick={() => { setCreating(null); setNewTaskTitle(''); }}
                                                className="p-1 text-slate-500 hover:text-white transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {colTasks(col.id).length === 0 && creating !== col.id && (
                                    <div className="flex items-center justify-center h-24 border-2 border-dashed border-slate-800 rounded-xl text-slate-600 text-xs">
                                        Drop tasks here
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KanbanBoard;
