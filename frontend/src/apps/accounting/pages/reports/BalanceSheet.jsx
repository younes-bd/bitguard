import React, { useState, useEffect } from 'react';
import { Scale, Calendar, Download } from 'lucide-react';
import { accountingService } from '../../api/accountingService';
import { toast } from 'react-hot-toast';

const BalanceSheet = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const data = await accountingService.getBalanceSheet(date);
                setReport(data);
            } catch (err) {
                console.error("Failed to fetch balance sheet", err);
                toast.error("Failed to load Balance Sheet");
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [date]);

    if (!report && loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;

    const renderSection = (title, items, total, colorClass) => (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden mb-6">
            <div className={`p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center ${colorClass}`}>
                <h3 className="font-bold uppercase tracking-widest text-sm">{title}</h3>
                <span className="font-black text-lg">${parseFloat(total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="p-0">
                <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-slate-800/30">
                        {items?.map(item => (
                            <tr key={item.code} className="hover:bg-slate-800/10">
                                <td className="px-6 py-3 w-1/4 font-mono text-xs text-slate-500">{item.code}</td>
                                <td className="px-6 py-3 text-slate-300">{item.name}</td>
                                <td className="px-6 py-3 text-right font-mono text-white">
                                    ${parseFloat(item.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}
                        {(!items || items.length === 0) && (
                            <tr><td colSpan="3" className="px-6 py-4 text-center text-slate-500 text-xs">No accounts to display</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const isBalanced = report && Math.abs(report.total_assets - (report.total_liabilities + report.total_equity)) < 0.01;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Scale className="text-blue-500" />
                        Balance Sheet
                    </h1>
                    <p className="text-sm text-slate-400">Statement of financial position: Assets = Liabilities + Equity.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                            type="date" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors border border-slate-700"
                    >
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {report && (
                <div className="space-y-2">
                    <div className={`p-4 rounded-xl border flex justify-between items-center text-sm font-bold ${
                        isBalanced ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                        <span>{isBalanced ? 'Sheet is Balanced' : 'Out of Balance! Check Journal Entries'}</span>
                        <div className="flex gap-4">
                            <span>Assets: ${parseFloat(report.total_assets).toLocaleString()}</span>
                            <span>L+E: ${parseFloat(report.total_liabilities + report.total_equity).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 pt-4">
                        {renderSection('Assets', report.assets, report.total_assets, 'text-blue-400')}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {renderSection('Liabilities', report.liabilities, report.total_liabilities, 'text-rose-400')}
                            {renderSection('Equity', report.equity, report.total_equity, 'text-purple-400')}
                        </div>
                    </div>
                </div>
            )}
            
            {loading && <div className="text-center text-slate-500 text-sm py-4">Refreshing sheet...</div>}
        </div>
    );
};

export default BalanceSheet;
