import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, AlertTriangle, ShieldCheck, PieChart } from 'lucide-react';
import { accountingService } from '../../api/accountingService';

const AgingReport = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAging = async () => {
            try {
                const data = await accountingService.getAgingReport();
                setReport(data);
            } catch (err) {
                console.error("Failed to load aging report", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAging();
    }, []);

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;

    const buckets = [
        { key: 'current', label: 'Current', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { key: '1_30', label: '1 - 30 Days', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
        { key: '31_60', label: '31 - 60 Days', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
        { key: '61_90', label: '61 - 90 Days', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
        { key: '90_plus', label: '90+ Days', color: 'text-rose-600', bg: 'bg-rose-600/10', border: 'border-rose-600/20' },
    ];

    const totalAr = report?.total_outstanding || 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Clock className="text-emerald-500" />
                    A/R Aging Report
                </h1>
                <p className="text-sm text-slate-400">Accounts Receivable aging summary to identify collection priorities.</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                            <TrendingUp size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Outstanding</h3>
                    </div>
                    <div className="text-3xl font-black text-white">${parseFloat(totalAr).toLocaleString()}</div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-500/10 text-red-400 rounded-xl">
                            <AlertTriangle size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Overdue</h3>
                    </div>
                    <div className="text-3xl font-black text-red-400">
                        ${parseFloat((report?.summary?.['1_30'] || 0) + (report?.summary?.['31_60'] || 0) + (report?.summary?.['61_90'] || 0) + (report?.summary?.['90_plus'] || 0)).toLocaleString()}
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-slate-800 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                            <PieChart size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Aging Distribution</h3>
                    </div>
                    
                    <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex">
                        {buckets.map(b => {
                            const val = report?.summary?.[b.key] || 0;
                            const pct = totalAr > 0 ? (val / totalAr) * 100 : 0;
                            return (
                                <div 
                                    key={b.key}
                                    style={{ width: `${pct}%` }}
                                    className={`h-full ${b.bg} border-r border-slate-900 last:border-r-0`}
                                    title={`${b.label}: $${val.toLocaleString()}`}
                                />
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Current</span>
                        <span>Overdue</span>
                        <span>Critical</span>
                    </div>
                </div>
            </div>

            {/* Buckets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {buckets.map(b => {
                    const amount = report?.summary?.[b.key] || 0;
                    return (
                        <div key={b.key} className={`p-5 rounded-2xl border ${b.border} ${b.bg} flex flex-col justify-between`}>
                            <div className="text-sm font-bold text-slate-300 mb-2">{b.label}</div>
                            <div className={`text-xl font-black ${b.color}`}>${parseFloat(amount).toLocaleString()}</div>
                        </div>
                    );
                })}
            </div>

            {/* Invoice Detail List */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                    <h3 className="text-lg font-bold text-white">Outstanding Invoices</h3>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-slate-800">
                            <th className="px-6 py-4">Invoice</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Due Date</th>
                            <th className="px-6 py-4">Aging Bucket</th>
                            <th className="px-6 py-4 text-right">Balance Due</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {report?.invoices?.length > 0 ? report.invoices.map((inv) => {
                            const bucket = buckets.find(b => b.key === inv.aging_bucket) || buckets[0];
                            return (
                                <tr key={inv.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-white">{inv.invoice_number}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-300">{inv.client_name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-400">{inv.due_date}</span>
                                        {inv.days_overdue > 0 && (
                                            <span className="ml-2 text-xs text-red-400 font-bold">{inv.days_overdue}d late</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${bucket.bg} ${bucket.color} ${bucket.border}`}>
                                            {bucket.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`text-sm font-bold ${inv.days_overdue > 30 ? 'text-red-400' : 'text-white'}`}>
                                            ${parseFloat(inv.balance_due).toLocaleString()}
                                        </span>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                    <ShieldCheck size={48} className="mx-auto mb-4 text-emerald-500/50" />
                                    No outstanding invoices. All clear!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgingReport;
