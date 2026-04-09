import React, { useState, useEffect } from 'react';
import { Users, TrendingUp } from 'lucide-react';
import client from '../../../core/api/client';

const CrmReport = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('reports/crm/')
            .then(r => { setData(r.data?.data ?? {}); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const funnel = data?.funnel ?? {};
    const stages = data?.stage_breakdown ?? [];

    const funnelSteps = [
        { label: 'Leads', value: funnel.leads ?? 0, color: 'blue' },
        { label: 'Open Deals', value: funnel.deals_open ?? 0, color: 'indigo' },
        { label: 'Won', value: funnel.deals_won ?? 0, color: 'emerald' },
        { label: 'Lost', value: funnel.deals_lost ?? 0, color: 'red' },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-400">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <Users size={22} className="text-blue-400" /> CRM & Sales Report
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Lead-to-deal pipeline and conversion metrics</p>
            </div>
            {loading ? (
                <div className="text-center py-16 text-slate-500">Loading...</div>
            ) : (
                <>
                    {/* Win Rate Hero */}
                    <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-2xl p-8 text-center">
                        <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Win Rate</p>
                        <p className="text-6xl font-bold text-white">{funnel.win_rate ?? 0}<span className="text-3xl text-blue-400">%</span></p>
                    </div>
                    {/* Funnel Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {funnelSteps.map(s => (
                            <div key={s.label} className={`bg-slate-900 border border-slate-800 rounded-xl p-5 text-center`}>
                                <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">{s.label}</p>
                                <p className={`text-3xl font-bold text-${s.color}-400`}>{s.value}</p>
                            </div>
                        ))}
                    </div>
                    {/* Stage Breakdown Table */}
                    {stages.length > 0 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-800">
                                <h3 className="text-sm font-bold text-white">Stage Breakdown</h3>
                            </div>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-800">
                                        {['Stage', 'Deals', 'Total Value'].map(h => (
                                            <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {stages.map((s, i) => (
                                        <tr key={i} className="border-b border-slate-800/50">
                                            <td className="px-5 py-3 text-slate-300 capitalize">{s.stage}</td>
                                            <td className="px-5 py-3 text-white font-semibold">{s.count}</td>
                                            <td className="px-5 py-3 text-emerald-400">${Number(s.total_value || 0).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CrmReport;
