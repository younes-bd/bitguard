import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FileText, DollarSign, Clock, ChevronRight,
    ArrowUpRight, Plus, TrendingUp, AlertTriangle,
    BarChart2, CreditCard, Activity
} from 'lucide-react';
import { erpService } from '../../../../core/api/erpService';
import { toast } from 'react-hot-toast';

const BillingOverview = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBillingData = async () => {
            try {
                const [dashData, invoiceData] = await Promise.all([
                    erpService.getDashboardStats(),
                    erpService.getInvoices({ ordering: '-created_at', page_size: 5 }),
                ]);
                setStats(dashData);
                const results = Array.isArray(invoiceData) ? invoiceData : invoiceData?.results || [];
                setInvoices(results);
            } catch (err) {
                toast.error('Failed to load billing data');
            } finally {
                setLoading(false);
            }
        };
        loadBillingData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!stats) return <div className="text-white p-8">Failed to load billing data.</div>;

    const { financials, kpi } = stats;
    const profitMargin = financials.total_revenue > 0
        ? ((financials.net_profit / financials.total_revenue) * 100).toFixed(1)
        : '0.0';

    const statusColors = {
        paid: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        sent: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        draft: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
        overdue: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        partially_paid: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        void: 'text-slate-500 bg-slate-800/50 border-slate-700',
        cancelled: 'text-slate-500 bg-slate-800/50 border-slate-700',
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Billing & Finance</h1>
                    <p className="text-slate-400">Comprehensive overview of your enterprise financial health.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/accounting/profit-loss')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors border border-slate-700/50"
                    >
                        <BarChart2 size={18} />
                        <span>P&L Report</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/accounting/invoices/create')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 font-bold"
                    >
                        <Plus size={18} />
                        <span>New Invoice</span>
                    </button>
                </div>
            </div>

            {/* Overdue Alert Banner */}
            {kpi.overdue_invoices > 0 && (
                <div
                    onClick={() => navigate('/admin/accounting/aging-report')}
                    className="flex items-center justify-between p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl cursor-pointer hover:bg-rose-500/20 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="text-rose-400 shrink-0" size={20} />
                        <span className="text-rose-300 font-bold">
                            You have {kpi.overdue_invoices} overdue invoice{kpi.overdue_invoices > 1 ? 's' : ''} requiring attention.
                        </span>
                    </div>
                    <ChevronRight className="text-rose-400" size={18} />
                </div>
            )}

            {/* KPI Cards — real data from API */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Revenue"
                    value={`$${financials.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    subtitle="All time payments received"
                    icon={<TrendingUp size={22} />}
                    accent="text-emerald-400"
                    bg="bg-emerald-500/10"
                />
                <StatCard
                    title="Outstanding AR"
                    value={`$${(financials.outstanding_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    subtitle={`${kpi.overdue_invoices} overdue`}
                    icon={<Clock size={22} />}
                    accent={kpi.overdue_invoices > 0 ? 'text-rose-400' : 'text-slate-400'}
                    bg={kpi.overdue_invoices > 0 ? 'bg-rose-500/10' : 'bg-slate-500/10'}
                />
                <StatCard
                    title="Net Profit"
                    value={`$${financials.net_profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    subtitle="Revenue minus expenses"
                    icon={<DollarSign size={22} />}
                    accent={financials.net_profit >= 0 ? 'text-blue-400' : 'text-rose-400'}
                    bg={financials.net_profit >= 0 ? 'bg-blue-500/10' : 'bg-rose-500/10'}
                />
                <StatCard
                    title="Profit Margin"
                    value={`${profitMargin}%`}
                    subtitle="Net profit / Revenue"
                    icon={<Activity size={22} />}
                    accent="text-purple-400"
                    bg="bg-purple-500/10"
                />
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Invoices */}
                <div className="lg:col-span-2 glass-panel rounded-2xl border border-slate-700/50 overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-slate-800">
                        <h3 className="text-lg font-bold text-white">Recent Invoices</h3>
                        <button
                            onClick={() => navigate('/admin/accounting/invoices')}
                            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold"
                        >
                            View All <ChevronRight size={16} />
                        </button>
                    </div>
                    {invoices.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <FileText size={40} className="mx-auto mb-3 opacity-40" />
                            <p>No invoices yet. <button onClick={() => navigate('/admin/accounting/invoices/create')} className="text-blue-400 hover:underline">Create one →</button></p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-slate-900/40 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-800">
                                    <th className="px-6 py-3">Invoice</th>
                                    <th className="px-6 py-3">Client</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {invoices.map(inv => (
                                    <tr
                                        key={inv.id}
                                        onClick={() => navigate(`/admin/accounting/invoices/${inv.id}`)}
                                        className="hover:bg-slate-800/30 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono text-white font-bold">{inv.invoice_number}</td>
                                        <td className="px-6 py-4 text-slate-300">{inv.client_name || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded border ${statusColors[inv.status] || statusColors.draft}`}>
                                                {inv.status?.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-white">
                                            ${parseFloat(inv.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                    <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
                        <h3 className="text-lg font-bold text-white mb-4">Financial Reports</h3>
                        <div className="space-y-1">
                            <ReportButton title="Profit & Loss" onClick={() => navigate('/admin/accounting/profit-loss')} icon={<TrendingUp size={18} />} />
                            <ReportButton title="Balance Sheet" onClick={() => navigate('/admin/accounting/balance-sheet')} icon={<BarChart2 size={18} />} />
                            <ReportButton title="Cash Flow" onClick={() => navigate('/admin/accounting/cash-flow')} icon={<Activity size={18} />} />
                            <ReportButton title="A/R Aging" onClick={() => navigate('/admin/accounting/aging-report')} icon={<Clock size={18} />} />
                            <ReportButton title="Budget vs Actual" onClick={() => navigate('/admin/accounting/budget-report')} icon={<CreditCard size={18} />} />
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
                        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Quick Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Draft Invoices</span>
                                <span className="text-white font-bold">{kpi.draft_invoices}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Active Vendors</span>
                                <span className="text-white font-bold">{kpi.active_vendors}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Open POs</span>
                                <span className="text-white font-bold">{kpi.open_pos}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Pending Delivery</span>
                                <span className="text-white font-bold">{kpi.pending_delivery}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, subtitle, icon, accent, bg }) => (
    <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all">
        <div className={`inline-flex p-2.5 rounded-xl ${bg} ${accent} mb-4`}>
            {icon}
        </div>
        <div className="text-2xl font-black text-white mb-1">{value}</div>
        <div className="text-sm font-bold text-white mb-0.5">{title}</div>
        <div className="text-xs text-slate-500">{subtitle}</div>
    </div>
);

const ReportButton = ({ title, icon, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-colors group"
    >
        <div className="flex items-center gap-3">
            <span className="text-slate-400 group-hover:text-blue-400 transition-colors">{icon}</span>
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{title}</span>
        </div>
        <ChevronRight size={16} className="text-slate-600 group-hover:text-blue-400" />
    </button>
);

export default BillingOverview;
