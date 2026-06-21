import React, { useState, useEffect } from 'react';
import { 
    BarChart3, TrendingUp, Clock, CheckCircle2, 
    AlertCircle, PieChart, Activity, Download, 
    Calendar, Filter, ChevronRight, Zap
} from 'lucide-react';
import projectsService from '../../../../core/api/projectsService';
import { toast } from 'react-hot-toast';

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
                setStats(statsData);
                setProjects(Array.isArray(projectsData) ? projectsData : projectsData.results || []);
            } catch (error) {
                toast.error("Failed to aggregate reporting metrics");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest animate-pulse">Generating Intelligence...</p>
        </div>
    );

    return (
        <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4 font-['Outfit']">
                        <BarChart3 className="text-violet-500" size={40} />
                        Project Insights
                    </h1>
                    <p className="text-slate-400 text-sm mt-1 max-w-2xl font-medium">
                        Advanced analytics and delivery velocity metrics for the entire project lifecycle.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-2xl font-bold transition-all flex items-center gap-2">
                        <Download size={20} /> Export Audit Report
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Portfolio', value: projects.length, icon: Activity, color: 'text-violet-400', bg: 'bg-violet-500/10' },
                    { label: 'Delivery Success', value: projects.filter(p => p.status === 'completed').length, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Avg Velocity', value: `${Math.round(projects.reduce((s,p) => s + (p.progress || 0), 0) / (projects.length || 1))}%`, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Critical Risk', value: projects.filter(p => p.priority === 'high' && p.status !== 'completed').length, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                ].map((s, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 group">
                        <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <s.icon size={24} className={s.color} />
                        </div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{s.label}</p>
                        <p className="text-3xl font-black text-white">{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Delivery Momentum */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp size={16} className="text-emerald-400" /> Delivery Momentum
                        </h3>
                    </div>
                    <div className="p-8 space-y-8">
                        {projects.slice(0, 5).map(p => (
                            <div key={p.id} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-black text-slate-300 uppercase tracking-tight">{p.name}</span>
                                    <span className="text-xs font-black text-cyan-400">{p.progress || 0}%</span>
                                </div>
                                <div className="w-full bg-slate-800/50 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(6,182,212,0.4)]" 
                                        style={{ width: `${p.progress || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {projects.length === 0 && <p className="text-center text-slate-600 py-10">No data available for momentum analysis.</p>}
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 bg-violet-500/10 rounded-full flex items-center justify-center border border-violet-500/20">
                        <PieChart size={40} className="text-violet-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-white tracking-tight">Deployment Topology</h3>
                        <p className="text-slate-500 text-sm max-w-xs font-medium leading-relaxed">
                            A breakdown of the project distribution across various operational stages and delivery phases.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm pt-4">
                        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Active</p>
                            <p className="text-xl font-black text-emerald-400">{projects.filter(p => p.status === 'active').length}</p>
                        </div>
                        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Planning</p>
                            <p className="text-xl font-black text-blue-400">{projects.filter(p => p.status === 'planning').length}</p>
                        </div>
                    </div>
                    <button className="text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-all group pt-4">
                        Configure Analytical Thresholds <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectReports;

