import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FolderKanban, TrendingUp, CheckCircle, PauseCircle, 
    AlertTriangle, Plus, Edit2, Trash2, Search, 
    Filter, MoreVertical, Calendar, Users, Clock 
} from 'lucide-react';
import projectsService from '../../../../core/api/projectsService';
import GenericModal from '../../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../../core/components/shared/core/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const PROJECT_FIELDS = [
    { name: 'name', label: 'Project Name', required: true },
    { name: 'client', label: 'Client ID', type: 'number', required: true },
    { name: 'project_type', label: 'Project Type', type: 'select', options: [
        { value: 'client', label: 'Client Project' },
        { value: 'internal', label: 'Internal' },
        { value: 'security', label: 'Security Assessment' },
        { value: 'infrastructure', label: 'Infrastructure' },
        { value: 'rd', label: 'R&D' }
    ]},
    { name: 'status', label: 'Status', type: 'select', options: [
        { value: 'planning', label: 'Planning' },
        { value: 'active', label: 'Active' },
        { value: 'on_hold', label: 'On Hold' },
        { value: 'review', label: 'In Review' },
        { value: 'completed', label: 'Completed' }
    ]},
    { name: 'priority', label: 'Priority', type: 'select', options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' }
    ]},
    { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
    { name: 'start_date', label: 'Start Date', type: 'date' },
    { name: 'deadline', label: 'Deadline', type: 'date' }
];

const StatusBadge = ({ status }) => {
    const map = {
        planning: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        on_hold: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        review: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
        completed: 'bg-slate-800 text-slate-400 border-slate-700',
        cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${map[status] ?? 'bg-slate-800 text-slate-400'}`}>
            {status?.replace('_', ' ')}
        </span>
    );
};

const PriorityTag = ({ priority }) => {
    const colors = {
        low: 'text-slate-400',
        medium: 'text-blue-400',
        high: 'text-amber-400',
        critical: 'text-rose-400'
    };
    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full bg-current ${colors[priority]}`} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${colors[priority]}`}>{priority}</span>
        </div>
    );
};

const ProjectsDashboard = () => {
    const [stats, setStats] = useState({});
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
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
            projectsService.getProjects({ limit: 50 }).catch(() => ({ results: [] })),
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
                toast.success('Project updated successfully');
            } else {
                await projectsService.createProject(formData);
                toast.success('New project initialized');
            }
            setIsModalOpen(false);
            setSelectedItem(null);
            loadData();
        } catch (error) {
            toast.error('Failed to commit project changes');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await projectsService.deleteProject(selectedItem.id);
            toast.success('Project purged from registry');
            setIsDeleteModalOpen(false);
            setSelectedItem(null);
            loadData();
        } catch (error) {
            toast.error('Failed to delete project');
        } finally {
            setActionLoading(false);
        }
    };

    const filteredProjects = projects.filter(p => 
        p.name?.toLowerCase().includes(search.toLowerCase()) || 
        p.client_name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4 font-['Outfit']">
                        <FolderKanban className="text-cyan-500" size={40} />
                        Project Portfolio
                    </h1>
                    <p className="text-slate-400 text-sm mt-1 max-w-2xl font-medium">
                        Global orchestration of service engagements, technical roadmaps, and delivery milestones.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button 
                        onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-cyan-900/20 active:scale-95"
                    >
                        <Plus size={20} /> Initialize Project
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: 'Portfolio Size', value: stats.total ?? 0, icon: FolderKanban, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                    { label: 'Active Sprints', value: stats.active ?? 0, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Completed', value: stats.completed ?? 0, icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Blocked / Hold', value: stats.on_hold ?? 0, icon: PauseCircle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Critical At Risk', value: stats.overdue ?? 0, icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                ].map((s, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 hover:border-slate-700 transition-all group">
                        <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <s.icon size={24} className={s.color} />
                        </div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{s.label}</p>
                        <p className={`text-3xl font-black text-white`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by project name, client, or technical lead..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all placeholder:text-slate-600 font-medium"
                    />
                </div>
                <button className="px-6 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400 hover:text-white flex items-center gap-2 transition-all">
                    <Filter size={20} />
                    <span className="font-bold text-sm uppercase tracking-widest">Advanced Filters</span>
                </button>
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-64 bg-slate-900/50 border border-slate-800 rounded-[2rem] animate-pulse" />
                    ))
                ) : filteredProjects.length === 0 ? (
                    <div className="col-span-full py-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto border border-slate-800">
                            <FolderKanban size={32} className="text-slate-700" />
                        </div>
                        <p className="text-slate-500 font-medium">No projects found matching your search parameters.</p>
                    </div>
                ) : filteredProjects.map(p => (
                    <div key={p.id} className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 hover:border-cyan-500/30 transition-all group relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-0 right-0 p-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                            <button 
                                onClick={() => { setSelectedItem(p); setIsModalOpen(true); }}
                                className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button 
                                onClick={() => { setSelectedItem(p); setIsDeleteModalOpen(true); }}
                                className="p-3 bg-slate-800 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-700 hover:border-rose-500/50 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <StatusBadge status={p.status} />
                                <PriorityTag priority={p.priority} />
                            </div>

                            <div>
                                <Link to={`/admin/projects/${p.id}`} className="text-xl font-black text-white hover:text-cyan-400 transition-colors no-underline block tracking-tight">
                                    {p.name}
                                </Link>
                                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">{p.client_name ?? 'Internal Operation'}</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progress Metrics</span>
                                    <span className="text-sm font-black text-white">{p.progress ?? 0}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000" 
                                        style={{ width: `${p.progress ?? 0}%` }}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-800/50 flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {Array(3).fill(0).map((_, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                                        +4
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                                    <Calendar size={12} /> {p.deadline ?? 'No Deadline'}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedItem(null); }}
                title={selectedItem ? "Modify Project Record" : "Initialize New Engagement"}
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
                title="Purge Project Record"
                message={`This will permanently remove "${selectedItem?.name}" and all associated task history. Are you sure?`}
            />
        </div>
    );
};

export default ProjectsDashboard;

