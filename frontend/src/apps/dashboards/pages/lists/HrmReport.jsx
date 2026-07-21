import React, { useState, useEffect } from 'react';
import { Users, UserMinus, Clock, Award, BarChart3, Calendar } from 'lucide-react';
import client from '../../../../core/api/client';

export default function HrmReport() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        headcount_by_dept: [],
        expiring_certs: [],
        time_tracking: []
    });

    const [dateRange, setDateRange] = useState({ from_date: '', to_date: '' });

    const fetchReport = () => {
        setLoading(true);
        const params = {};
        if (dateRange.from_date) params.created_at__gte = dateRange.from_date;
        if (dateRange.to_date) params.created_at__lte = dateRange.to_date;

        Promise.all([
            client.get('hrm/employees/').catch(() => ({ data: [] })),
            client.get('hrm/certifications/', { params: { expiring_soon: true } }).catch(() => ({ data: [] })),
            client.get('projects/time-logs/', { params }).catch(() => ({ data: [] }))
        ]).then(([empRes, certRes, timeRes]) => {
            const employees = empRes.data?.results || empRes.data || [];
            
            // Calculate headcount by dept
            const depts = {};
            employees.forEach(e => {
                const dept = e.department || 'Unassigned';
                depts[dept] = (depts[dept] || 0) + 1;
            });
            const headcount = Object.entries(depts).map(([dept, count]) => ({ dept, count }));

            setData({
                headcount_by_dept: headcount,
                expiring_certs: certRes.data?.results || certRes.data || [],
                time_tracking: timeRes.data?.results || timeRes.data || []
            });
        }).finally(() => setLoading(false));
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

    const totalHeadcount = data.headcount_by_dept.reduce((sum, d) => sum + d.count, 0);

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Headcount by Department */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Users size={18} className="text-violet-400" />
                        <h3 className="text-sm font-bold text-white">Headcount by Dept</h3>
                    </div>
                    <div className="space-y-4">
                        {data.headcount_by_dept.map((d, i) => {
                            const pct = Math.round((d.count / totalHeadcount) * 100);
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
                    <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Employees</span>
                        <span className="text-2xl font-black text-white">{totalHeadcount}</span>
                    </div>
                </div>

                {/* Expiring Certifications */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Award size={18} className="text-amber-400" />
                        <h3 className="text-sm font-bold text-white">Certifications Expiring (60 Days)</h3>
                    </div>
                    {data.expiring_certs.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
                            No certifications expiring soon.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {data.expiring_certs.map((c, i) => (
                                <div key={i} className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-amber-300 text-sm font-bold">{c.name}</p>
                                        <span className="text-[10px] font-black uppercase text-amber-500">{c.expiry_date}</span>
                                    </div>
                                    <p className="text-slate-400 text-xs">Employee: {c.employee_name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Time Logs */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock size={18} className="text-emerald-400" />
                        <h3 className="text-sm font-bold text-white">Recent Time Tracking</h3>
                    </div>
                    {data.time_tracking.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
                            No recent time logs.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {data.time_tracking.slice(0, 5).map((t, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0">
                                    <div>
                                        <p className="text-white text-sm font-medium">{t.employee_name}</p>
                                        <p className="text-slate-500 text-xs">{t.date}</p>
                                    </div>
                                    <span className="text-emerald-400 font-bold text-sm">{t.hours}h</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

