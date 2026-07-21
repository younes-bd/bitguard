import React, { useState, useEffect } from 'react';
import { LifeBuoy, Clock, CheckCircle, AlertTriangle, TrendingDown, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyticsService } from '../../../../core/api/analyticsService';

const SupportReport = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ from_date: '', to_date: '' });

    const fetchReport = () => {
        setLoading(true);
        const params = {};
        if (dateRange.from_date) params.from_date = dateRange.from_date;
        if (dateRange.to_date) params.to_date = dateRange.to_date;
        
        analyticsService.getSupportReport(params)
            .then(res => { setData(res || {}); setLoading(false); })
            .catch(() => { setData({}); setLoading(false); });
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const handleFilter = () => {
        fetchReport();
    };

    const kpis = [
        { label: 'Total Tickets', value: data?.total_tickets ?? 0, icon: LifeBuoy, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Open', value: data?.open ?? 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Resolved', value: data?.resolved_tickets ?? 0, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'SLA Compliance', value: `${data?.sla_compliance_rate ?? 0}%`, icon: TrendingDown, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    ];

    const priorities = data?.tickets_by_priority ?? { critical: 0, high: 0, medium: 0, low: 0 };
    const avgResHrs = data?.avg_resolution_hours ?? 0;
    const isSlaMet = avgResHrs <= 8;

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-400">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <LifeBuoy size={22} className="text-blue-400" /> Support Report
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Help desk performance and SLA compliance overview</p>
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
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
                    >
                        Filter
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-16 text-slate-500 flex flex-col items-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    Loading report data...
                </div>
            ) : (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {kpis.map(kpi => (
                            <div key={kpi.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                                <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center mb-3`}>
                                    <kpi.icon size={20} className={kpi.color} />
                                </div>
                                <div className="text-2xl font-bold text-white">{kpi.value}</div>
                                <div className="text-slate-400 text-sm">{kpi.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* By Priority */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-white font-semibold mb-4">Tickets by Priority</h3>
                            <div className="h-48 mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart 
                                        data={Object.entries(priorities).map(([name, value]) => ({ name, value }))} 
                                        layout="vertical" 
                                        margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="name" width={70} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} style={{ textTransform: 'capitalize' }} />
                                        <Tooltip 
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
                                        />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                            {
                                                Object.keys(priorities).map((key, index) => {
                                                    const colors = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#475569' };
                                                    return <Cell key={`cell-${index}`} fill={colors[key] || '#3b82f6'} />;
                                                })
                                            }
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Avg Resolution */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                            <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-4 ${isSlaMet ? 'border-emerald-500/30' : 'border-amber-500/30'}`}>
                                <span className={`text-3xl font-bold ${isSlaMet ? 'text-emerald-400' : 'text-amber-400'}`}>{avgResHrs}h</span>
                            </div>
                            <div className="text-white font-semibold text-lg">Avg. Resolution Time</div>
                            <div className="text-slate-500 text-sm mt-1">Industry benchmark: &lt; 8 hours</div>
                            {isSlaMet ? (
                                <div className="mt-3 text-emerald-400 text-sm font-semibold">✓ Within SLA target</div>
                            ) : (
                                <div className="mt-3 text-amber-400 text-sm font-semibold">⚠️ Needs Improvement</div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SupportReport;

