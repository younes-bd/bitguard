import React, { useState, useEffect } from 'react';
import { Timer, Search, Filter, Calendar, Download, Clock, DollarSign, Activity, ChevronRight, MoreVertical, Terminal } from 'lucide-react';
import projectsService from '../../api/projectsService';
import { toast } from 'react-hot-toast';

const GlobalTimeTracking = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const loadData = async () => {
        try {
            const data = await projectsService.getTimeLogs();
            setLogs(data);
        } catch (error) {
            toast.error("Failed to sync time registry");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const totalHours = logs.reduce((s, l) => s + parseFloat(l.hours || 0), 0);
    const billableHours = logs.filter(l => l.is_billable).reduce((s, l) => s + parseFloat(l.hours || 0), 0);

    const filteredLogs = logs.filter(l => 
        l.user_name?.toLowerCase().includes(search.toLowerCase()) || 
        l.description?.toLowerCase().includes(search.toLowerCase()) ||
        l.task_title?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest animate-pulse">Aggregating Time Registry...</p>
        </div>
    );

    return (
        <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4 font-['Outfit']">
                        <Timer className="text-amber-500" size={40} />
                        Utilization Registry
                    </h1>
                    <p className="text-slate-400 text-sm mt-1 max-w-2xl font-medium">
                        Global repository of logged operational hours across the entire project portfolio.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95">
                    <Download size={20} /> Export Audit Data
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Cumulative Hours', value: `${totalHours.toFixed(1)}H`, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Billable Value', value: `${billableHours.toFixed(1)}H`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Active Logs', value: logs.length, icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                    { label: 'System Health', value: 'Nominal', icon: Terminal, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                ].map((s, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 group hover:border-slate-700 transition-all">
                        <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <s.icon size={24} className={s.color} />
                        </div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{s.label}</p>
                        <p className="text-3xl font-black text-white">{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search logs by operator, task, or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white focus:ring-2 focus:ring-amber-500/50 outline-none transition-all placeholder:text-slate-600 font-medium"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-6 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400 hover:text-white flex items-center gap-2 transition-all">
                        <Filter size={20} />
                        <span className="font-bold text-sm uppercase tracking-widest">Filter</span>
                    </button>
                    <button className="px-6 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400 hover:text-white flex items-center gap-2 transition-all">
                        <Calendar size={20} />
                        <span className="font-bold text-sm uppercase tracking-widest">Date</span>
                    </button>
                </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-[3rem] overflow-hidden backdrop-blur-xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 border-b border-slate-800">
                        <tr>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Operator & Task</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Duration</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {filteredLogs.map(l => (
                            <tr key={l.id} className="hover:bg-slate-800/20 transition-all group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-xs font-black text-amber-500 border border-slate-700">
                                            {l.user_name?.[0] ?? '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white">{l.user_name}</p>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{l.task_title || 'General Operation'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-xs text-slate-400 italic max-w-md line-clamp-1 group-hover:line-clamp-none transition-all cursor-help">
                                        "{l.description || 'No detailed entry provided.'}"
                                    </p>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${l.is_billable ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                                        {l.is_billable ? 'Billable' : 'Internal'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-[10px] text-slate-500 font-mono uppercase tracking-widest">{l.date}</td>
                                <td className="px-8 py-6 text-right">
                                    <span className="text-xl font-black text-white tracking-tighter">{l.hours}<span className="text-[10px] text-slate-500 ml-0.5">H</span></span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredLogs.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <Clock className="mx-auto text-slate-800" size={64} />
                        <h3 className="text-xl font-bold text-slate-500">No Registry Entries Found</h3>
                        <p className="text-slate-600 text-sm max-w-xs mx-auto">The time tracking repository is currently empty or matches no active filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalTimeTracking;

