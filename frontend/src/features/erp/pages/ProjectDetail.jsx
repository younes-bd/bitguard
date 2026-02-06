import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { erpService } from '../../../shared/core/services/erpService';
import {
    Calendar, CheckCircle, Clock,
    MessageSquare, MoreHorizontal, User,
    ArrowLeft, Plus, DollarSign, Activity
} from 'lucide-react';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [projData, tasksData] = await Promise.all([
                    erpService.getProject(id),
                    erpService.getProjectTasks(id)
                ]);
                setProject(projData);
                setTasks(Array.isArray(tasksData) ? tasksData : tasksData.results || []);
            } catch (error) {
                console.error("Failed to load project details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!project) return <div className="text-white">Project not found</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <button
                    onClick={() => navigate('/erp/projects')}
                    className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Projects
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
                        <div className="flex items-center space-x-4 text-slate-400">
                            <span className="flex items-center">
                                <User size={16} className="mr-2" />
                                {project.client_name || 'Internal'}
                            </span>
                            <span className="flex items-center">
                                <Calendar size={16} className="mr-2" />
                                Due {project.deadline}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs border ${project.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                                    'bg-blue-500/20 text-blue-400 border-blue-500/50'
                                }`}>
                                {project.status}
                            </span>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center shadow-lg shadow-blue-500/20">
                        <Plus size={18} className="mr-2" />
                        Add Task
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-xl border border-slate-700/50">
                    <p className="text-slate-400 text-xs uppercase font-medium mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-white flex items-center">
                        <DollarSign size={20} className="text-emerald-500 mr-1" />
                        {project.revenue}
                    </p>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-slate-700/50">
                    <p className="text-slate-400 text-xs uppercase font-medium mb-1">Budget</p>
                    <p className="text-2xl font-bold text-white flex items-center">
                        <DollarSign size={20} className="text-blue-500 mr-1" />
                        {project.budget_cost}
                    </p>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-slate-700/50">
                    <p className="text-slate-400 text-xs uppercase font-medium mb-1">Time Logged</p>
                    <p className="text-2xl font-bold text-white flex items-center">
                        <Clock size={20} className="text-purple-500 mr-1" />
                        0h 0m
                    </p>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-slate-700/50">
                    <p className="text-slate-400 text-xs uppercase font-medium mb-1">Tasks Completed</p>
                    <p className="text-2xl font-bold text-white flex items-center">
                        <CheckCircle size={20} className="text-green-500 mr-1" />
                        {tasks.filter(t => t.status === 'done').length} / {tasks.length}
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tasks List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-white">Tasks</h2>
                    <div className="space-y-2">
                        {tasks.length === 0 ? (
                            <div className="text-slate-400 italic">No tasks assigned yet.</div>
                        ) : (
                            tasks.map(task => (
                                <div key={task.id} className="glass-panel p-4 rounded-xl border border-slate-700/50 flex items-center justify-between group hover:border-slate-600 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' :
                                                task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                            }`}></div>
                                        <div>
                                            <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors cursor-pointer">{task.title}</h4>
                                            <p className="text-xs text-slate-400">Due {task.due_date} • {task.assigned_to_name || 'Unassigned'}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-lg ${task.status === 'done' ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-300'
                                        }`}>
                                        {task.status?.replace('_', ' ')}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                        <h3 className="text-lg font-bold text-white mb-4">Team</h3>
                        <div className="space-y-3">
                            {/* Mock Data for Team until API returns it */}
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                                        JD
                                    </div>
                                    <div>
                                        <p className="text-sm text-white">John Doe</p>
                                        <p className="text-xs text-slate-400">Developer</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;


