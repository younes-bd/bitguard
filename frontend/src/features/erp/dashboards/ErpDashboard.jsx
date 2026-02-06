import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { erpService } from '../../../shared/core/services/erpService';
import {
    FolderKanban, CheckSquare, Clock,
    ArrowUpRight, Plus, Activity, AlertTriangle, FileText,
    TrendingUp, DollarSign, PieChart, Shield
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

    if (!data) return <div className="text-white">Failed to load data.</div>;

    const { kpi, financials, system } = data;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">ERP Overview</h1>
                    <p className="text-slate-400">Enterprise Resource Planning & Operations</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/erp/projects')}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        All Projects
                    </button>
                    <button
                        onClick={() => navigate('/erp/projects/create')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        <span>New Project</span>
                    </button>
                </div>
            </div>

            {/* Row 1: KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                            <FolderKanban size={24} />
                        </div>
                        <span className="text-xs text-slate-500 flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                            <ArrowUpRight size={14} />
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{kpi.active_projects}</div>
                    <div className="text-xs text-slate-400">Active Projects</div>
                    <div className="text-xs text-slate-600 mt-1">{kpi.planning_projects} in planning</div>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-purple-500/30 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                            <CheckSquare size={24} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{kpi.my_tasks}</div>
                    <div className="text-xs text-slate-400">My Tasks</div>
                    <div className="text-xs text-slate-600 mt-1">{kpi.overdue_tasks} overdue</div>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-orange-500/30 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                            <Shield size={24} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{kpi.high_risks}</div>
                    <div className="text-xs text-slate-400">High Risks</div>
                    <div className="text-xs text-slate-600 mt-1">Action Required</div>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                            <FileText size={24} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{kpi.new_invoices}</div>
                    <div className="text-xs text-slate-400">New Invoices</div>
                    <div className="text-xs text-slate-600 mt-1">Pending Approval</div>
                </div>
            </div>

            {/* Row 2: Financial Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">YTD</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                        ${financials.total_revenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">
                        Recurring: ${financials.mrr.toLocaleString()}
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Costs</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-700/50 text-slate-300">Stable</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                        ${financials.total_costs.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">
                        Profit: ${(financials.total_revenue - financials.total_costs).toLocaleString()}
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-slate-700/50 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 p-12 opacity-5 rounded-full blur-2xl ${financials.net_profit > 0 ? 'bg-emerald-500' : 'bg-red-500'
                        }`}></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Profit</span>
                        <span className={`px-2 py-0.5 rounded text-xs border ${financials.profit_margin > 20
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            }`}>
                            {financials.profit_margin}% Margin
                        </span>
                    </div>
                    <div className={`text-3xl font-bold mb-2 relative z-10 ${financials.net_profit > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                        ${financials.net_profit.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400 relative z-10">
                        Result after all expenses
                    </div>
                </div>
            </div>

            {/* Row 3: Operations & System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Operational Health */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-slate-700/50">
                    <h3 className="text-lg font-bold text-white mb-6">Operational Health</h3>
                    <div className="space-y-6">

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Budget Usage</span>
                                <span className="text-white font-medium">{kpi.budget_usage}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min(kpi.budget_usage, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Resource Utilization</span>
                                <span className="text-white font-medium">{kpi.resource_utilization}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div
                                    className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min(kpi.resource_utilization, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">SLA Compliance</span>
                                <span className="text-emerald-400 font-medium">{kpi.sla_health}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div
                                    className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: '99.9%' }}
                                ></div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* System Status & Quick Reports */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                        <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                    <span className="text-sm font-medium text-white">Core ERP</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-500 uppercase">{system.core}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${system.database === 'Operational' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'
                                        }`}></div>
                                    <span className="text-sm font-medium text-white">Database</span>
                                </div>
                                <span className={`text-xs font-bold uppercase ${system.database === 'Operational' ? 'text-emerald-500' : 'text-red-500'
                                    }`}>{system.database}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                        <h3 className="text-lg font-bold text-white mb-4">Reports Center</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors group">
                                <PieChart size={20} className="text-blue-500 group-hover:scale-110 transition-transform" />
                                <span className="text-xs text-slate-300">Financials</span>
                            </button>
                            <button className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors group">
                                <Activity size={20} className="text-orange-500 group-hover:scale-110 transition-transform" />
                                <span className="text-xs text-slate-300">Ops</span>
                            </button>
                            <button className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors group">
                                <Shield size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
                                <span className="text-xs text-slate-300">Risks</span>
                            </button>
                            <button className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors group">
                                <Clock size={20} className="text-purple-500 group-hover:scale-110 transition-transform" />
                                <span className="text-xs text-slate-300">Audits</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErpDashboard;

