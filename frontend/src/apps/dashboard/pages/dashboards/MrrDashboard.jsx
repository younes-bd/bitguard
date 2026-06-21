import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import client from '../../../../core/api/client';
import toast from 'react-hot-toast';

export default function MrrDashboard() {
    const [stats, setStats] = useState({ current_mrr: 0, arr: 0, growth_pct: 0, active_subscriptions: 0 });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('billing/reports/mrr/')
            .then(res => {
                setStats(res.data?.stats || res.data || { current_mrr: 0, arr: 0, growth_pct: 0, active_subscriptions: 0 });
                setHistory(res.data?.history || []);
            })
            .catch(() => toast.error('Failed to load MRR metrics'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading recurring revenue data...</p>
        </div>
    );

    const isPositive = stats.growth_pct >= 0;

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <Activity className="text-emerald-400" size={28} /> Revenue Health (MRR / ARR)
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Track your recurring service contracts and subscription health</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
                        <DollarSign size={80} className="text-emerald-500" />
                    </div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 relative z-10">Current MRR</p>
                    <p className="text-4xl font-black text-white mb-2 relative z-10">${(stats.current_mrr || 0).toLocaleString()}</p>
                    <div className="flex items-center gap-1.5 relative z-10">
                        <span className={`flex items-center text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {Math.abs(stats.growth_pct || 0)}%
                        </span>
                        <span className="text-xs text-slate-500">vs last month</span>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
                        <TrendingUp size={80} className="text-emerald-500" />
                    </div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 relative z-10">Annual Run Rate (ARR)</p>
                    <p className="text-4xl font-black text-white relative z-10">${((stats.current_mrr || 0) * 12).toLocaleString()}</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 relative z-10">Active Contracts</p>
                    <p className="text-4xl font-black text-blue-400 relative z-10">{stats.active_subscriptions || 0}</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-500/30 transition-all">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 relative z-10">Avg Revenue Per Client</p>
                    <p className="text-4xl font-black text-amber-400 relative z-10">
                        ${stats.active_subscriptions > 0 ? Math.round((stats.current_mrr || 0) / stats.active_subscriptions).toLocaleString() : 0}
                    </p>
                </div>
            </div>

            {/* Simulated Chart Area / History List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-400" /> MRR History (Last 6 Months)
                </h3>
                {history.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500">
                        Not enough historical data to generate chart.
                    </div>
                ) : (
                    <div className="flex h-[300px] items-end gap-2 px-2 pt-10 border-b border-l border-slate-800">
                        {history.map((h, i) => {
                            const max = Math.max(...history.map(x => x.mrr || 0), 1000);
                            const hPct = Math.max((h.mrr / max) * 100, 5);
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center group">
                                    <div className="w-full bg-emerald-500/20 hover:bg-emerald-500/40 border-t border-emerald-500/50 rounded-t-sm transition-all relative flex justify-center"
                                        style={{ height: `${hPct}%` }}>
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded transition-opacity shadow-xl">
                                            ${(h.mrr || 0).toLocaleString()}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest">{h.month}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

