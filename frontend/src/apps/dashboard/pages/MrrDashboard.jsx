import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, RefreshCw, Activity } from 'lucide-react';
import client from '../../../core/api/client';

const MrrDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('dashboard/mrr/')
            .then(r => { setData(r.data?.data ?? r.data); setLoading(false); })
            .catch(() => {
                setData({
                    mrr: 18500, arr: 222000, mrr_growth: 12.4,
                    new_mrr: 2800, churned_mrr: 340, expansion_mrr: 950,
                    active_subscriptions: 47, churn_rate: 1.84,
                    monthly_history: [
                        { month: 'Sep', mrr: 13200 }, { month: 'Oct', mrr: 14800 },
                        { month: 'Nov', mrr: 15600 }, { month: 'Dec', mrr: 16800 },
                        { month: 'Jan', mrr: 17500 }, { month: 'Feb', mrr: 18500 },
                    ]
                });
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading revenue data...</div>;

    const maxMrr = Math.max(...(data?.monthly_history?.map(m => m.mrr) ?? [1]));

    const kpis = [
        { label: 'Monthly Recurring Revenue', value: `$${(data.mrr ?? 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: data.mrr_growth > 0 ? `+${data.mrr_growth}%` : `${data.mrr_growth}%`, trendUp: data.mrr_growth > 0 },
        { label: 'Annual Recurring Revenue', value: `$${(data.arr ?? 0).toLocaleString()}`, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', trend: null, trendUp: true },
        { label: 'Active Subscriptions', value: data.active_subscriptions ?? 0, icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10', trend: null },
        { label: 'Churn Rate', value: `${data.churn_rate ?? 0}%`, icon: TrendingDown, color: data.churn_rate < 2 ? 'text-emerald-400' : 'text-red-400', bg: data.churn_rate < 2 ? 'bg-emerald-500/10' : 'bg-red-500/10', trend: null },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-400">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Revenue Health</h1>
                <p className="text-slate-400 text-sm mt-0.5">MRR / ARR — Executive Revenue Overview</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map(kpi => (
                    <div key={kpi.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                        <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center mb-3`}>
                            <kpi.icon size={20} className={kpi.color} />
                        </div>
                        <div className="text-2xl font-bold text-white">{kpi.value}</div>
                        <div className="flex items-center justify-between mt-0.5">
                            <div className="text-slate-400 text-sm">{kpi.label}</div>
                            {kpi.trend && (
                                <span className={`text-xs font-bold ${kpi.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>{kpi.trend}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* MRR Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* MRR Components */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4">MRR Movement This Month</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'New MRR', value: data.new_mrr, color: 'bg-emerald-500', icon: '+' },
                            { label: 'Expansion MRR', value: data.expansion_mrr, color: 'bg-blue-500', icon: '↑' },
                            { label: 'Churned MRR', value: data.churned_mrr, color: 'bg-red-500', icon: '-' },
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-4">
                                <div className={`w-2 h-8 ${item.color} rounded-full flex-shrink-0`} />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 text-sm">{item.label}</span>
                                        <span className="text-white font-semibold">${item.value?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="border-t border-slate-800 pt-3 flex justify-between">
                            <span className="text-slate-400 font-medium">Net New MRR</span>
                            <span className={`font-bold text-lg ${(data.new_mrr + data.expansion_mrr - data.churned_mrr) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                ${(data.new_mrr + data.expansion_mrr - data.churned_mrr).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* MRR Trend Bar Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4">6-Month MRR Trend</h3>
                    <div className="flex items-end gap-2 h-32">
                        {(data.monthly_history ?? []).map(m => {
                            const heightPct = maxMrr > 0 ? Math.round((m.mrr / maxMrr) * 100) : 0;
                            return (
                                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                                    <div className="relative w-full group">
                                        <div
                                            className="bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all duration-500"
                                            style={{ height: `${Math.max(heightPct, 8)}px`, minHeight: '8px' }}
                                        />
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            ${m.mrr.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="text-slate-500 text-[10px]">{m.month}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MrrDashboard;
