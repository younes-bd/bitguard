
import React, { useEffect, useState } from 'react';
import {
    Activity, Users, ShieldAlert, Server,
    ArrowUpRight, DollarSign, TrendingUp, Briefcase
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { dashboardService } from '../../shared/core/services/dashboardService';

const CommandCenter = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        kpi: {
            revenue: 0,
            active_projects: 0,
            total_clients: 0,
            active_users: 0,
            security_alerts: 0,
            active_incidents: 0
        },
        activity: [],
        charts: { revenue: [], labels: [] }
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const result = await dashboardService.getStats();
                setData(result);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Transform chart data for Recharts
    const chartData = data.charts.revenue.map((val, index) => ({
        name: data.charts.labels[index] || index,
        value: val
    }));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Command Center</h1>
                    <p className="text-slate-400 text-sm">Real-time overview of your platform ecosystem.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700">
                        View Audit Log
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
                        Generate Report
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    label="Total Revenue"
                    value={`$${data.kpi.revenue.toLocaleString()}`}
                    subvalue="+12% vs last month"
                    icon={DollarSign}
                    color="text-emerald-400"
                    bg="bg-emerald-400/10"
                />
                <KPICard
                    label="Active Projects"
                    value={data.kpi.active_projects}
                    subvalue={`${data.kpi.total_clients} Active Clients`}
                    icon={Briefcase}
                    color="text-blue-400"
                    bg="bg-blue-400/10"
                />
                <KPICard
                    label="Security Status"
                    value={`${data.kpi.security_alerts} Alerts`}
                    subvalue={`${data.kpi.active_incidents} Open Incidents`}
                    icon={ShieldAlert}
                    color="text-red-400"
                    bg="bg-red-400/10"
                />
                <KPICard
                    label="System Activity"
                    value={data.kpi.active_users}
                    subvalue="Active Users Now"
                    icon={Activity}
                    color="text-orange-400"
                    bg="bg-orange-400/10"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Revenue/Performance Chart */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">Revenue Performance</h3>
                        <div className="flex gap-2">
                            <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Live</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                    itemStyle={{ color: '#60a5fa' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Live Activity Feed */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-0 overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-slate-800 bg-slate-900/50">
                        <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                    </div>
                    <div className="p-5 overflow-y-auto max-h-[300px] space-y-4 flex-1">
                        {data.activity.length > 0 ? (
                            data.activity.map((item, idx) => (
                                <div key={idx} className="flex gap-3 group">
                                    <div className="mt-1">
                                        <div className={`w-2 h-2 rounded-full ring-4 ring-opacity-20 ${item.status === 'critical' ? 'bg-red-500 ring-red-500' :
                                                item.status === 'high' ? 'bg-orange-500 ring-orange-500' :
                                                    'bg-blue-500 ring-blue-500'
                                            }`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                                            {item.description}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-500 text-sm">
                                No recent activity logged.
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-slate-950 border-t border-slate-800">
                        <button className="w-full py-2 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors">
                            View Full Log
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable KPI Card Component
const KPICard = ({ label, value, subvalue, icon: Icon, color, bg }) => (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${bg} ${color}`}>
                <Icon size={24} />
            </div>
            {/* Optional Trend Indicator could go here */}
        </div>
        <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
            <p className="text-sm font-medium text-slate-400">{label}</p>
        </div>
        {subvalue && (
            <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-400" />
                <span className="text-xs text-slate-500 font-medium">{subvalue}</span>
            </div>
        )}
    </div>
);

export default CommandCenter;
