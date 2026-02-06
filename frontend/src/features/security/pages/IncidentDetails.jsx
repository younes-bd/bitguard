import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import securityService from '../../../shared/core/services/securityService';
import {
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    UserIcon,
    WrenchIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';

const IncidentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [incident, setIncident] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchIncident();
    }, [id]);

    const fetchIncident = async () => {
        try {
            const response = await securityService.getIncident(id);
            setIncident(response.data);
        } catch (error) {
            console.error("Failed to fetch incident", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading incident details...</div>;
    if (!incident) return <div className="p-8 text-center text-slate-500">Incident not found.</div>;

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/admin/security/incidents')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        {incident.title}
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${incident.severity === 'critical' ? 'bg-rose-500/10 border-rose-500 text-rose-500' :
                                incident.severity === 'high' ? 'bg-orange-500/10 border-orange-500 text-orange-500' :
                                    'bg-blue-500/10 border-blue-500 text-blue-500'
                            }`}>
                            {incident.severity}
                        </span>
                    </h1>
                    <div className="flex gap-4 mt-2 text-sm text-slate-400">
                        <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> Created: {new Date(incident.created_at).toLocaleString()}</span>
                        <span className="flex items-center gap-1"><UserIcon className="w-4 h-4" /> Assignee: {incident.assignee ? incident.assignee.username : 'Unassigned'}</span>
                        <span className="flex items-center gap-1">Status: <span className="text-white capitalize">{incident.status}</span></span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-700">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-3 px-2 text-sm font-medium transition-colors ${activeTab === 'overview' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400 hover:text-white'}`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('remediation')}
                    className={`pb-3 px-2 text-sm font-medium transition-colors ${activeTab === 'remediation' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400 hover:text-white'}`}
                >
                    Remediation Actions
                </button>
                <button
                    onClick={() => setActiveTab('alerts')}
                    className={`pb-3 px-2 text-sm font-medium transition-colors ${activeTab === 'alerts' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400 hover:text-white'}`}
                >
                    Related Alerts
                </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'overview' && (
                        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Description</h3>
                            <p className="text-slate-300 whitespace-pre-wrap">{incident.description}</p>

                            <h3 className="text-lg font-bold text-white mt-6 mb-4">Playbook Logs</h3>
                            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 max-h-60 overflow-y-auto">
                                {incident.playbook_logs && incident.playbook_logs.length > 0 ? (
                                    incident.playbook_logs.map((log, i) => (
                                        <div key={i} className="mb-2 border-b border-slate-800 pb-2 last:border-0">
                                            <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> {JSON.stringify(log)}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-slate-600 italic">No automated playbook logs available.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'remediation' && (
                        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-white">Remediation History</h3>
                                <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm transition-colors">
                                    + Add Action
                                </button>
                            </div>
                            <div className="space-y-4">
                                {incident.actions && incident.actions.length > 0 ? (
                                    incident.actions.map(action => (
                                        <div key={action.id} className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-700">
                                            <div className="p-2 bg-slate-800 rounded-lg">
                                                <WrenchIcon className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <h4 className="font-semibold text-white">{action.action_taken}</h4>
                                                    <span className={`text-xs px-2 py-0.5 rounded capitalize ${action.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                        {action.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-400 mt-1">Performed by: {action.performed_by?.username || 'Automated System'}</p>
                                                <p className="text-xs text-slate-500 mt-2">{new Date(action.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
                                        No remediation actions taken yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'alerts' && (
                        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Correlated Alerts</h3>
                            <div className="space-y-3">
                                {incident.alerts && incident.alerts.length > 0 ? (
                                    incident.alerts.map(alert => (
                                        <div key={alert.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 cursor-pointer" onClick={() => navigate(`/admin/security/alerts/${alert.id}`)}>
                                            <div className="flex items-center gap-3">
                                                <ShieldCheckIcon className="w-5 h-5 text-slate-400" />
                                                <span className="text-slate-200">{alert.title}</span>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded uppercase ${alert.severity === 'critical' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-400'
                                                }`}>
                                                {alert.severity}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-slate-500">No alerts directly linked to this incident.</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Panel */}
                <div className="space-y-6">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium">
                                Analyze with AI
                            </button>
                            <button className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium">
                                Assign to Me
                            </button>
                            <button className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium">
                                Close Incident
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncidentDetails;
