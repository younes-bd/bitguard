import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, Kanban, CheckCircle, Clock, Users,
    Calendar, Flag, CircleDot, Plus, Target,
    LayoutDashboard, ListTodo, Users2, Timer,
    MoreVertical, Edit2, Trash2, Shield, Info,
    PlusCircle, ExternalLink, ChevronRight
} from 'lucide-react';
import projectsService from '../../../core/api/projectsService';
import GenericModal from '../../../core/components/shared/forms/GenericModal';
import { toast } from 'react-hot-toast';

const STATUS_MAP = {
    planning: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    on_hold: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    review: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    completed: 'bg-slate-800 text-slate-400 border-slate-700',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${active 
            ? 'text-cyan-400 border-cyan-500 bg-cyan-500/5' 
            : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-900/50'}`}
    >
        <Icon size={14} />
        {label}
    </button>
);

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [members, setMembers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Modals
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const loadData = async () => {
        try {
            const [p, t, m, mem, l] = await Promise.all([
                projectsService.getProject(id),
                projectsService.getTasks({ project: id }),
                projectsService.getMilestones(id).catch(() => []),
                projectsService.getMembers(id).catch(() => []),
                projectsService.getTimeLogs({ project: id }).catch(() => []),
            ]);
            setProject(p);
            setTasks(t);
            setMilestones(m);
            setMembers(mem);
            setLogs(l);
        } catch (error) {
            toast.error("Failed to sync project telemetry");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleTaskSave = async (data) => {
        try {
            if (selectedItem) {
                await projectsService.updateTask(selectedItem.id, data);
                toast.success('Task updated');
            } else {
                await projectsService.createTask({ ...data, project: id });
                toast.success('New task created');
            }
            setIsTaskModalOpen(false);
            loadData();
        } catch (e) { toast.error('Action failed'); }
    };

    const handleMilestoneSave = async (data) => {
        try {
            await projectsService.createMilestone({ ...data, project: id });
            toast.success('Milestone added');
            setIsMilestoneModalOpen(false);
            loadData();
        } catch (e) { toast.error('Action failed'); }
    };

    const handleLogTime = async (data) => {
        try {
            await projectsService.logTime(data);
            toast.success('Time logged');
            setIsTimeModalOpen(false);
            loadData();
        } catch (e) { toast.error('Action failed'); }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest animate-pulse">Synchronizing Data...</p>
        </div>
    );

    if (!project) return <div className="p-8 text-slate-400">Security Access Error: Project Not Found.</div>;

    const totalHours = logs.reduce((sum, l) => sum + parseFloat(l.hours || 0), 0);
    const doneTasks = tasks.filter(t => t.status === 'done');

    return (
        <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
            {/* Context Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div className="space-y-4">
                    <Link to="/admin/projects" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-400 text-xs font-black uppercase tracking-widest no-underline transition-all">
                        <ArrowLeft size={14} /> Back to Portfolio
                    </Link>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-black text-white tracking-tighter font-['Outfit']">{project.name}</h1>
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border ${STATUS_MAP[project.status]}`}>
                            {project.status?.replace('_', ' ')}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsTimeModalOpen(true)}
                        className="px-6 py-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                    >
                        <Timer size={18} /> Log Time
                    </button>
                    <Link to={`/admin/projects/${id}/kanban`} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 no-underline shadow-lg shadow-cyan-900/20">
                        <Kanban size={18} /> Open Kanban
                    </Link>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-800">
                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={LayoutDashboard} label="Overview" />
                <TabButton active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} icon={ListTodo} label="Tasks" />
                <TabButton active={activeTab === 'milestones'} onClick={() => setActiveTab('milestones')} icon={Target} label="Milestones" />
                <TabButton active={activeTab === 'team'} onClick={() => setActiveTab('team')} icon={Users2} label="Team" />
                <TabButton active={activeTab === 'time'} onClick={() => setActiveTab('time')} icon={Timer} label="Time Analysis" />
            </div>

            <div className="mt-8">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Project Health Card */}
                            <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8">
                                <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Info size={16} /> Operational Summary
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Completion', value: `${project.progress ?? 0}%`, color: 'text-cyan-400' },
                                        { label: 'Tasks Done', value: `${doneTasks.length}/${tasks.length}`, color: 'text-emerald-400' },
                                        { label: 'Milestones', value: `${milestones.filter(m => m.is_completed).length}/${milestones.length}`, color: 'text-violet-400' },
                                        { label: 'Time Spent', value: `${totalHours.toFixed(1)}h`, color: 'text-amber-400' },
                                    ].map((m, i) => (
                                        <div key={i}>
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{m.label}</p>
                                            <p className={`text-2xl font-black ${m.color}`}>{m.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8">
                                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }} />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8">
                                <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Project Narrative</h3>
                                <p className="text-slate-300 leading-relaxed font-medium">
                                    {project.description || "No project documentation provided. Please update the project brief for team alignment."}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8">
                                <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Metadata</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Manager</span>
                                        <span className="text-xs text-white font-black">{project.manager_name ?? 'Unassigned'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Start Date</span>
                                        <span className="text-xs text-white font-black">{project.start_date ?? 'TBD'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Deadline</span>
                                        <span className="text-xs text-rose-400 font-black">{project.deadline ?? 'Not Set'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Type</span>
                                        <span className="text-xs text-cyan-400 font-black uppercase tracking-widest">{project.project_type?.replace('_', ' ')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                <ListTodo className="text-cyan-500" /> Backlog & Tasks
                            </h2>
                            <button 
                                onClick={() => { setSelectedItem(null); setIsTaskModalOpen(true); }}
                                className="px-4 py-2 bg-slate-800 hover:bg-cyan-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                            >
                                <Plus size={16} className="inline mr-2" /> Add Task
                            </button>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-900 border-b border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Task</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Assignee</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Priority</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {tasks.map(t => (
                                        <tr key={t.id} className="hover:bg-slate-800/20 transition-all group">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{t.title}</p>
                                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{t.id.substring(0,8)}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-700">
                                                        {t.assignee_name?.[0] ?? '?'}
                                                    </div>
                                                    <span className="text-xs text-slate-400">{t.assignee_name ?? 'Unassigned'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${t.priority === 'high' ? 'text-rose-400' : 'text-slate-500'}`}>
                                                    {t.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] font-black rounded uppercase tracking-widest border border-slate-700">
                                                    {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'milestones' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <div 
                            onClick={() => setIsMilestoneModalOpen(true)}
                            className="border-2 border-dashed border-slate-800 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all cursor-pointer group"
                        >
                            <PlusCircle size={40} className="group-hover:scale-110 transition-transform" />
                            <p className="font-black text-xs uppercase tracking-[0.2em]">Add Milestone</p>
                        </div>
                        {milestones.map(m => (
                            <div key={m.id} className={`bg-slate-900/50 border ${m.is_completed ? 'border-emerald-500/20' : 'border-slate-800'} rounded-[2rem] p-8 space-y-6 relative overflow-hidden group`}>
                                {m.is_completed && <div className="absolute top-0 right-0 p-4 text-emerald-500"><CheckCircle size={24} /></div>}
                                <div className="space-y-2">
                                    <h3 className={`text-xl font-black ${m.is_completed ? 'text-slate-500 line-through' : 'text-white'}`}>{m.name}</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Calendar size={14} /> Due: {m.due_date}
                                    </p>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{m.description || "Critical project checkpoint."}</p>
                                {!m.is_completed && (
                                    <button 
                                        onClick={() => projectsService.completeMilestone(m.id).then(loadData)}
                                        className="w-full py-3 bg-slate-800 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                                    >
                                        Seal Milestone
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                         <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all cursor-pointer group">
                            <Plus size={32} />
                            <p className="font-black text-xs uppercase tracking-[0.2em]">Add Specialist</p>
                        </div>
                        {members.map(mem => (
                            <div key={mem.id} className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 flex flex-col items-center text-center space-y-4 group">
                                <div className="w-20 h-20 rounded-[2rem] bg-slate-800 flex items-center justify-center text-2xl font-black text-cyan-500 border border-slate-700 group-hover:scale-110 transition-transform">
                                    {mem.full_name?.[0] ?? '?'}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white tracking-tight">{mem.full_name}</h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{mem.role || 'Contributor'}</p>
                                </div>
                                <div className="flex gap-2 w-full pt-4">
                                    <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-[10px] font-black uppercase transition-all">Profile</button>
                                    <button 
                                        onClick={() => projectsService.removeMember(id, mem.id).then(loadData)}
                                        className="py-2 px-3 bg-slate-800 hover:bg-rose-900/30 text-slate-600 hover:text-rose-400 rounded-lg transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'time' && (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
                            <h2 className="text-lg font-black text-white uppercase tracking-tighter">Utilization Registry</h2>
                            <span className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em]">{totalHours.toFixed(1)} Total Hours Logged</span>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/80">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Operator</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry Date</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Activity Description</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {logs.map(l => (
                                    <tr key={l.id} className="hover:bg-slate-800/20 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-700">
                                                    {l.user_name?.[0] ?? '?'}
                                                </div>
                                                <span className="text-xs font-bold text-white">{l.user_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-xs text-slate-500 font-mono">{l.date}</td>
                                        <td className="px-8 py-5 text-xs text-slate-400 italic">"{l.description || l.task_title || 'No description provided'}"</td>
                                        <td className="px-8 py-5 text-right font-black text-cyan-400 text-sm tracking-tighter">{l.hours}H</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modals */}
            <GenericModal 
                isOpen={isTaskModalOpen} 
                onClose={() => setIsTaskModalOpen(false)} 
                title="Task Definition" 
                fields={[
                    { name: 'title', label: 'Title', required: true },
                    { name: 'description', label: 'Description', type: 'textarea' },
                    { name: 'assignee', label: 'Assignee', type: 'select', options: members.map(m => ({ value: m.id || m.user_id, label: m.full_name || m.first_name ? `${m.first_name} ${m.last_name}` : (m.name || 'User') })) },
                    { name: 'priority', label: 'Priority', type: 'select', options: [
                        { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }
                    ], default: 'medium' },
                    { name: 'status', label: 'Status', type: 'select', options: [
                        { value: 'backlog', label: 'Backlog' },
                        { value: 'todo', label: 'To Do' },
                        { value: 'in_progress', label: 'In Progress' },
                        { value: 'review', label: 'In Review' },
                        { value: 'done', label: 'Done' }
                    ], default: 'todo' },
                    { name: 'due_date', label: 'Due Date', type: 'date' },
                    { name: 'estimated_hours', label: 'Estimated Hours', type: 'number', step: '0.5' }
                ]}
                onSubmit={handleTaskSave}
            />

            <GenericModal 
                isOpen={isMilestoneModalOpen} 
                onClose={() => setIsMilestoneModalOpen(false)} 
                title="Strategic Milestone" 
                fields={[
                    { name: 'name', label: 'Milestone Name', required: true },
                    { name: 'due_date', label: 'Target Date', type: 'date', required: true },
                    { name: 'description', label: 'Strategic Description', type: 'textarea' }
                ]}
                onSubmit={handleMilestoneSave}
            />

            <GenericModal 
                isOpen={isTimeModalOpen} 
                onClose={() => setIsTimeModalOpen(false)} 
                title="Log Operational Hours" 
                fields={[
                    { name: 'task', label: 'Task ID', type: 'number', required: true },
                    { name: 'date', label: 'Date', type: 'date', required: true },
                    { name: 'hours', label: 'Hours', type: 'number', required: true },
                    { name: 'description', label: 'Activity Brief', type: 'textarea' }
                ]}
                onSubmit={handleLogTime}
            />
        </div>
    );
};

export default ProjectDetail;
