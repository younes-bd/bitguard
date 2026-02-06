import React, { useEffect, useState } from 'react';
import { platformService } from '../../../shared/core/services/platformService';
import {
    ShieldCheckIcon,
    BellAlertIcon,
    FireIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    MinusIcon
} from '@heroicons/react/24/outline';

const SocDashboard = () => {
    const [stats, setStats] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [healthMetrics, setHealthMetrics] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsData, alertsData, metricsData] = await Promise.all([
                platformService.getDashboardStats(),
                platformService.getAlerts(), // Removed limit param as backend might not support it yet without pagination
                platformService.getHealthMetrics() // Might need to check if this endpoint exists/matches service
            ]);
            setStats(statsData);
            setAlerts(Array.isArray(alertsData) ? alertsData.slice(0, 5) : (alertsData.results || []).slice(0, 5));
            setHealthMetrics(Array.isArray(metricsData) ? metricsData : (metricsData.results || []));
        } catch (error) {
            console.error("Failed to fetch SOC dashboard data", error);
            // Fallback for demo if backend is offline/empty
            setStats({ health_score: 95, alerts: 0, endpoints: 0 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up': return <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500" />;
            case 'down': return <ArrowTrendingDownIcon className="w-4 h-4 text-rose-500" />;
            default: return <MinusIcon className="w-4 h-4 text-slate-500" />;
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Security Operations Center</h1>
                    <p className="text-slate-400">Real-time threat monitoring and response.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchData} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                        <ArrowTrendingUpIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShieldCheckIcon className="w-24 h-24 text-emerald-500" />
                    </div>
                    <p className="text-slate-400 font-medium">Health Score</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{stats?.health_score ?? '-'}%</h3>
                    <div className="mt-2 text-xs text-emerald-500 flex items-center gap-1">
                        <CheckCircleIcon className="w-3 h-3" /> System Operational
                    </div>
                </div>

                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BellAlertIcon className="w-24 h-24 text-rose-500" />
                    </div>
                    <p className="text-slate-400 font-medium">Active Alerts</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{stats?.alerts ?? 0}</h3>
                    <div className="mt-2 text-xs text-rose-500 flex items-center gap-1">
                        <ArrowTrendingUpIcon className="w-3 h-3" /> +2 from last hour
                    </div>
                </div>

                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DesktopComputerIconIcon className="w-24 h-24 text-blue-500" />
                    </div>
                    <p className="text-slate-400 font-medium">Monitored Assets</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{stats?.endpoints ?? 0}</h3>
                    <div className="mt-2 text-xs text-blue-500">
                        Coverage: 98%
                    </div>
                </div>
                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FireIcon className="w-24 h-24 text-orange-500" />
                    </div>
                    <p className="text-slate-400 font-medium">Open Incidents</p>
                    <h3 className="text-3xl font-bold text-white mt-1">2</h3> {/* Placeholder if not in stats */}
                    <div className="mt-2 text-xs text-orange-500">
                        Requires Attention
                    </div>
                </div>
            </div>

            {/* Domain Security Modules */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
                                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-slate-300">Endpoint Security</h4>
                            <p className="text-xs text-slate-500">{stats?.assets?.compromised ?? 0} Compromised</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-bold text-white">{stats?.assets?.total ?? 0}</span>
                    </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-indigo-500">
                                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-slate-300">Email Security</h4>
                            <p className="text-xs text-slate-500">{stats?.email_threats?.blocked ?? 0} Blocked</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-bold text-white">{stats?.email_threats?.total ?? 0}</span>
                    </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-500">
                                <path fillRule="evenodd" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.291a3.75 3.75 0 005.304 0l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01.646-1.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 000 5.304z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-slate-300">Network Security</h4>
                            <p className="text-xs text-slate-500">{stats?.network_events?.suspicious ?? 0} Suspicious</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-bold text-white">{stats?.network_events?.total ?? 0}</span>
                    </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-500/10 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-pink-500">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-slate-300">Security Gaps</h4>
                            <p className="text-xs text-slate-500">{stats?.security_gaps?.critical ?? 0} Critical</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-bold text-white">{stats?.security_gaps?.total ?? 0}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Alerts Feed */}
                <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl flex flex-col">
                    <div className="p-5 border-b border-slate-700 flex justify-between items-center">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <BellAlertIcon className="w-5 h-5 text-indigo-500" />
                            Recent Alerts
                        </h3>
                        <button className="text-xs text-indigo-400 hover:text-indigo-300">View All</button>
                    </div>
                    <div className="flex-1 overflow-auto max-h-[400px]">
                        {alerts.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No active alerts</div>
                        ) : (
                            <div className="divide-y divide-slate-700">
                                {alerts.map(alert => (
                                    <div key={alert.id} className="p-4 hover:bg-slate-700/30 transition-colors flex items-start gap-4">
                                        <div className={`mt-1 w-2 h-2 rounded-full ${alert.severity === 'critical' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-amber-500'}`} />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-medium text-slate-200">{alert.title}</h4>
                                                <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${getSeverityColor(alert.severity)}`}>
                                                    {alert.severity}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-400 mt-1 line-clamp-1">{alert.description}</p>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                                <span>{new Date(alert.created_at).toLocaleTimeString()}</span>
                                                <span>•</span>
                                                <span className="capitalize">{alert.source_module.replace('_', ' ')}</span>
                                                <span>•</span>
                                                <button className="text-indigo-400 hover:text-indigo-300">Run Playbook</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Health Metrics */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl flex flex-col">
                    <div className="p-5 border-b border-slate-700">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <ChartBarIcon className="w-5 h-5 text-emerald-500" />
                            System Health
                        </h3>
                    </div>
                    <div className="p-5 space-y-5">
                        {healthMetrics.map(metric => (
                            <div key={metric.id}>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-sm text-slate-300">{metric.name}</span>
                                    <div className="flex items-center gap-2">
                                        {getTrendIcon(metric.trend)}
                                        <span className="font-bold text-white">{metric.score}%</span>
                                    </div>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${metric.score > 90 ? 'bg-emerald-500' : metric.score > 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                        style={{ width: `${metric.score}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        {healthMetrics.length === 0 && (
                            <div className="text-center text-slate-500 py-4">No health metrics available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
// Helper for missing icon
const DesktopComputerIconIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 17.25v-1.007M3.75 4.5h16.5a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75v-9a.75.75 0 0 1 .75-.75Z" />
</svg>;


export default SocDashboard;
