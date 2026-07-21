import React, { useState, useEffect } from 'react';
import { Users, Calendar } from 'lucide-react';
import { analyticsService } from '../../../../core/api/analyticsService';

const CrmReport = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ from_date: '', to_date: '' });

    const fetchReport = () => {
        setLoading(true);
        const params = {};
        if (dateRange.from_date) params.from_date = dateRange.from_date;
        if (dateRange.to_date) params.to_date = dateRange.to_date;
        
        analyticsService.getCrmReport(params)
            .then(res => { setData(res || {}); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const handleFilter = () => {
        fetchReport();
    };

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Users size={22} className="text-blue-400" /> CRM & Sales Report
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Lead-to-deal pipeline and conversion metrics</p>
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
                            <div className="px-5 py-4 border-b border-slate-800 bg-slate-800/30">
                                <h3 className="text-sm font-bold text-white">Stage Breakdown</h3>
                            </div>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-800/50">
                                        {['Stage', 'Status', 'Deals', 'Total Value'].map(h => (
                                            <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {stages.map((s, i) => (
                                        <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                                            <td className="px-5 py-4 text-slate-300 font-medium capitalize">{s.stage}</td>
                                            <td className="px-5 py-4">
                                                {s.is_won ? (
                                                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Won</span>
                                                ) : s.is_lost ? (
                                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Lost</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Open</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-white font-semibold">{s.count}</td>
                                            <td className="px-5 py-4 text-emerald-400 font-mono">${Number(s.total_value || 0).toLocaleString()}</td>
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

