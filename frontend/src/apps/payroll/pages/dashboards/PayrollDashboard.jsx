import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DollarSign, Users, Activity, FileText,
    PieChart, Clock, CheckCircle2, AlertTriangle, ArrowRight, TrendingUp, TrendingDown, Loader2
} from 'lucide-react';
import { hrmService } from '../../../../core/api/hrmService';

const PayrollDashboard = () => {
    const navigate = useNavigate();
    const [recentRuns, setRecentRuns] = useState([]);
    const [metrics, setMetrics] = useState({
        last_run_total: 0,
        ytd_payroll: 0,
        active_employees: 0,
        pending_approvals: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            hrmService.getPayslipBatches(),
            hrmService.getDashboardStats()
        ]).then(([batchesData, statsData]) => {
            const batchesList = Array.isArray(batchesData) ? batchesData : batchesData?.results || [];
            
            const mappedRuns = batchesList.slice(0, 5).map(b => ({
                id: b.id,
                period: b.name,
                date: b.date_end,
                employees: statsData?.headcount || 0, // Mocking employees per run for now
                total: statsData?.total_salary || 0, // Mocking total per run
                status: b.state === 'close' ? 'Closed' : 'Open'
            }));

            setRecentRuns(mappedRuns);

            setMetrics({
                last_run_total: statsData?.total_salary || 0,
                ytd_payroll: (statsData?.total_salary || 0) * 12, // Rough YTD calculation
                active_employees: statsData?.headcount || 0,
                pending_approvals: statsData?.pending_leaves || 0, // Reusing leave requests as a proxy
            });
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const alerts = [
        { message: 'Check pending leave requests before closing payroll', type: 'warning', action: 'Review Now' },
    ];

    if (loading) {
        return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-indigo-400" size={32}/></div>;
    }

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold border-l-4 border-indigo-500 pl-4 py-1 text-white font-['Oswald'] tracking-wider uppercase drop-shadow-md">
                        Payroll Operations
                    </h1>
                    <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide">
                        Enterprise salary, tax, and benefits management
                    </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => navigate('/hrm/payroll/batches')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/50"
                    >
                        <Clock size={16} />
                        View All Runs
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-bold text-sm">
                        <DollarSign size={16} />
                        Process New Run
                    </button>
                </div>
            </div>

            {/* Alerts */}
            {alerts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {alerts.map((alert, i) => (
                        <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${alert.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
                            <div className="flex items-center gap-3">
                                {alert.type === 'warning' ? <AlertTriangle className="text-amber-400" size={20} /> : <Activity className="text-blue-400" size={20} />}
                                <span className="text-slate-300 font-medium text-sm">{alert.message}</span>
                            </div>
                            <button className={`text-xs font-bold uppercase tracking-wider ${alert.type === 'warning' ? 'text-amber-400 hover:text-amber-300' : 'text-blue-400 hover:text-blue-300'} transition-colors`}>
                                {alert.action}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between hover:bg-slate-800/60 transition-colors group">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
                            <DollarSign size={22} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                            <TrendingUp size={12} /> +1.8%
                        </span>
                    </div>
                    <div className="mt-4">
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Last Run Total</p>
                        <p className="text-3xl font-bold text-white mt-1 font-mono">${metrics.last_run_total.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between hover:bg-slate-800/60 transition-colors group">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                            <PieChart size={22} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">YTD Payroll Spend</p>
                        <p className="text-3xl font-bold text-white mt-1 font-mono">${metrics.ytd_payroll.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between hover:bg-slate-800/60 transition-colors group">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                            <Users size={22} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Active Employees</p>
                        <p className="text-3xl font-bold text-white mt-1 font-mono">{metrics.active_employees}</p>
                    </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between hover:bg-slate-800/60 transition-colors group">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl group-hover:bg-amber-500/20 transition-colors">
                            <FileText size={22} />
                        </div>
                        {metrics.pending_approvals > 0 && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        )}
                    </div>
                    <div className="mt-4">
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Pending Approvals</p>
                        <p className="text-3xl font-bold text-white mt-1 font-mono">{metrics.pending_approvals}</p>
                    </div>
                </div>
            </div>

            {/* Dashboard Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Pay Runs Table */}
                <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl overflow-hidden shadow-xl">
                    <div className="px-6 py-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Clock size={18} className="text-indigo-400" />
                            Recent Pay Runs
                        </h2>
                        <button onClick={() => navigate('/hrm/payroll/batches')} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider transition-colors flex items-center gap-1">
                            View All <ArrowRight size={14} />
                        </button>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/20">
                            <tr className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                                <th className="p-5 border-b border-slate-700/50">Period</th>
                                <th className="p-5 border-b border-slate-700/50">Date</th>
                                <th className="p-5 border-b border-slate-700/50 text-center">Employees</th>
                                <th className="p-5 border-b border-slate-700/50">Status</th>
                                <th className="p-5 border-b border-slate-700/50 text-right">Total Payout</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentRuns.length === 0 ? (
                                <tr><td colSpan="5" className="p-5 text-center text-slate-500">No recent runs</td></tr>
                            ) : recentRuns.map((run) => (
                                <tr key={run.id} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                                    <td className="p-5 font-bold text-white">{run.period}</td>
                                    <td className="p-5 text-sm text-slate-400">{run.date}</td>
                                    <td className="p-5 text-sm text-slate-300 text-center">{run.employees}</td>
                                    <td className="p-5">
                                        <span className={`px-2 py-1 border rounded-md text-[10px] font-bold uppercase ${run.status === 'Closed' ? 'bg-slate-500/10 border-slate-500/20 text-slate-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                                            {run.status}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right font-mono font-bold text-slate-200">
                                        ${run.total.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Payroll Composition */}
                <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl overflow-hidden shadow-xl flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-700/50 bg-slate-800/30">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <PieChart size={18} className="text-blue-400" />
                            Cost Breakdown
                        </h2>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-center">
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-300 font-medium">Basic Salary</span>
                                    <span className="text-white font-mono font-bold">68%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full w-[68%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-300 font-medium">Allowances / Benefits</span>
                                    <span className="text-white font-mono font-bold">18%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full w-[18%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-300 font-medium">Taxes / Deductions</span>
                                    <span className="text-white font-mono font-bold">14%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full w-[14%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayrollDashboard;
