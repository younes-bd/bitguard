import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import securityService from '../../../core/api/securityService';
import {
    ShieldCheckIcon,
    BellAlertIcon,
    FireIcon,
    ComputerDesktopIcon,
    CheckCircleIcon,
    ArrowTrendingUpIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';

const SocDashboard = () => {
    const [stats, setStats] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsData, alertsRes] = await Promise.all([
                securityService.getDashboardStats(),
                securityService.getAlerts({ is_resolved: false }),
            ]);
            // platformService.getDashboardStats() returns { data: { open_alerts, open_incidents, managed_endpoints, monitored_apps } }
            setStats(statsData?.data ?? statsData);
            const alertList = alertsRes?.data?.results ?? alertsRes?.data ?? [];
            setAlerts(Array.isArray(alertList) ? alertList.slice(0, 5) : []);
        } catch (error) {
            console.error('Failed to fetch SOC dashboard data', error);
            setStats({ open_alerts: 0, open_incidents: 0, managed_endpoints: 0, monitored_apps: 0 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
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

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Security Operations Center</h1>
                    <p className="text-slate-400">Real-time threat monitoring and response.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
                    title="Refresh"
                >
                    <ArrowPathIcon className="w-5 h-5" />
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KpiCard
                    icon={<BellAlertIcon className="w-8 h-8 text-rose-500" />}
                    label="Active Alerts"
                    value={loading ? '…' : (stats?.open_alerts ?? 0)}
                    sub="Unresolved detections"
                    color="rose"
                />
                <KpiCard
                    icon={<FireIcon className="w-8 h-8 text-orange-500" />}
                    label="Open Incidents"
                    value={loading ? '…' : (stats?.open_incidents ?? 0)}
                    sub="Requires attention"
                    color="orange"
                />
                <KpiCard
                    icon={<ComputerDesktopIcon className="w-8 h-8 text-blue-500" />}
                    label="Managed Endpoints"
                    value={loading ? '…' : (stats?.managed_endpoints ?? 0)}
                    sub="Registered devices"
                    color="blue"
                />
                <KpiCard
                    icon={<ShieldCheckIcon className="w-8 h-8 text-emerald-500" />}
                    label="Monitored Apps"
                    value={loading ? '…' : (stats?.monitored_apps ?? 0)}
                    sub="Cloud app inventory"
                    color="emerald"
                />
            </div>

            {/* Quick Navigation Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Alerts', path: 'alerts', color: 'rose' },
                    { label: 'Incidents', path: 'incidents', color: 'orange' },
                    { label: 'Endpoints', path: 'assets', color: 'blue' },
                    { label: 'Workspaces', path: 'workspaces', color: 'indigo' },
                    { label: 'Cloud Apps', path: 'cloud', color: 'purple' },
                    { label: 'Network', path: 'network', color: 'cyan' },
                    { label: 'Remote Sessions', path: 'remote', color: 'pink' },
                    { label: 'Threat Intel', path: 'intel', color: 'amber' },
                ].map(({ label, path, color }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`bg-slate-800 border border-slate-700 hover:border-${color}-500/40 hover:bg-slate-700/60 rounded-xl p-4 text-center transition-all group`}
                    >
                        <p className={`text-sm font-medium text-slate-300 group-hover:text-${color}-400 transition-colors`}>{label}</p>
                    </Link>
                ))}
            </div>

            {/* Recent Alerts Feed */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl">
                <div className="p-5 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <BellAlertIcon className="w-5 h-5 text-indigo-500" />
                        Recent Alerts
                    </h3>
                    <Link to="alerts" className="text-xs text-indigo-400 hover:text-indigo-300">View All →</Link>
                </div>
                <div className="divide-y divide-slate-700">
                    {alerts.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
                            <CheckCircleIcon className="w-10 h-10 text-emerald-600/40" />
                            {loading ? 'Loading…' : 'No active alerts — system is clear'}
                        </div>
                    ) : (
                        alerts.map(alert => (
                            <div key={alert.id} className="p-4 hover:bg-slate-700/30 transition-colors flex items-start gap-4">
                                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${alert.severity === 'critical' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' :
                                        alert.severity === 'high' ? 'bg-orange-500' :
                                            alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                                    }`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="font-medium text-slate-200 truncate">{alert.title}</h4>
                                        <span className={`flex-shrink-0 px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${getSeverityColor(alert.severity)}`}>
                                            {alert.severity}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400 mt-1 line-clamp-1">{alert.description}</p>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                                        <span>{new Date(alert.created_at).toLocaleTimeString()}</span>
                                        {alert.source && <><span>•</span><span>{alert.source}</span></>}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const KpiCard = ({ icon, label, value, sub, color }) => (
    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 relative overflow-hidden group">
        <div className="absolute right-3 top-3 opacity-10 group-hover:opacity-20 transition-opacity">
            {icon}
        </div>
        <p className="text-slate-400 font-medium text-sm">{label}</p>
        <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
        <p className="mt-1 text-xs text-slate-500">{sub}</p>
    </div>
);

export default SocDashboard;
