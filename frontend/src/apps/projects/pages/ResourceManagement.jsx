import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, TrendingUp, AlertCircle, Clock, CheckCircle2, MoreVertical, LayoutGrid, Calendar, ChevronRight } from 'lucide-react';
import projectsService from '../../../core/api/projectsService';
import { iamService } from '../../../core/api/iamService';
import { toast } from 'react-hot-toast';

const ResourceManagement = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const loadData = async () => {
        try {
            // Fetch all users and then map their tasks
            const users = await iamService.getUsers();
            const allTasks = await projectsService.getTasks();
            
            const resourceData = users.map(user => {
                const userTasks = allTasks.filter(t => t.assignee === user.id);
                const activeTasks = userTasks.filter(t => t.status !== 'done');
                const load = activeTasks.reduce((sum, t) => sum + parseFloat(t.estimated_hours || 0), 0);
                
                return {
                    ...user,
                    tasksCount: userTasks.length,
                    activeTasksCount: activeTasks.length,
                    workloadHours: load,
                    utilization: Math.min(100, (load / 40) * 100) // Assuming 40h week
                };
            });

            setResources(resourceData);
        } catch (error) {
            toast.error("Failed to sync resource grid");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredResources = resources.filter(r => 
        r.full_name?.toLowerCase().includes(search.toLowerCase()) || 
        r.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest animate-pulse">Analyzing Resource Load...</p>
        </div>
    );

    return (
        <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4 font-['Outfit']">
                        <Users className="text-emerald-500" size={40} />
                        Resource Loading
                    </h1>
                    <p className="text-slate-400 text-sm mt-1 max-w-2xl font-medium">
                        Real-time visualization of team bandwidth, task allocation, and operational utilization.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Specialists', value: resources.length, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Avg Utilization', value: `${Math.round(resources.reduce((s, r) => s + r.utilization, 0) / resources.length || 0)}%`, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                    { label: 'Pending Hours', value: resources.reduce((s, r) => s + r.workloadHours, 0), icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Overloaded', value: resources.filter(r => r.utilization > 90).length, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                ].map((s, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 group">
                        <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-4`}>
                            <s.icon size={24} className={s.color} />
                        </div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{s.label}</p>
                        <p className="text-3xl font-black text-white">{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Filter by name, skill, or department..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-600 font-medium"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredResources.map(r => (
                    <div key={r.id} className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 space-y-6 hover:border-emerald-500/30 transition-all backdrop-blur-sm relative overflow-hidden group">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-800 flex items-center justify-center text-xl font-black text-emerald-500 border border-slate-700">
                                {r.full_name?.[0] ?? '?'}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight">{r.full_name}</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{r.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Load Factor</span>
                                <span className={`text-sm font-black ${r.utilization > 90 ? 'text-rose-400' : 'text-emerald-400'}`}>{Math.round(r.utilization)}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ${r.utilization > 90 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} 
                                    style={{ width: `${r.utilization}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/50">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Active Tasks</p>
                                <p className="text-xl font-black text-white">{r.activeTasksCount}</p>
                            </div>
                            <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/50">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Total Hours</p>
                                <p className="text-xl font-black text-white">{r.workloadHours}H</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                            <button className="text-xs font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-widest transition-all flex items-center gap-2">
                                View Workflow <ChevronRight size={14} />
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">Available</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResourceManagement;
