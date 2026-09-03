import React, { useState, useEffect } from 'react';
import { FolderKanban, Activity, CheckCircle, AlertTriangle, Clock, Calendar } from 'lucide-react';
import boardService from '@/apps/board/api/boardService';

export default function ProjectsReport() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        total_projects: 0,
        active_projects: 0,
        tasks_by_status: {},
        overdue_tasks: 0,
        total_logged_hours: 0
    });
    const [dateRange, setDateRange] = useState({ from_date: '', to_date: '' });

    const fetchReport = () => {
        setLoading(true);
        const params = {};
        if (dateRange.from_date) params.from_date = dateRange.from_date;
        if (dateRange.to_date) params.to_date = dateRange.to_date;

        boardService.getProjectsReport(params)
            .then((res) => {
                if (res) setData(res);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const handleFilter = () => {
        fetchReport();
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading project analytics...</p>
        </div>
    );

    const taskStatuses = Object.entries(data.tasks_by_status || {});
    const totalTasks = taskStatuses.reduce((acc, [_, count]) => acc + count, 0);

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <FolderKanban className="text-cyan-400" size={28} /> Project Management Report
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Project health, utilization, and task tracking</p>
                </div>

                {/* Date Filter */}
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl">
                    <div className="flex items-center px-2">
                        <Calendar size={16} className="text-slate-400 mr-2" />
                        <input 
                            type="date" 
                            className="bg-transparent text-sm text-white border-none outline-none"
                            value={dateRange.from_date}
                            onChange={e => setDateRange({...dateRange, from_date: e.target.value})}
                        />
                    </div>
                    <span className="text-slate-600">-</span>
                    <div className="flex items-center px-2">
                        <input 
                            type="date" 
                            className="bg-transparent text-sm text-white border-none outline-none"
                            value={dateRange.to_date}
                            onChange={e => setDateRange({...dateRange, to_date: e.target.value})}
                        />
                    </div>
                    <button 
                        onClick={handleFilter}
                        className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm transition-colors"
                    >
                        Filter
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2 text-slate-400"><FolderKanban size={16} /> Total Projects</div>
                    <p className="text-3xl font-black text-white">{data.total_projects}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2 text-cyan-400"><Activity size={16} /> Active Projects</div>
                    <p className="text-3xl font-black text-cyan-400">{data.active_projects}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2 text-rose-400"><AlertTriangle size={16} /> Overdue Tasks</div>
                    <p className="text-3xl font-black text-rose-400">{data.overdue_tasks}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2 text-indigo-400"><Clock size={16} /> Total Logged Hrs</div>
                    <p className="text-3xl font-black text-indigo-400">{Math.round(data.total_logged_hours)}<span className="text-sm text-slate-500 ml-1">h</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                        <CheckCircle size={18} className="text-emerald-400" /> Tasks Breakdown By Status
                    </h3>
                    {taskStatuses.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">No tasks data available.</div>
                    ) : (
                        <div className="space-y-4 mt-4">
                            {taskStatuses.map(([status, count], i) => {
                                const pct = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-300 font-medium capitalize">{status.replace('_', ' ')}</span>
                                            <span className="text-cyan-400 font-bold">{count} <span className="text-slate-500 font-normal">({pct}%)</span></span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                                            <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                    <h3 className="text-sm font-bold text-white mb-6 w-full text-left">Overall Task Completion</h3>
                    <div className="relative w-48 h-48 rounded-full border-[16px] border-slate-800 flex items-center justify-center mb-4">
                        <div className="absolute inset-0 border-[16px] border-emerald-500 rounded-full border-t-transparent border-l-transparent transform rotate-45"></div>
                        <div className="text-center">
                            <span className="block text-2xl font-black text-white">{totalTasks > 0 ? Math.round(((data.tasks_by_status['done'] || 0) / totalTasks) * 100) : 0}%</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Done</span>
                        </div>
                    </div>
                    <div className="flex gap-6 mt-2">
                        <div className="text-center">
                            <span className="block text-xl font-bold text-emerald-400">{data.tasks_by_status['done'] || 0}</span>
                            <span className="text-xs text-slate-500">Completed</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-xl font-bold text-slate-400">{totalTasks}</span>
                            <span className="text-xs text-slate-500">Total Tasks</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

