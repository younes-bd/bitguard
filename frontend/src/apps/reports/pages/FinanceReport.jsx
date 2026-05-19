import React, { useState, useEffect } from 'react';
import { DollarSign, PieChart, TrendingUp, TrendingDown, FileText } from 'lucide-react';
import client from '../../../core/api/client';
import toast from 'react-hot-toast';

export default function FinanceReport() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ invoices: [], expenses: [], clients: [] });

    useEffect(() => {
        Promise.all([
            client.get('erp/invoices/').catch(() => ({ data: [] })),
            client.get('erp/expenses/').catch(() => ({ data: [] })),
            client.get('crm/clients/').catch(() => ({ data: [] }))
        ]).then(([invRes, expRes, cliRes]) => {
            setData({
                invoices: invRes.data?.results || invRes.data || [],
                expenses: expRes.data?.results || expRes.data || [],
                clients: cliRes.data?.results || cliRes.data || []
            });
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading finance metrics...</p>
        </div>
    );

    // Calculate metrics
    const totalRev = data.invoices.filter(i => i.status === 'paid').reduce((s, i) => s + parseFloat(i.total_amount || 0), 0);
    const totalExp = data.expenses.filter(e => e.status === 'approved' || e.status === 'paid').reduce((s, e) => s + parseFloat(e.amount || 0), 0);
    const outstandingAr = data.invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + parseFloat(i.total_amount || 0), 0);
    
    // Top clients by invoice total
    const clientRev = {};
    data.invoices.forEach(i => {
        if (!i.client) return;
        clientRev[i.client] = (clientRev[i.client] || 0) + parseFloat(i.total_amount || 0);
    });
    
    const topClients = Object.entries(clientRev)
        .map(([id, rev]) => {
            const clientObj = data.clients.find(c => String(c.id) === String(id));
            return { name: clientObj?.company_name || `Client #${id}`, revenue: rev };
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <PieChart className="text-violet-400" size={28} /> Finance & P&L Report
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Revenue vs expenses, top clients, and AR aging</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={80} className="text-emerald-500" /></div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">Total Realized Revenue</p>
                    <p className="text-3xl font-black text-emerald-400 relative z-10">${totalRev.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingDown size={80} className="text-rose-500" /></div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">Total Expenses</p>
                    <p className="text-3xl font-black text-rose-400 relative z-10">${totalExp.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><FileText size={80} className="text-amber-500" /></div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">Outstanding A/R</p>
                    <p className="text-3xl font-black text-amber-400 relative z-10">${outstandingAr.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Clients */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                        <DollarSign size={18} className="text-violet-400" /> Top 5 Clients by Revenue
                    </h3>
                    {topClients.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">No revenue data.</div>
                    ) : (
                        <div className="space-y-4">
                            {topClients.map((c, i) => {
                                const pct = totalRev > 0 ? Math.round((c.revenue / totalRev) * 100) : 0;
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-300 font-medium">{i+1}. {c.name}</span>
                                            <span className="text-emerald-400 font-bold">${c.revenue.toLocaleString()} <span className="text-slate-500 font-normal">({pct}%)</span></span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                                            <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Net Income Summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                    <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-widest">Net Profit / Loss</p>
                    <h2 className={`text-6xl font-black ${totalRev - totalExp >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ${(totalRev - totalExp).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </h2>
                    <p className="text-slate-500 text-sm mt-4 max-w-xs leading-relaxed">
                        Calculated from paid invoices minus approved/paid expenses across all recorded transactions.
                    </p>
                </div>
            </div>
        </div>
    );
}
