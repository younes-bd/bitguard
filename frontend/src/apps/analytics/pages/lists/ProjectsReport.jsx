import React, { useState, useEffect } from 'react';
import { FolderKanban, Activity, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import client from '../../../../core/api/client';
import toast from 'react-hot-toast';

export default function ProjectsReport() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ projects: [], timeLogs: [] });

    useEffect(() => {
        Promise.all([
            client.get('projects/').catch(() => ({ data: [] })),
            client.get('hrm/time-logs/', { params: { limit: 500 } }).catch(() => ({ data: [] }))
        ]).then(([projRes, timeRes]) => {
            const pData = projRes.data?.results || projRes.data;
            const tData = timeRes.data?.results || timeRes.data;
            setData({
                projects: Array.isArray(pData) ? pData : [],
                timeLogs: Array.isArray(tData) ? tData : []
            });
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading project analytics...</p>
        </div>
    );

    const statuses = {
        active: data.projects?.filter(p => p.status === 'in_progress')?.length || 0,
        completed: data.projects?.filter(p => p.status === 'completed')?.length || 0,
        atRisk: data.projects?.filter(p => p.status === 'at_risk' || p.status === 'delayed')?.length || 0,
    };

    const totalBillable = data.timeLogs?.filter(t => t.billable)?.reduce((sum, t) => sum + parseFloat(t.hours || 0), 0) || 0;
    const totalNonBillable = data.timeLogs?.filter(t => !t.billable)?.reduce((sum, t) => sum + parseFloat(t.hours || 0), 0) || 0;

    // Calculate budget vs actuals for active projects
    const projectBudgets = data.projects?.slice(0, 5)?.map(p => {
        const loggedHours = data.timeLogs?.filter(t => String(t.project) === String(p.id))?.reduce((s, t) => s + parseFloat(t.hours || 0), 0) || 0;
        const budget = p.estimated_hours || 0;
        const pct = budget > 0 ? Math.min(Math.round((loggedHours / budget) * 100), 100) : 0;
        return { name: p.name, logged: loggedHours, budget, pct, isOver: loggedHours > budget };
    }) || [];

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <FolderKanban className="text-cyan-400" size={28} /> Project Management Report
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Project health, utilization, and budget tracking</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2 text-slate-400"><Activity size={16} /> Total Active</div>
                    <p className="text-3xl font-black text-white">{statuses.active}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2 text-emerald-400"><CheckCircle size={16} /> Completed</div>
                    <p className="text-3xl font-black text-emerald-400">{statuses.completed}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2 text-rose-400"><AlertTriangle size={16} /> At Risk</div>
                    <p className="text-3xl font-black text-rose-400">{statuses.atRisk}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2 text-indigo-400"><Clock size={16} /> Billable Hrs</div>
                    <p className="text-3xl font-black text-indigo-400">{Math.round(totalBillable)}<span className="text-sm text-slate-500 ml-1">h</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-white mb-6">Budget vs Actuals (Top Active)</h3>
                    {projectBudgets.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-sm">No project data available.</div>
                    ) : (
                        <div className="space-y-5">
                            {projectBudgets.map((p, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300 font-medium">{p.name}</span>
                                        <span className={`${p.isOver ? 'text-rose-400' : 'text-slate-400'} font-bold`}>
                                            {p.logged} / {p.budget} hrs
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2">
                                        <div className={`${p.isOver ? 'bg-rose-500' : p.pct > 80 ? 'bg-amber-500' : 'bg-cyan-500'} h-2 rounded-full`} style={{ width: `${p.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                    <h3 className="text-sm font-bold text-white mb-6 w-full text-left">Billable vs Non-Billable Time</h3>
                    <div className="relative w-48 h-48 rounded-full border-[16px] border-slate-800 flex items-center justify-center mb-4">
                        <div className="absolute inset-0 border-[16px] border-indigo-500 rounded-full border-t-transparent border-l-transparent transform rotate-45"></div>
                        <div className="text-center">
                            <span className="block text-2xl font-black text-white">{totalBillable + totalNonBillable > 0 ? Math.round((totalBillable / (totalBillable + totalNonBillable)) * 100) : 0}%</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Billable</span>
                        </div>
                    </div>
                    <div className="flex gap-6 mt-2">
                        <div className="text-center">
                            <span className="block text-xl font-bold text-indigo-400">{Math.round(totalBillable)}h</span>
                            <span className="text-xs text-slate-500">Billable</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-xl font-bold text-slate-400">{Math.round(totalNonBillable)}h</span>
                            <span className="text-xs text-slate-500">Internal</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

