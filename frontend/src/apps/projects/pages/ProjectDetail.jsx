import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, Kanban, CheckCircle, Clock, Users,
    Calendar, Flag, CircleDot, Plus, Target
} from 'lucide-react';
import projectsService from '../../../core/api/projectsService';

const statusBadge = (s) => {
    const map = {
        planning: 'bg-blue-500/10 text-blue-400', active: 'bg-emerald-500/10 text-emerald-400',
        on_hold: 'bg-amber-500/10 text-amber-400', review: 'bg-violet-500/10 text-violet-400',
        completed: 'bg-slate-700 text-slate-400', cancelled: 'bg-red-500/10 text-red-400',
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${map[s] ?? 'bg-slate-700 text-slate-400'}`}>{s?.replace('_', ' ')}</span>;
};

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [milestones, setMilestones] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            projectsService.getProject(id),
            projectsService.getMilestones(id).catch(() => []),
            projectsService.getTimeLogs({ project: id }).catch(() => []),
        ]).then(([p, m, l]) => {
            setProject(p);
            setMilestones(m);
            setLogs(l);
            setLoading(false);
        });
    }, [id]);

    const handleCompleteM = async (mid) => {
        await projectsService.completeMilestone(mid);
        setMilestones(prev => prev.map(m => m.id === mid ? { ...m, is_completed: true } : m));
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div>;
    if (!project) return <div className="p-8 text-slate-400">Project not found.</div>;

    const totalHours = logs.reduce((sum, l) => sum + parseFloat(l.hours || 0), 0);
    const tasks = project.tasks ?? [];
    const doneCount = tasks.filter(t => t.status === 'done').length;

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-400">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <Link to="/admin/projects" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-3 no-underline transition-colors">
                        <ArrowLeft size={14} /> All Projects
                    </Link>
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wide">{project.name}</h1>
                        {statusBadge(project.status)}
                    </div>
                    {project.description && <p className="text-slate-400 text-sm mt-2 max-w-2xl">{project.description}</p>}
                </div>
                <Link to={`/admin/projects/${id}/kanban`}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition-colors no-underline flex-shrink-0">
                    <Kanban size={16} /> Open Kanban
                </Link>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Progress', value: `${project.progress ?? 0}%`, icon: CircleDot, color: 'cyan' },
                    { label: 'Tasks Done', value: `${doneCount}/${tasks.length}`, icon: CheckCircle, color: 'emerald' },
                    { label: 'Hours Logged', value: `${totalHours.toFixed(1)}h`, icon: Clock, color: 'amber' },
                    { label: 'Milestones', value: `${milestones.filter(m => m.is_completed).length}/${milestones.length}`, icon: Target, color: 'violet' },
                ].map(m => (
                    <div key={m.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <m.icon size={18} className={`text-${m.color}-400 mb-2`} />
                        <p className="text-slate-400 text-xs uppercase tracking-wide">{m.label}</p>
                        <p className={`text-2xl font-bold text-${m.color}-400`}>{m.value}</p>
                    </div>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Overall Progress</span>
                    <span>{project.progress ?? 0}%</span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all"
                        style={{ width: `${Math.min(project.progress ?? 0, 100)}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-600 mt-1.5">
                    <span>Start: {project.start_date ?? '—'}</span>
                    <span>Deadline: {project.deadline ?? '—'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Milestones */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center">
                        <h2 className="text-sm font-bold text-white flex items-center gap-2"><Flag size={14} className="text-violet-400" /> Milestones</h2>
                        <span className="text-xs text-slate-500">{milestones.filter(m => m.is_completed).length}/{milestones.length} done</span>
                    </div>
                    <div className="divide-y divide-slate-800/50">
                        {milestones.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center py-8">No milestones yet</p>
                        ) : milestones.map(m => (
                            <div key={m.id} className="px-5 py-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={16} className={m.is_completed ? 'text-emerald-400' : 'text-slate-600'} />
                                    <div>
                                        <p className={`text-sm ${m.is_completed ? 'text-slate-500 line-through' : 'text-white'}`}>{m.name}</p>
                                        <p className="text-slate-500 text-xs">{m.due_date}</p>
                                    </div>
                                </div>
                                {!m.is_completed && (
                                    <button onClick={() => handleCompleteM(m.id)}
                                        className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                                        Mark done
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Time Logs */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center">
                        <h2 className="text-sm font-bold text-white flex items-center gap-2"><Clock size={14} className="text-amber-400" /> Time Logs</h2>
                        <span className="text-xs text-slate-500">Total: {totalHours.toFixed(1)}h</span>
                    </div>
                    <div className="divide-y divide-slate-800/50">
                        {logs.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center py-8">No time logged yet</p>
                        ) : logs.slice(0, 6).map(l => (
                            <div key={l.id} className="px-5 py-3 flex items-center justify-between">
                                <div>
                                    <p className="text-white text-sm">{l.user_name ?? 'Unknown'}</p>
                                    <p className="text-slate-500 text-xs">{l.description || l.task}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-amber-400 font-semibold text-sm">{l.hours}h</p>
                                    <p className="text-slate-500 text-xs">{l.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
