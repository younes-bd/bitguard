import React, { useState, useEffect } from 'react';
import { ArrowRight, BarChart3, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import { accountingService } from '../../api/accountingService';

const DeferredRevenue = () => {
    const [loading, setLoading] = useState(true);
    const [schedules, setSchedules] = useState([]);
    const [summary, setSummary] = useState({ total_deferred: 0, recognized_ytd: 0, next_month_recognition: 0 });

    useEffect(() => {
        const fetchDeferred = async () => {
            try {
                // Fetch real data from the Deferred Revenue API endpoint
                const data = await accountingService.getDeferredRevenues();
                setSchedules(data);
                
                const sums = data.reduce((acc, curr) => ({
                    total_deferred: acc.total_deferred + Number(curr.remaining_amount || 0),
                    recognized_ytd: acc.recognized_ytd + Number(curr.recognized_amount || 0),
                }), { total_deferred: 0, recognized_ytd: 0 });
                
                // roughly sum of (total_amount / duration) for active ones
                const nextMonth = data.filter(m => m.status === 'active').reduce((acc, curr) => acc + (Number(curr.total_amount || 0) / (Number(curr.duration_months) || 12)), 0);
                
                setSummary({ ...sums, next_month_recognition: nextMonth });
            } catch (err) {
                console.error("Failed to fetch deferred revenue schedules", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDeferred();
    }, []);

    if (loading) return (
        <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Deferred Revenue</h1>
                    <p className="text-slate-400 mt-1">Manage and track unearned revenue recognition schedules.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors border border-slate-700">
                        <ArrowRight size={18} />
                        <span>Run Recognition</span>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-10">
                        <DollarSign size={100} />
                    </div>
                    <div className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-2 relative z-10">Total Deferred Revenue</div>
                    <div className="text-4xl font-black text-white relative z-10">${summary.total_deferred.toLocaleString()}</div>
                    <div className="mt-4 text-xs text-slate-400 flex items-center gap-1 relative z-10">
                        <Clock size={12} /> Liability on Balance Sheet
                    </div>
                </div>
                <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-10">
                        <BarChart3 size={100} />
                    </div>
                    <div className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2 relative z-10">Recognized YTD</div>
                    <div className="text-4xl font-black text-white relative z-10">${summary.recognized_ytd.toLocaleString()}</div>
                    <div className="mt-4 text-xs text-slate-400 flex items-center gap-1 relative z-10">
                        <CheckCircle2 size={12} /> Shifted to Income Statement
                    </div>
                </div>
                <div className="glass-panel p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent relative overflow-hidden">
                    <div className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2 relative z-10">Expected Recognition Next Mo.</div>
                    <div className="text-4xl font-black text-white relative z-10">${Math.round(summary.next_month_recognition).toLocaleString()}</div>
                    <div className="mt-4 text-xs text-slate-400 relative z-10">
                        Projected P&L impact for next period
                    </div>
                </div>
            </div>

            {/* Schedules Table */}
            <div className="glass-panel rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white">Active Recognition Schedules</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/80">
                            <tr>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contract / Client</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Term</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Total Contract</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Recognized</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right text-purple-400">Deferred Bal.</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {schedules.map((row, i) => {
                                const pct = (row.recognized / row.total_amount) * 100;
                                return (
                                    <tr key={row.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="font-bold text-white">{row.contract}</div>
                                            <div className="text-xs text-slate-500 mt-1">{row.start_date} to {row.end_date}</div>
                                        </td>
                                        <td className="p-4 text-slate-300">
                                            {row.duration_months} Months
                                        </td>
                                        <td className="p-4 text-right font-mono text-slate-300">${row.total_amount.toLocaleString()}</td>
                                        <td className="p-4 text-right">
                                            <div className="font-mono text-emerald-400 mb-1">${row.recognized.toLocaleString()}</div>
                                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex justify-end">
                                                <div style={{ width: `${pct}%` }} className="h-full bg-emerald-500 rounded-full" />
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-bold font-mono text-purple-400">${row.deferred.toLocaleString()}</td>
                                        <td className="p-4 text-center">
                                            {row.status === 'active' ? (
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-widest">
                                                    Amortizing
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30 uppercase tracking-widest">
                                                    Completed
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DeferredRevenue;
