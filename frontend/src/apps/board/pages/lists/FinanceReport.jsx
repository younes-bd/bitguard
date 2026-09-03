import React, { useState, useEffect } from 'react';
import { DollarSign, PieChart, TrendingUp, TrendingDown, FileText, Calendar } from 'lucide-react';
import boardService from '@/apps/board/api/boardService';

export default function FinanceReport() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        total_invoiced: 0,
        total_paid: 0,
        total_expenses: 0,
        net_revenue: 0,
        outstanding: 0,
        invoice_count: 0
    });
    const [dateRange, setDateRange] = useState({ from_date: '', to_date: '' });

    const fetchReport = () => {
        setLoading(true);
        const params = {};
        if (dateRange.from_date) params.from_date = dateRange.from_date;
        if (dateRange.to_date) params.to_date = dateRange.to_date;

        boardService.getFinanceReport(params)
            .then((res) => {
                if (res) setData(res);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const handleFilter = () => {
        fetchReport();
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading finance metrics...</p>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <PieChart className="text-violet-400" size={28} /> Finance & P&L Report
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Revenue vs expenses, net income, and A/R</p>
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
                        className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm transition-colors"
                    >
                        Filter
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={80} className="text-emerald-500" /></div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">Total Realized Revenue</p>
                    <p className="text-3xl font-black text-emerald-400 relative z-10">${data.total_paid.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingDown size={80} className="text-rose-500" /></div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">Total Expenses</p>
                    <p className="text-3xl font-black text-rose-400 relative z-10">${data.total_expenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><FileText size={80} className="text-amber-500" /></div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">Outstanding A/R</p>
                    <p className="text-3xl font-black text-amber-400 relative z-10">${data.outstanding.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Secondary Metrics */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                        <DollarSign size={18} className="text-violet-400" /> Additional Metrics
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                            <span className="text-slate-400 text-sm">Total Invoiced (All Statuses)</span>
                            <span className="text-white font-medium">${data.total_invoiced.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                            <span className="text-slate-400 text-sm">Number of Invoices</span>
                            <span className="text-white font-medium">{data.invoice_count}</span>
                        </div>
                    </div>
                </div>

                {/* Net Income Summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                    <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-widest">Net Profit / Loss</p>
                    <h2 className={`text-6xl font-black ${data.net_revenue >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ${data.net_revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </h2>
                    <p className="text-slate-500 text-sm mt-4 max-w-xs leading-relaxed">
                        Calculated from paid invoices minus recorded expenses for the selected period.
                    </p>
                </div>
            </div>
        </div>
    );
}

