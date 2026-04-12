import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertCircle, PieChart, Activity } from 'lucide-react';
import projectsService from '../../../core/api/projectsService';

const ProjectReports = () => {
    const [stats, setStats] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, projectsData] = await Promise.all([
                    projectsService.getStats(),
                    projectsService.getProjects()
                ]);
                setStats(statsData.data || statsData);
                setProjects(Array.isArray(projectsData.data) ? projectsData.data : projectsData.results || projectsData || []);
            } catch (error) {
                console.error("Fetch Reports Error:", error);
            } finally {
                setLoading(true); // Wait, should be false
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 font-['Oswald'] tracking-wider uppercase">Project Insights</h1>
                    <p className="text-slate-400 text-sm">Real-time performance metrics and delivery velocity</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition-colors">Export PDF</button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors">Share Report</button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-panel p-5 rounded-xl border border-slate-700/50 bg-slate-900/40">
                    <Activity className="text-blue-400 mb-3" size={20} />
                    <div className="text-2xl font-bold text-white">{projects.length}</div>
                    <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mt-1">Total Projects</div>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-slate-700/50 bg-slate-900/40">
                    <CheckCircle2 className="text-emerald-400 mb-3" size={20} />
                    <div className="text-2xl font-bold text-white">{projects.filter(p => p.status === 'completed').length}</div>
                    <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mt-1">Completed</div>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-slate-700/50 bg-slate-900/40">
                    <Clock className="text-amber-400 mb-3" size={20} />
                    <div className="text-2xl font-bold text-white">{projects.filter(p => p.status === 'in_progress').length}</div>
                    <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mt-1">In Progress</div>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-slate-700/50 bg-slate-900/40">
                    <AlertCircle className="text-red-400 mb-3" size={20} />
                    <div className="text-2xl font-bold text-white">{projects.filter(p => p.priority === 'high' && p.status !== 'completed').length}</div>
                    <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mt-1">At Risk</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Progress Table */}
                <div className="glass-panel rounded-xl border border-slate-700/50 bg-slate-900/40 overflow-hidden">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <TrendingUp size={18} className="text-blue-400" />
                            Delivery Status
                        </h3>
                    </div>
                    <div className="p-4 space-y-4">
                        {projects.slice(0, 5).map(project => (
                            <div key={project.id} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-300 font-medium">{project.name}</span>
                                    <span className="text-slate-500">{project.progress || 0}%</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-1.5">
                                    <div 
                                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                                        style={{ width: `${project.progress || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Report Insights Placeholder */}
                <div className="glass-panel rounded-xl border border-slate-700/50 bg-slate-900/40 p-6 flex flex-col justify-center items-center text-center">
                    <PieChart size={48} className="text-slate-700 mb-4" />
                    <h3 className="text-white font-bold mb-2">Detailed Velocity Metrics</h3>
                    <p className="text-slate-500 text-sm max-w-xs">
                        Velocity tracking and sprint analytics are generated based on historical task completion data.
                    </p>
                    <button className="mt-6 px-4 py-2 border border-slate-700 text-slate-400 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                        Configure Thresholds
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectReports;
