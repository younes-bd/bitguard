import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { erpService } from '../../../../core/api/erpService';
import {
    FolderKanban, CheckSquare, Clock,
    ArrowUpRight, Plus, Activity, AlertTriangle, FileText,
    TrendingUp, DollarSign, PieChart, Shield,
    Building2, ShoppingCart, Repeat, BookOpen,
    Landmark, Scale, FileSpreadsheet, Server
} from 'lucide-react';

const ErpDashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const stats = await erpService.getDashboardStats();
                setData(stats);
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!data) return <div className="text-white p-8">Failed to load data. The API returned null.</div>;
    if (!data.financials || !data.kpi) return <div className="text-white p-8 overflow-auto"><pre>{JSON.stringify(data, null, 2)}</pre></div>;

    const { kpi, financials, system = { core: 'Unknown', database: 'Unknown' } } = data;
    const profitMargin = financials?.total_revenue > 0 
        ? ((financials.net_profit / financials.total_revenue) * 100).toFixed(1)
        : 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">ERP Control Center</h1>
                    <p className="text-slate-400">Manage your company's billing, financials, and delivery operations.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/admin/erp/invoices')}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        Invoice Management
                    </button>
                    <button
                        onClick={() => navigate('/admin/erp/invoices/create')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        <span>New Invoice</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                    onClick={() => navigate('/admin/erp/projects')}
                    className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-colors group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                            <FolderKanban size={24} />
                        </div>
                        <span className="text-xs text-slate-500 flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                            <ArrowUpRight size={14} /> View
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{kpi.active_projects || 0}</div>
                    <div className="text-xs text-slate-400">Active Projects</div>
                </div>

                <div 
                    onClick={() => navigate('/admin/erp/invoices')}
                    className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-orange-500/30 transition-colors group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">{kpi.overdue_invoices || 0}</div>
                    <div className="text-xs text-slate-400">Overdue Invoices</div>
                </div>

                <div 
                    onClick={() => navigate('/admin/erp/delivery')}
                    className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-purple-500/30 transition-colors group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                            <Activity size={24} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{kpi.pending_delivery || 0}</div>
                    <div className="text-xs text-slate-400">Pending Deliveries</div>
                </div>

                <div 
                    onClick={() => navigate('/admin/erp/vendors')}
                    className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                            <Building2 size={24} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                        <div className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">{kpi.active_vendors || 0}</div>
                        <div className="text-sm font-medium text-slate-300">Vendors</div>
                    </div>
                    <div className="text-xs text-slate-400">Supplier Directory</div>
                </div>

                <div 
                    onClick={() => navigate('/admin/erp/purchase-orders')}
                    className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-colors group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                            <ShoppingCart size={24} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                        <div className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{kpi.open_pos || 0}</div>
                        <div className="text-sm font-medium text-slate-300">Open POs</div>
                    </div>
                    <div className="text-xs text-slate-400">Purchase Orders</div>
                </div>

                <div 
                    onClick={() => navigate('/admin/erp/recurring')}
                    className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-purple-500/30 transition-colors group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                            <Repeat size={24} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                        <div className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">{kpi.recurring_active || 0}</div>
                        <div className="text-sm font-medium text-slate-300">Active Auto</div>
                    </div>
                    <div className="text-xs text-slate-400">Recurring Invoices</div>
                </div>

                <div 
                    onClick={() => navigate('/admin/erp/aging-report')}
                    className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-rose-500/30 transition-colors group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
                            <BookOpen size={24} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1 group-hover:text-rose-400 transition-colors">A/R Aging</div>
                    <div className="text-xs text-slate-400">Financial Reports</div>
                </div>
                <div 
                    onClick={() => navigate('/admin/erp/banking')}
                    className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                            <Landmark size={24} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">Banking</div>
                    <div className="text-xs text-slate-400">Cash Flow</div>
                </div>

                <div 
                    onClick={() => navigate('/admin/erp/journal-entries')}
                    className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-colors group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                            <FileSpreadsheet size={24} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Ledger</div>
                    <div className="text-xs text-slate-400">Journal Entries</div>
                </div>

                <div 
                    onClick={() => navigate('/admin/erp/balance-sheet')}
                    className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-purple-500/30 transition-colors group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                            <Scale size={24} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">Balance Sheet</div>
                    <div className="text-xs text-slate-400">Assets = Liab + Equity</div>
                </div>

                <div 
                    onClick={() => navigate('/admin/erp/cash-flow')}
                    className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">Cash Flow</div>
                    <div className="text-xs text-slate-400">Statement of Cash Flows</div>
                </div>

                <div 
                    onClick={() => navigate('/admin/erp/fixed-assets')}
                    className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-colors group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                            <Server size={24} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Fixed Assets</div>
                    <div className="text-xs text-slate-400">Asset Depreciation</div>
                </div>
            </div>

            {/* Financial Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
                        <TrendingUp size={16} className="text-emerald-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                        ${financials.total_revenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">
                        Total paid amount
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Expenses</span>
                        <DollarSign size={16} className="text-red-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                        ${financials.total_expenses.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">
                        Software, Hardware, etc.
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-slate-700/50 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Profit</span>
                        <span className={`px-2 py-0.5 rounded text-xs border ${profitMargin > 15
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            }`}>
                            {profitMargin}% Margin
                        </span>
                    </div>
                    <div className={`text-3xl font-bold mb-2 relative z-10 ${financials.net_profit > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                        ${financials.net_profit.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400 relative z-10">
                        Revenue minus expenses
                    </div>
                </div>
            </div>

            {/* System Status & Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-slate-700/50">
                    <h3 className="text-lg font-bold text-white mb-6">Operations Overview</h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded bg-blue-500/10 text-blue-400">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">Invoicing Flow</div>
                                    <div className="text-xs text-slate-400">Automated generation active</div>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Active</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded bg-purple-500/10 text-purple-400">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">Delivery Tracking</div>
                                    <div className="text-xs text-slate-400">SLA monitor operational</div>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">Running</span>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <h3 className="text-lg font-bold text-white mb-4">Infrastructure</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                            <span className="text-sm text-slate-300">Core ERP Engine</span>
                            <span className="text-xs font-bold text-emerald-500 uppercase">{system.core}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                            <span className="text-sm text-slate-300">Financial Database</span>
                            <span className="text-xs font-bold text-emerald-500 uppercase">{system.database}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErpDashboard;


