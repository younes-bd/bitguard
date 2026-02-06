import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import securityService from '../../../shared/core/services/securityService';
import {
    ShieldExclamationIcon,
    FunnelIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const AlertsPage = () => {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const response = await securityService.getAlerts();
            const data = response.data.results || response.data;
            setAlerts(data);
        } catch (error) {
            console.error("Failed to fetch alerts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
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

    const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter);

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Security Alerts</h1>
                    <p className="text-slate-400">Monitor and triage security detections.</p>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search alerts..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none"
                >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Title / Description</th>
                                <th className="p-4 font-medium">Severity</th>
                                <th className="p-4 font-medium">MITRE ATT&CK</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Time</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredAlerts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">
                                        No alerts found.
                                    </td>
                                </tr>
                            ) : (
                                filteredAlerts.map((alert) => (
                                    <tr key={alert.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{alert.title}</div>
                                            <div className="text-xs text-slate-500 truncate max-w-xs">{alert.description}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded border text-xs font-bold uppercase ${getSeverityColor(alert.severity)}`}>
                                                {alert.severity}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {alert.mitre_tactic && (
                                                <span className="inline-block px-2 py-0.5 rounded bg-slate-700 text-xs text-slate-300 mr-1">
                                                    {alert.mitre_tactic}
                                                </span>
                                            )}
                                            {alert.mitre_technique && (
                                                <span className="inline-block px-2 py-0.5 rounded bg-slate-700 text-xs text-slate-300">
                                                    {alert.mitre_technique}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="capitalize text-slate-300">{alert.status.replace('_', ' ')}</span>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            {new Date(alert.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => navigate(`/admin/security/alerts/${alert.id}`)}
                                                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AlertsPage;
