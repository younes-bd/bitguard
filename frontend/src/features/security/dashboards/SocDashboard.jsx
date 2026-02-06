import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import securityService from '../../../shared/core/services/securityService';
import {
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    ComputerDesktopIcon,
    BugAntIcon,
    BoltIcon,
    ArrowRightIcon,
    GlobeAltIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, label, icon: Icon, color, onClick }) => (
    <div
        onClick={onClick}
        className={`bg-slate-800 p-6 rounded-xl border border-slate-700 cursor-pointer hover:border-${color}-500/50 transition-all hover:bg-slate-750 group`}
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            {value > 0 && (
                <span className={`px-2 py-1 rounded text-xs font-bold bg-${color}-500/20 text-${color}-400`}>
                    +2 this week
                </span>
            )}
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">{title}</p>
        {label && <p className="text-slate-500 text-xs mt-2">{label}</p>}
    </div>
);

const SocDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await securityService.getDashboardStats();
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading security overview...</div>;

    const data = stats || {
        alerts: { total: 0, critical: 0, high: 0 },
        incidents: { total: 0, active: 0 },
        assets: { total: 0, compromised: 0 },
        vulnerabilities: { total: 0, critical: 0 }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Security Operations Center</h1>
                    <p className="text-slate-400 mt-1">Real-time threat monitoring and response console.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg hover:text-white transition-colors text-sm font-medium">
                        Export Report
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-indigo-500/20">
                        Scan Network
                    </button>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Alerts"
                    value={data.alerts.open}
                    label={`${data.alerts.critical} Critical, ${data.alerts.high} High`}
                    icon={ShieldCheckIcon}
                    color="rose"
                    onClick={() => navigate('/admin/security/alerts')}
                />
                <StatCard
                    title="Active Incidents"
                    value={data.incidents.active}
                    label="Requires immediate attention"
                    icon={ExclamationTriangleIcon}
                    color="amber"
                    onClick={() => navigate('/admin/security/incidents')}
                />
                <StatCard
                    title="Compromised Assets"
                    value={data.assets.compromised}
                    label={`Out of ${data.assets.total} monitored`}
                    icon={ComputerDesktopIcon}
                    color="purple"
                    onClick={() => navigate('/admin/security/assets')}
                />
                <StatCard
                    title="Critical Vulns"
                    value={data.vulnerabilities.critical}
                    label="Patching overdue"
                    icon={BugAntIcon}
                    color="orange"
                    onClick={() => navigate('/admin/security/vulnerabilities')}
                />
            </div>

            {/* Quick Actions & Module Navigation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <ChartBarIcon className="w-5 h-5 text-indigo-400" />
                        Quick Access
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/admin/security/intel')}
                            className="p-4 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-left transition-colors group"
                        >
                            <GlobeAltIcon className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                            <div className="font-semibold text-white">Threat Intel</div>
                            <div className="text-xs text-slate-400">IOCs & Feeds</div>
                        </button>
                        <button
                            onClick={() => navigate('/admin/security/assets')}
                            className="p-4 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-left transition-colors group"
                        >
                            <ComputerDesktopIcon className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                            <div className="font-semibold text-white">Asset Inventory</div>
                            <div className="text-xs text-slate-400">Manage Endpoints</div>
                        </button>
                        {/* More buttons... */}
                    </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {data.alerts.recent?.length > 0 ? (
                            data.alerts.recent.map(a => (
                                <div key={a.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                        <span className="text-sm text-slate-300">{a.title}</span>
                                    </div>
                                    <span className="text-xs text-slate-500">Just now</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-slate-500 py-8">
                                No recent activity to display.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocDashboard;
