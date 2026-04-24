import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, TrendingUp, CheckCircle, PauseCircle, AlertTriangle, Plus, Edit2, Trash2 } from 'lucide-react';
import projectsService from '../../../core/api/projectsService';
import GenericModal from '../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../core/components/shared/core/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const PROJECT_FIELDS = [
    { name: 'name', label: 'Project Name', required: true },
    { name: 'client', label: 'Client ID', type: 'number', required: true },
    { name: 'status', label: 'Status', type: 'select', options: [
        { value: 'planning', label: 'Planning' },
        { value: 'active', label: 'Active' },
        { value: 'on_hold', label: 'On Hold' },
        { value: 'completed', label: 'Completed' }
    ]},
    { name: 'priority', label: 'Priority', type: 'select', options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' }
    ]},
    { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
    { name: 'deadline', label: 'Deadline', type: 'date' }
];

const priorityDot = (p) => {
    const c = { low: 'bg-slate-400', medium: 'bg-blue-500', high: 'bg-amber-500', critical: 'bg-red-500' };
    return <span className={`w-2 h-2 rounded-full ${c[p] ?? 'bg-slate-500'} flex-shrink-0`} />;
};

const statusBadge = (status) => {
    const map = {
        planning: 'bg-blue-500/10 text-blue-400',
        active: 'bg-emerald-500/10 text-emerald-400',
        on_hold: 'bg-amber-500/10 text-amber-400',
        review: 'bg-violet-500/10 text-violet-400',
        completed: 'bg-slate-700 text-slate-400',
        cancelled: 'bg-red-500/10 text-red-400',
        backlog: 'bg-slate-700 text-slate-400',
    };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>{status?.replace('_', ' ')}</span>;
};

const COLOR_MAP = {
    cyan: 'text-cyan-400',
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400'
};

const ProjectsDashboard = () => {
    const [stats, setStats] = useState({});
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setLoading(true);
        Promise.all([
            projectsService.getStats().catch(() => ({})),
            projectsService.getProjects({ limit: 20 }).catch(() => ({ results: [] })),
        ]).then(([s, p]) => {
            setStats(s);
            setProjects(p?.results ?? p ?? []);
            setLoading(false);
        });
    };

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (selectedItem) {
                await projectsService.updateProject(selectedItem.id, formData);
                toast.success('Project updated');
            } else {
                await projectsService.createProject(formData);
                toast.success('Project created');
            }
            setIsModalOpen(false);
            setSelectedItem(null);
            loadData();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save project');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await projectsService.deleteProject(selectedItem.id);
            toast.success('Project deleted');
            setIsDeleteModalOpen(false);
            setSelectedItem(null);
            loadData();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete project');
        } finally {
            setActionLoading(false);
        }
    };

    const kpis = [
        { label: 'Total Projects', value: stats.total ?? 0, icon: FolderKanban, color: 'cyan' },
        { label: 'Active', value: stats.active ?? 0, icon: TrendingUp, color: 'emerald' },
        { label: 'Completed', value: stats.completed ?? 0, icon: CheckCircle, color: 'blue' },
        { label: 'On Hold', value: stats.on_hold ?? 0, icon: PauseCircle, color: 'amber' },
        { label: 'Overdue', value: stats.overdue ?? 0, icon: AlertTriangle, color: 'rose' },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <FolderKanban size={28} className="text-cyan-400" /> Project Management
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Service engagements, deliverables, and team assignments</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/admin/projects/kanban"
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-sm font-semibold transition-colors no-underline">
                        Kanban Board
                    </Link>
                    <button 
                        onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition-colors no-underline">
                        <Plus size={16} /> New Project
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {kpis.map(k => (
                    <div key={k.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                        <k.icon size={20} className={`${COLOR_MAP[k.color]} mb-2`} />
                        <p className="text-slate-400 text-xs uppercase tracking-wide">{k.label}</p>
                        <p className={`text-2xl font-bold ${COLOR_MAP[k.color]}`}>{k.value}</p>
                    </div>
                ))}
            </div>

            {/* Projects Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-800 flex justify-between">
                    <h2 className="text-sm font-bold text-white">All Projects</h2>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Deadline</th>
                            <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="py-16 text-center text-slate-500">Loading projects...</td></tr>
                        ) : projects.length === 0 ? (
                            <tr><td colSpan={7} className="py-20 text-center">
                                <FolderKanban size={32} className="mx-auto mb-3 text-slate-700" />
                                <p className="text-slate-500">No projects yet</p>
                                <button onClick={() => { setSelectedItem(null); setIsModalOpen(true); }} className="text-cyan-400 text-sm mt-2 inline-block hover:text-cyan-300 no-underline">Create your first project →</button>
                            </td></tr>
                        ) : projects.map(p => (
                            <tr key={p.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                                <td className="px-5 py-4">
                                    <Link to={`/admin/projects/${p.id}`} className="text-white font-semibold hover:text-cyan-400 transition-colors no-underline">
                                        {p.name}
                                    </Link>
                                    <p className="text-slate-500 text-xs mt-0.5">{p.project_type?.replace('_', ' ')}</p>
                                </td>
                                <td className="px-5 py-4 text-slate-300">{p.client_name}</td>
                                <td className="px-5 py-4">{statusBadge(p.status)}</td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        {priorityDot(p.priority)}
                                        <span className="text-slate-400 capitalize text-xs">{p.priority}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-cyan-500 rounded-full transition-all"
                                                style={{ width: `${p.progress ?? 0}%` }} />
                                        </div>
                                        <span className="text-slate-400 text-xs">{p.progress ?? 0}%</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-slate-400 text-xs">{p.deadline ?? '—'}</td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex justify-end gap-2 text-slate-400">
                                        <button onClick={() => { setSelectedItem(p); setIsModalOpen(true); }} className="hover:text-white transition-colors"><Edit2 size={16} /></button>
                                        <button onClick={() => { setSelectedItem(p); setIsDeleteModalOpen(true); }} className="hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedItem(null); }}
                title={selectedItem ? "Edit Project" : "New Project"}
                fields={PROJECT_FIELDS}
                initialData={selectedItem}
                onSubmit={handleSave}
                loading={actionLoading}
            />
            
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setSelectedItem(null); }}
                onConfirm={handleDelete}
                loading={actionLoading}
                title="Delete Project"
                message={`Are you sure you want to delete "${selectedItem?.name}"?`}
            />
        </div>
    );
};

export default ProjectsDashboard;
