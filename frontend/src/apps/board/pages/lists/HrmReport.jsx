import React, { useState, useEffect } from 'react';
import { Users, UserMinus, Clock, Award, BarChart3, Calendar } from 'lucide-react';
import boardService from '@/apps/board/api/boardService';

export default function HrmReport() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        total_employees: 0,
        headcount_by_dept: [],
        on_leave_today: 0,
        expiring_certs_30d: 0,
        new_hires_30d: 0
    });

    const [dateRange, setDateRange] = useState({ from_date: '', to_date: '' });

    const fetchReport = () => {
        setLoading(true);
        const params = {};
        if (dateRange.from_date) params.from_date = dateRange.from_date;
        if (dateRange.to_date) params.to_date = dateRange.to_date;

        boardService.getHrmData(params)
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
            <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading HR metrics...</p>
        </div>
    );

    const totalHeadcount = data.total_employees;

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <BarChart3 className="text-violet-400" size={28} /> HR & People Report
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Headcount, leave utilization, and certification tracking</p>
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
                        className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm transition-colors"
                    >
                        Filter
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">Total Headcount</p>
                    <p className="text-3xl font-black text-violet-400 relative z-10">{data.total_employees}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">On Leave Today</p>
                    <p className="text-3xl font-black text-emerald-400 relative z-10">{data.on_leave_today}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">Expiring Certs (30d)</p>
                    <p className="text-3xl font-black text-amber-400 relative z-10">{data.expiring_certs_30d}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">New Hires (30d)</p>
                    <p className="text-3xl font-black text-blue-400 relative z-10">{data.new_hires_30d}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Headcount by Department */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Users size={18} className="text-violet-400" />
                        <h3 className="text-sm font-bold text-white">Headcount by Dept</h3>
                    </div>
                    {data.headcount_by_dept.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
                            No department data.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data.headcount_by_dept.map((d, i) => {
                                const pct = totalHeadcount > 0 ? Math.round((d.count / totalHeadcount) * 100) : 0;
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-400 font-medium">{d.dept}</span>
                                            <span className="text-white font-bold">{d.count} <span className="text-slate-500 font-normal">({pct}%)</span></span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                                            <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

