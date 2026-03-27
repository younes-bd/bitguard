import React, { useState, useEffect } from 'react';
import { TrendingUp, Package } from 'lucide-react';
import client from '../../../core/api/client';

const RevenueReport = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('/reports/revenue/')
            .then(r => { setData(r.data?.data ?? {}); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const monthly = data?.monthly ?? [];
    const maxVal = Math.max(...monthly.map(m => (m.store_revenue || 0) + (m.invoice_collected || 0)), 1);

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-400">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <TrendingUp size={22} className="text-emerald-400" /> Revenue Report
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Last 12 months — store + invoice collections</p>
            </div>
            {loading ? (
                <div className="text-center py-16 text-slate-500">Loading...</div>
            ) : (
                <>
                    {/* Chart */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-end gap-2 h-48">
                            {monthly.map((m, i) => {
                                const total = (m.store_revenue || 0) + (m.invoice_collected || 0);
                                const pct = Math.round((total / maxVal) * 100);
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                        <span className="text-[10px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">${total.toLocaleString()}</span>
                                        <div className="w-full bg-emerald-500/20 rounded-t-sm hover:bg-emerald-500/40 transition-colors" style={{ height: `${Math.max(pct, 2)}%` }} />
                                        <span className="text-[9px] text-slate-500 rotate-45 origin-left whitespace-nowrap">{m.month?.split(' ')[0]}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* Monthly Table */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    {['Month', 'Store Revenue', 'Invoices Collected', 'Total'].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...monthly].reverse().map((m, i) => (
                                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                                        <td className="px-5 py-3 text-slate-300">{m.month}</td>
                                        <td className="px-5 py-3 text-emerald-400">${Number(m.store_revenue || 0).toLocaleString()}</td>
                                        <td className="px-5 py-3 text-blue-400">${Number(m.invoice_collected || 0).toLocaleString()}</td>
                                        <td className="px-5 py-3 text-white font-semibold">${Number((m.store_revenue || 0) + (m.invoice_collected || 0)).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default RevenueReport;
