import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import securityService from '../../../shared/core/services/securityService';
import {
    ArrowLeftIcon,
    ShieldExclamationIcon,
    ClockIcon,
    UserIcon,
    ClipboardDocumentCheckIcon,
    MapIcon
} from '@heroicons/react/24/outline';

const AlertDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [alertData, setAlertData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlert();
    }, [id]);

    const fetchAlert = async () => {
        setLoading(true);
        try {
            // Try to fetch individual alert
            const response = await securityService.getAlert(id);
            setAlertData(response.data);
        } catch (error) {
            console.error("Failed to fetch alert details", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
    if (!alertData) return <div className="p-8 text-center text-slate-500">Alert not found.</div>;

    return (
        <div className="space-y-6 p-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeftIcon className="w-4 h-4" /> Back to Alerts
            </button>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-white">{alertData.title}</h1>
                            <span className={`px-3 py-1 rounded border text-xs font-bold uppercase ${alertData.severity === 'critical' ? 'text-rose-500 border-rose-500/20 bg-rose-500/10' :
                                alertData.severity === 'high' ? 'text-orange-500 border-orange-500/20 bg-orange-500/10' :
                                    'text-blue-500 border-blue-500/20 bg-blue-500/10'
                                }`}>
                                {alertData.severity}
                            </span>
                            {alertData.score !== undefined && (
                                <span className={`px-3 py-1 rounded border text-xs font-bold uppercase ${alertData.score >= 75 ? 'text-rose-500 border-rose-500/20 bg-rose-500/10' :
                                        alertData.score >= 40 ? 'text-orange-500 border-orange-500/20 bg-orange-500/10' :
                                            'text-blue-500 border-blue-500/20 bg-blue-500/10'
                                    }`}>
                                    Risk Score: {alertData.score}
                                </span>
                            )}
                        </div>
                        <p className="text-slate-400 max-w-3xl">{alertData.description}</p>
                    </div>
                    <div className="text-right text-slate-500 text-sm">
                        <div>ID: {alertData.id}</div>
                        <div>{new Date(alertData.timestamp).toLocaleString()}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <ShieldExclamationIcon className="w-4 h-4" /> Source
                        </div>
                        <div className="text-white font-medium capitalize">{alertData.source?.replace('_', ' ')}</div>
                    </div>
                    <div className="p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <ClockIcon className="w-4 h-4" /> Status
                        </div>
                        <div className="text-white font-medium capitalize">{alertData.status?.replace('_', ' ')}</div>
                    </div>
                    <div className="p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <MapIcon className="w-4 h-4" /> MITRE
                        </div>
                        <div className="text-white font-medium">
                            {alertData.mitre_tactic} {alertData.mitre_technique ? `(${alertData.mitre_technique})` : ''}
                        </div>
                    </div>
                </div>

                {/* Technical Context */}
                <div className="border-t border-slate-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Technical Data</h3>
                    <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                        <pre>{JSON.stringify(alertData.raw_data || {}, null, 2)}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertDetails;
