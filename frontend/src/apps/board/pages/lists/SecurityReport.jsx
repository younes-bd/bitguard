import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Activity, Lock, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { boardService } from '@/apps/board/api/boardService';

const SecurityReport = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ from_date: '', to_date: '' });

    const fetchReport = () => {
        setLoading(true);
        const params = {};
        if (dateRange.from_date) params.from_date = dateRange.from_date;
        if (dateRange.to_date) params.to_date = dateRange.to_date;
        
        boardService.getSecurityReport(params)
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
        { label: 'Total Alerts', value: data?.total_alerts ?? 0, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
        { label: 'Open Incidents', value: data?.open_incidents ?? 0, icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        { label: 'Resolved', value: data?.resolved_incidents ?? 0, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Endpoints', value: data?.endpoints_monitored ?? 0, icon: Lock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    ];

    const severities = data?.alerts_by_severity ?? { critical: 0, high: 0, medium: 0, low: 0 };
    const threatScore = data?.threat_score ?? 0;
    const threatColor = threatScore < 30 ? 'text-emerald-400' : threatScore < 60 ? 'text-amber-400' : 'text-red-400';
    const threatLabel = threatScore < 30 ? 'Low Risk' : threatScore < 60 ? 'Moderate Risk' : 'High Risk';

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-400">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <ShieldCheck size={22} className="text-emerald-400" /> Security Report
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">SOC activity, threat intelligence, and endpoint compliance</p>
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
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm transition-colors"
                    >
                        Filter
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-16 text-slate-500 flex flex-col items-center">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    Loading report data...
                </div>
            ) : (
                <>
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
                        {/* Alerts by Severity */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-white font-semibold mb-4">Alerts by Severity</h3>
                            <div className="h-48 mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart 
                                        data={Object.entries(severities).map(([name, value]) => ({ name, value }))} 
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
                                                Object.keys(severities).map((key, index) => {
                                                    const colors = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#475569' };
                                                    return <Cell key={`cell-${index}`} fill={colors[key] || '#3b82f6'} />;
                                                })
                                            }
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Threat Score Gauge */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center -translate-y-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Threat Score', value: threatScore },
                                                { name: 'Remaining', value: 100 - threatScore }
                                            ]}
                                            cx="50%"
                                            cy="70%"
                                            startAngle={180}
                                            endAngle={0}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={0}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            <Cell fill={threatScore < 30 ? '#10b981' : threatScore < 60 ? '#f59e0b' : '#ef4444'} />
                                            <Cell fill="#1e293b" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="relative z-10 pt-20">
                                <span className={`text-4xl font-bold ${threatColor}`}>{threatScore}</span>
                                <div className="text-white font-semibold text-lg mt-2">Threat Score</div>
                                <div className={`text-sm font-semibold mt-1 ${threatColor}`}>{threatLabel}</div>
                                <div className="text-slate-500 text-xs mt-2">Scale: 0 (safe) → 100 (critical)</div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SecurityReport;

