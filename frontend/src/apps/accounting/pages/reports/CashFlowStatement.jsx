import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { erpService } from '../../../../core/api/erpService';
import { toast } from 'react-hot-toast';

const CashFlowStatement = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Default to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    
    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate] = useState(lastDay);

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const data = await erpService.getCashFlow(startDate, endDate);
                setReport(data);
            } catch (err) {
                console.error("Failed to fetch cash flow", err);
                toast.error("Failed to load Cash Flow Statement");
            } finally {
                setLoading(false);
            }
        };
        if (startDate && endDate) {
            fetchReport();
        }
    }, [startDate, endDate]);

    if (!report && loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;

    const isPositive = report?.net_cash_flow >= 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <TrendingUp className="text-emerald-500" />
                        Statement of Cash Flows
                    </h1>
                    <p className="text-sm text-slate-400">Track the inflow and outflow of cash over a specific period.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-2">
                        <Calendar className="text-slate-500 ml-2" size={16} />
                        <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-32 py-2 bg-transparent text-white text-sm focus:outline-none"
                        />
                        <span className="text-slate-500 text-sm">to</span>
                        <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-32 py-2 bg-transparent text-white text-sm focus:outline-none"
                        />
                    </div>
                    <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors border border-slate-700"
                    >
                        <Download size={16} />
                    </button>
                </div>
            </div>

            {report && (
                <div className="space-y-6">
                    {/* Header Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <ArrowUpRight className="text-emerald-400" size={16} /> Total Inflows
                            </div>
                            <div className="text-2xl font-black text-white">
                                ${parseFloat(report.operating_inflows).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <ArrowDownRight className="text-rose-400" size={16} /> Total Outflows
                            </div>
                            <div className="text-2xl font-black text-white">
                                ${parseFloat(report.operating_outflows).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                        <div className={`glass-panel p-6 rounded-2xl border ${isPositive ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-rose-500/50 bg-rose-500/10'}`}>
                            <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                Net Cash Flow
                            </div>
                            <div className={`text-2xl font-black ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isPositive ? '+' : '-'}${Math.abs(report.net_cash_flow).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Statement */}
                    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase font-bold tracking-widest border-b border-slate-800">
                                    <th className="px-6 py-4">Cash Flow Activities</th>
                                    <th className="px-6 py-4 text-right">Amount (USD)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/30">
                                <tr>
                                    <td colSpan="2" className="px-6 py-3 font-bold text-white bg-slate-900/30">Operating Activities</td>
                                </tr>
                                <tr className="hover:bg-slate-800/10">
                                    <td className="px-6 py-3 text-slate-300 pl-10">Cash received from customers</td>
                                    <td className="px-6 py-3 text-right font-mono text-emerald-400">
                                        ${parseFloat(report.operating_inflows).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-800/10">
                                    <td className="px-6 py-3 text-slate-300 pl-10">Cash paid to suppliers and employees</td>
                                    <td className="px-6 py-3 text-right font-mono text-rose-400">
                                        (${parseFloat(report.operating_outflows).toLocaleString(undefined, { minimumFractionDigits: 2 })})
                                    </td>
                                </tr>
                                <tr className="bg-slate-900/50 font-bold border-y border-slate-700">
                                    <td className="px-6 py-4 text-slate-300">Net Cash from Operating Activities</td>
                                    <td className={`px-6 py-4 text-right font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        ${parseFloat(report.net_cash_flow).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot className="bg-slate-900 border-t-2 border-slate-700 font-bold">
                                <tr>
                                    <td className="px-6 py-5 text-white uppercase tracking-widest text-xs">Ending Cash Balance for Period</td>
                                    <td className={`px-6 py-5 text-right font-mono text-lg ${isPositive ? 'text-emerald-400' : 'text-white'}`}>
                                        ${parseFloat(report.ending_balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
            
            {loading && <div className="text-center text-slate-500 text-sm py-4">Refreshing cash flow...</div>}
        </div>
    );
};

export default CashFlowStatement;
