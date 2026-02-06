import React, { useState, useEffect } from 'react';
import securityService from '../../../shared/core/services/securityService';
import { QueueListIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const SecurityGapsPage = () => {
    const [gaps, setGaps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGaps();
    }, []);

    const fetchGaps = async () => {
        try {
            const response = await securityService.getSecurityGaps();
            setGaps(response.data.results || response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Security Gaps</h1>
                    <p className="text-slate-400">Identify and remediate compliance and security gaps.</p>
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase p-4">
                            <th className="p-4">Title</th>
                            <th className="p-4">Severity</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {gaps.length === 0 ? (
                            <tr><td colSpan="4" className="p-8 text-center text-slate-500">No security gaps found.</td></tr>
                        ) : (
                            gaps.map((gap) => (
                                <tr key={gap.id} className="hover:bg-slate-700/30">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{gap.title}</div>
                                        <div className="text-sm text-slate-500">{gap.description}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${gap.severity === 'high' ? 'bg-rose-500/10 text-rose-500' :
                                                gap.severity === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            {gap.severity}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {gap.status === 'resolved' ? (
                                                <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                                            ) : (
                                                <XCircleIcon className="w-5 h-5 text-amber-500" />
                                            )}
                                            <span className="text-slate-300 capitalize">{gap.status}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-400 text-sm">
                                        {new Date(gap.created_at).toLocaleDateString()}
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

export default SecurityGapsPage;
