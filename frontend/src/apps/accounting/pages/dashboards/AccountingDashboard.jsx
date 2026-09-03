import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountingService } from '../../api/accountingService';
import {
    FolderKanban, Clock, Plus, Activity,
    TrendingUp, DollarSign, Scale,
    Building2, ShoppingCart, Repeat, BookOpen,
    Landmark, FileSpreadsheet, Server, ArrowRight, Wallet, Shield
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const AccountingDashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            accountingService.getDashboardStats().catch(() => null),
            accountingService.getMonthlyFinancials(6).catch(() => [])
        ]).then(([stats, monthly]) => {
            if (stats) setData(stats);
            if (monthly) setMonthlyData(monthly);
            setLoading(false);
        });
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-[70vh]">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
        </div>
    );

    if (!data || !data.financials || !data.kpi) return <div className="text-white p-8">Data unavailable.</div>;

    const { kpi, financials, system = { core: 'Operational', database: 'Operational' } } = data;
    const profitMargin = financials?.total_revenue > 0 
        ? ((financials.net_profit / financials.total_revenue) * 100).toFixed(1)
        : 0;

    const quickLinks = [
        { icon: FolderKanban, label: 'Projects', val: kpi.active_projects, path: '/admin/projects/list', color: 'blue' },
        { icon: Clock, label: 'Overdue Invoices', val: kpi.overdue_invoices, path: '/admin/accounting/invoices', color: 'rose' },
        { icon: Activity, label: 'Deliveries', val: kpi.pending_delivery, path: '/admin/inventory/deliveries', color: 'purple' },
        { icon: ShoppingCart, label: 'Open POs', val: kpi.open_pos, path: '/admin/purchase/orders', color: 'emerald' },
        { icon: Building2, label: 'Vendors', val: kpi.active_vendors, path: '/admin/purchase/vendors', color: 'orange' },
        { icon: Repeat, label: 'Recurring', val: kpi.recurring_active, path: '/admin/accounting/recurring', color: 'cyan' },
    ];

    const chartData = monthlyData.length > 0 ? monthlyData : [
        { name: 'Jan', income: 4000, expense: 2400 },
        { name: 'Feb', income: 3000, expense: 1398 },
        { name: 'Mar', income: 2000, expense: 9800 },
        { name: 'Apr', income: 2780, expense: 3908 },
        { name: 'May', income: 1890, expense: 4800 },
        { name: 'Jun', income: 2390, expense: 3800 },
    ];

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val || 0);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                        <Activity size={14} className="text-blue-400" />
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Enterprise Command Center</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">ERP Dashboard</h1>
                    <p className="text-slate-400 mt-2 text-lg">Financial overview and operations management.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button onClick={() => navigate('/admin/accounting/documents')} className="px-5 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 font-bold border border-slate-700 transition-all flex items-center gap-2">
                        <FolderKanban size={18} /> Document Hub
                    </button>
                    <button onClick={() => navigate('/admin/accounting/invoices/create')} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 hover:scale-105 active:scale-95">
                        <Plus size={18} /> New Invoice
                    </button>
                </div>
            </div>

            {/* Financial Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-panel p-6 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-transparent relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity"><Wallet size={120} /></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl"><Wallet size={20} /></div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300">Revenue</span>
                    </div>
                    <div className="text-3xl font-black text-white relative z-10">{formatCurrency(financials.total_revenue)}</div>
                    <div className="text-sm text-slate-400 mt-1 relative z-10 font-medium">Total Income Generated</div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-900/20 to-transparent relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity"><DollarSign size={120} /></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl"><DollarSign size={20} /></div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300">Expenses</span>
                    </div>
                    <div className="text-3xl font-black text-white relative z-10">{formatCurrency(financials.total_expenses)}</div>
                    <div className="text-sm text-slate-400 mt-1 relative z-10 font-medium">Operating Costs</div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-900/20 to-transparent relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp size={120} /></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl"><TrendingUp size={20} /></div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">Net Profit</span>
                    </div>
                    <div className="text-3xl font-black text-white relative z-10">{formatCurrency(financials.net_profit)}</div>
                    <div className="text-sm text-emerald-400 mt-1 relative z-10 font-bold">{profitMargin}% Margin</div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-transparent relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity"><Scale size={120} /></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl"><Scale size={20} /></div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300">A/R</span>
                    </div>
                    <div className="text-3xl font-black text-white relative z-10">{formatCurrency(financials.outstanding_balance)}</div>
                    <div className="text-sm text-slate-400 mt-1 relative z-10 font-medium">Outstanding Balance</div>
                </div>
            </div>

            {/* Main Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-slate-700/50">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white">Financial Performance</h3>
                            <p className="text-sm text-slate-400">Income vs Expenses (6 Months)</p>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="income" name="Income" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" name="Expenses" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Operations KPI */}
                <div className="glass-panel p-8 rounded-3xl border border-slate-700/50 flex flex-col">
                    <h3 className="text-xl font-black text-white mb-2">Operations</h3>
                    <p className="text-sm text-slate-400 mb-6">Current activity metrics</p>
                    
                    <div className="flex-1 flex flex-col gap-4 justify-between">
                        {quickLinks.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} onClick={() => navigate(item.path)} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-800/50 cursor-pointer transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl bg-${item.color}-500/20 text-${item.color}-400 group-hover:scale-110 transition-transform`}>
                                            <Icon size={18} />
                                        </div>
                                        <span className="font-bold text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl font-black text-white">{item.val || 0}</span>
                                        <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors group-hover:translate-x-1" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Quick Actions & System */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-slate-700/50">
                    <h3 className="text-xl font-black text-white mb-6">Financial Modules</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { icon: FileSpreadsheet, label: 'Ledger', path: '/admin/accounting/journal-entries', c: 'blue' },
                            { icon: Scale, label: 'Balance Sheet', path: '/admin/accounting/balance-sheet', c: 'purple' },
                            { icon: TrendingUp, label: 'Cash Flow', path: '/admin/accounting/cash-flow', c: 'emerald' },
                            { icon: BookOpen, label: 'A/R Aging', path: '/admin/accounting/aging-report', c: 'rose' },
                            { icon: Landmark, label: 'Banking', path: '/admin/accounting/banking', c: 'cyan' },
                            { icon: Server, label: 'Assets', path: '/admin/accounting/fixed-assets', c: 'orange' },
                            { icon: Repeat, label: 'Subscriptions', path: '/admin/accounting/recurring', c: 'blue' },
                            { icon: Shield, label: 'Audit Log', path: '/admin/settings/audit', c: 'slate' },
                        ].map((m, i) => {
                            const Icon = m.icon;
                            return (
                                <div key={i} onClick={() => navigate(m.path)} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-slate-600 cursor-pointer transition-all hover:bg-slate-800 group text-center flex flex-col items-center gap-3">
                                    <div className={`p-3 bg-${m.c}-500/10 text-${m.c}-400 rounded-xl group-hover:scale-110 transition-transform`}>
                                        <Icon size={24} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{m.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="glass-panel p-8 rounded-3xl border border-slate-700/50 flex flex-col justify-center">
                    <h3 className="text-xl font-black text-white mb-6">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                            <div className="flex items-center gap-3">
                                <Server size={18} className="text-slate-400" />
                                <span className="text-sm font-bold text-slate-300">Core ERP Engine</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-xs font-bold text-emerald-500 uppercase">{system.core}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                            <div className="flex items-center gap-3">
                                <Activity size={18} className="text-slate-400" />
                                <span className="text-sm font-bold text-slate-300">Financial DB</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-xs font-bold text-emerald-500 uppercase">{system.database}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountingDashboard;
