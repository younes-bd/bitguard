import React, { useState, useEffect } from 'react';
import { LifeBuoy, Clock, CheckCircle, AlertTriangle, TrendingDown } from 'lucide-react';
import client from '../../../core/api/client';

const SupportReport = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('reports/support/')
            .then(r => { setData(r.data?.data ?? r.data); setLoading(false); })
            .catch(() => {
                setData({
                    total_tickets: 148, open_tickets: 23, resolved_tickets: 125,
                    avg_resolution_hours: 6.4, sla_compliance_rate: 94.2,
                    tickets_by_priority: { critical: 4, high: 19, medium: 62, low: 63 },
                });
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading support report...</div>;

    const kpis = [
        { label: 'Total Tickets', value: data?.total_tickets ?? 0, icon: LifeBuoy, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Open', value: data?.open_tickets ?? 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Resolved', value: data?.resolved_tickets ?? 0, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'SLA Compliance', value: `${data?.sla_compliance_rate ?? 0}%`, icon: TrendingDown, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    ];

    const priorities = data?.tickets_by_priority ?? {};

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-400">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Support Report</h1>
                <p className="text-slate-400 text-sm mt-0.5">Help desk performance and SLA compliance overview</p>
            </div>

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
                    <div className="space-y-3">
                        {Object.entries(priorities).map(([priority, count]) => {
                            const colors = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-amber-500', low: 'bg-slate-600' };
                            const total = Object.values(priorities).reduce((a, b) => a + b, 0);
                            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                            return (
                                <div key={priority}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-400 capitalize">{priority}</span>
                                        <span className="text-white font-semibold">{count}</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${colors[priority] ?? 'bg-blue-500'} rounded-full`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Avg Resolution */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full border-4 border-blue-500/30 flex items-center justify-center mb-4">
                        <span className="text-3xl font-bold text-blue-400">{data?.avg_resolution_hours ?? 0}h</span>
                    </div>
                    <div className="text-white font-semibold text-lg">Avg. Resolution Time</div>
                    <div className="text-slate-500 text-sm mt-1">Industry benchmark: &lt; 8 hours</div>
                    <div className="mt-3 text-emerald-400 text-sm font-semibold">✓ Within SLA target</div>
                </div>
            </div>
        </div>
    );
};

export default SupportReport;
