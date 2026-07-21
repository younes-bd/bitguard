import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Download } from 'lucide-react';
import { erpService } from '../../../../core/api/erpService';
import { toast } from 'react-hot-toast';

const ProfitLoss = () => {
    const today = new Date();
    const [startDate, setStartDate] = useState(`${today.getFullYear()}-01-01`);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const data = await erpService.getProfitLoss(startDate, endDate);
                setReport(data);
            } catch (err) {
                toast.error('Failed to load Profit & Loss report');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [startDate, endDate]);

    const isProfit = report?.net_profit >= 0;
    const expenseEntries = Object.entries(report?.expense_breakdown || {});
    const totalExpenses = report?.expenses || 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <TrendingUp className="text-emerald-500" />
                        Profit & Loss Statement
                    </h1>
                    <p className="text-sm text-slate-400">Revenue vs Expenses for the selected period.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                    <Calendar className="text-slate-500" size={16} />
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                        className="bg-transparent text-white text-sm outline-none w-32" />
                    <span className="text-slate-500 text-sm">to</span>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                        className="bg-transparent text-white text-sm outline-none w-32" />
                </div>
            </div>

            {loading && <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>}

            {report && !loading && (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-emerald-500/5">
                            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Total Revenue</div>
                            <div className="text-3xl font-black text-white">${parseFloat(report.revenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            <div className="text-xs text-slate-500 mt-1">Payments received</div>
                        </div>
                        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-rose-500/5">
                            <div className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2">Total Expenses</div>
                            <div className="text-3xl font-black text-white">${parseFloat(report.expenses).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            <div className="text-xs text-slate-500 mt-1">Operating costs</div>
                        </div>
                        <div className={`glass-panel p-6 rounded-2xl border ${isProfit ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-rose-500/30 bg-rose-500/10'}`}>
                            <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>Net {isProfit ? 'Profit' : 'Loss'}</div>
                            <div className={`text-3xl font-black ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isProfit ? '+' : ''}${parseFloat(report.net_profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">Margin: {report.profit_margin}%</div>
                        </div>
                    </div>

                    {/* Expense Breakdown */}
                    {expenseEntries.length > 0 && (
                        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                            <div className="p-6 border-b border-slate-800">
                                <h3 className="font-bold text-white">Expense Breakdown</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {expenseEntries
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([cat, amount]) => {
                                        const pct = totalExpenses > 0 ? (amount / totalExpenses * 100) : 0;
                                        return (
                                            <div key={cat}>
                                                <div className="flex justify-between text-sm mb-1.5">
                                                    <span className="text-slate-300 capitalize">{cat.replace('_', ' ')}</span>
                                                    <span className="font-bold text-white">${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                </div>
                                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-700"
                                                        style={{ width: `${Math.min(pct, 100)}%` }}
                                                    />
                                                </div>
                                                <div className="text-right text-xs text-slate-500 mt-1">{pct.toFixed(1)}% of total</div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    )}

                    {/* P&L Statement Table */}
                    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-widest font-bold border-b border-slate-800">
                                    <th className="px-6 py-4">Line Item</th>
                                    <th className="px-6 py-4 text-right">Amount (USD)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td colSpan="2" className="px-6 py-3 font-bold text-emerald-400 bg-emerald-500/5 border-b border-slate-800">INCOME</td></tr>
                                <tr className="border-b border-slate-800/40 hover:bg-slate-800/10">
                                    <td className="px-6 py-3 text-slate-300 pl-10">Revenue from Operations</td>
                                    <td className="px-6 py-3 text-right font-mono text-emerald-400">${parseFloat(report.revenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr className="border-b border-slate-800 font-bold bg-slate-900/30">
                                    <td className="px-6 py-3 text-white">Total Revenue</td>
                                    <td className="px-6 py-3 text-right font-mono text-emerald-400">${parseFloat(report.revenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr><td colSpan="2" className="px-6 py-3 font-bold text-rose-400 bg-rose-500/5 border-b border-slate-800">EXPENSES</td></tr>
                                {expenseEntries.map(([cat, amount]) => (
                                    <tr key={cat} className="border-b border-slate-800/40 hover:bg-slate-800/10">
                                        <td className="px-6 py-3 text-slate-300 capitalize pl-10">{cat.replace('_', ' ')}</td>
                                        <td className="px-6 py-3 text-right font-mono text-slate-300">({parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })})</td>
                                    </tr>
                                ))}
                                <tr className="border-b border-slate-800 font-bold bg-slate-900/30">
                                    <td className="px-6 py-3 text-white">Total Expenses</td>
                                    <td className="px-6 py-3 text-right font-mono text-rose-400">({parseFloat(report.expenses).toLocaleString(undefined, { minimumFractionDigits: 2 })})</td>
                                </tr>
                            </tbody>
                            <tfoot className={`border-t-2 font-black text-lg ${isProfit ? 'border-emerald-500/30' : 'border-rose-500/30'}`}>
                                <tr>
                                    <td className="px-6 py-5 text-white">NET {isProfit ? 'PROFIT' : 'LOSS'}</td>
                                    <td className={`px-6 py-5 text-right font-mono ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        ${parseFloat(Math.abs(report.net_profit)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfitLoss;
