import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import securityService from '../../../shared/core/services/securityService';
import { Flame, User } from 'lucide-react';

const IncidentsPage = () => {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchIncidents = async () => {
        setLoading(true);
        try {
            const response = await securityService.getIncidents();
            const data = response.data.results || response.data;
            setIncidents(data);
        } catch (error) {
            console.error("Failed to fetch incidents", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents();
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Incidents Response</h1>
                    <p className="text-slate-400">Manage and respond to security incidents.</p>
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase p-4">
                            <th className="p-4">Incident</th>
                            <th className="p-4">Severity</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Assignee</th>
                            <th className="p-4">Created</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {incidents.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-500">No incidents found.</td></tr>
                        ) : (
                            incidents.map((incident) => (
                                <tr key={incident.id} className="hover:bg-slate-700/30">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{incident.title}</div>
                                        <div className="text-xs text-slate-500">ID: {incident.id}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getSeverityColor(incident.severity)}`}>
                                            {incident.severity}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-300 capitalize">{incident.status}</td>
                                    <td className="p-4 text-slate-400 flex items-center gap-2">
                                        <User size={14} />
                                        {incident.assignee ? incident.assignee.username : 'Unassigned'}
                                    </td>
                                    <td className="p-4 text-slate-400 text-sm">
                                        {new Date(incident.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => navigate(`/admin/security/incidents/${incident.id}`)}
                                            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IncidentsPage;
