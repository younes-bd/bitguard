import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, FileText, CreditCard, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import client from '../../../core/api/client';
import { erpService } from '../../../core/api/erpService';

const FinancialsDashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFinances = async () => {
            try {
                const [metricsRes, expRes, payRes] = await Promise.all([
                    client.get('dashboard/metrics/'),
                    erpService.getExpenses(),
                    erpService.getPayments()
                ]);
                
                setMetrics(metricsRes.data?.data || {});
                
                // Handle paginated or direct array responses
                setExpenses(expRes.results ? expRes.results : (Array.isArray(expRes) ? expRes : []));
                setPayments(payRes.results ? payRes.results : (Array.isArray(payRes) ? payRes : []));
            } catch (err) {
                console.error("Failed to load financials", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFinances();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    // Calculations
    const erpMetrics = metrics?.erp || {};
    const storeMetrics = metrics?.store || {};
    const crmMetrics = metrics?.crm || {};
    
    // Total Revenue = payments logic + lifetime store rev + crm rev 
    // Usually admin wants the aggregate sum
    const totalRevenue = (storeMetrics.lifetime_revenue || 0) + (crmMetrics.recent_revenue || 0) + 
                         payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                         
    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    const pendingInvoices = erpMetrics.open_invoices || 0;

    const stats = [
        { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, change: 'Live', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Total Expenses', value: `$${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, change: 'Live', icon: CreditCard, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        { label: 'Net Profit', value: `$${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, change: 'Est.', icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { label: 'Pending Invoices', value: pendingInvoices.toString(), change: 'Unpaid', icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    ];

    // Combine Payments & Expenses into single Transaction log
    const rawTransactions = [
        ...payments.map(p => ({
            id: `p-${p.id}`, desc: `Payment - ${p.reference_number || p.id}`, date: p.payment_date || p.created_at, amount: parseFloat(p.amount), type: 'income'
        })),
        ...expenses.map(e => ({
            id: `e-${e.id}`, desc: e.description || e.category || 'Expense', date: e.expense_date || e.created_at, amount: parseFloat(e.amount), type: 'expense'
        }))
    ];
    
    // Sort by newest
    rawTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    const transactions = rawTransactions.slice(0, 8); // Top 8

    // Build Mock Chart Data for the last 6 months (since we don't have historical grouping endpoints readily available)
    const mockChartData = [
        { name: 'Jan', income: 40000, expense: 24000 },
        { name: 'Feb', income: 30000, expense: 13980 },
        { name: 'Mar', income: 20000, expense: 9800 },
        { name: 'Apr', income: 27800, expense: 39080 },
        { name: 'May', income: 18900, expense: 4800 },
        { name: 'Jun', income: Math.max(20000, totalRevenue / 2), expense: Math.max(5000, totalExpenses / 2) },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Financial Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-900 ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts & Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart Area (Placeholder) */}
                <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-white">Cash Flow</h2>
                        <select className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-sm text-slate-300 focus:outline-none">
                            <option>Last 6 Months</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-72 mt-4 text-sm">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                                    formatter={(value) => [`$${value.toLocaleString()}`]}
                                />
                                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <h2 className="text-lg font-bold text-white mb-6">Recent Transactions</h2>
                    <div className="space-y-4">
                        {transactions.length > 0 ? transactions.map(tx => (
                            <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                        {tx.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white line-clamp-1">{tx.desc}</div>
                                        <div className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className={`font-bold text-sm shrink-0 pl-4 ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                                    {tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>
                        )) : (
                            <div className="text-center p-6 text-slate-500">
                                No recent ledger entries.
                            </div>
                        )}
                    </div>
                    <button className="w-full mt-6 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-colors">
                        View All transactions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinancialsDashboard;


