import React, { useEffect, useState } from 'react';
import { erpService } from '../../../shared/core/services/erpService';
import {
    Search, Plus, Filter, Calendar,
    MoreHorizontal, ArrowUpRight, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await erpService.getProjects();
            setProjects(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to load projects", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'planning': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'completed': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
            case 'on_hold': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
        }
    };

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Projects</h1>
                    <p className="text-slate-400">Manage your active projects and deliverables</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                    <Plus size={20} />
                    <span>New Project</span>
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search projects or clients..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-slate-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <Filter size={18} />
                    <span>Filter</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <Calendar size={18} />
                    <span>Timeline</span>
                </button>
            </div>

            {/* Projects Grid/List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredProjects.map((project) => (
                    <div key={project.id} className="glass-panel p-4 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-all group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                            {/* Project Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors cursor-pointer">
                                        {project.name}
                                    </h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                                        {project.status?.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                    <span className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                                        {project.client_name || 'Internal'}
                                    </span>
                                    <span>•</span>
                                    <span>Due {project.deadline || 'No Date'}</span>
                                </div>
                            </div>

                            {/* Metrics */}
                            <div className="flex items-center gap-6 md:pr-4">
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase font-medium">Revenue</p>
                                    <p className="text-white font-mono flex items-center justify-end gap-1">
                                        <DollarSign size={14} className="text-emerald-500" />
                                        {project.revenue}
                                    </p>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs text-slate-500 uppercase font-medium">Progress</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                        <span className="text-xs text-white">45%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                                <button
                                    onClick={() => navigate(`/erp/projects/${project.id}`)}
                                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                >
                                    <ArrowUpRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredProjects.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                            <Search size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-1">No projects found</h3>
                        <p className="text-slate-400">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectList;


