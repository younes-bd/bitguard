import React, { useState, useEffect } from 'react';
import securityService from '../../../shared/core/services/securityService';
import { EnvelopeIcon, ExclamationTriangleIcon, ShieldCheckIcon, FunnelIcon } from '@heroicons/react/24/outline';

const EmailSecurity = () => {
    const [threats, setThreats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchThreats();
    }, []);

    const fetchThreats = async () => {
        try {
            const response = await securityService.getEmailThreats();
            setThreats(response.data.results || response.data);
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
                    <h1 className="text-2xl font-bold text-white">Email Security</h1>
                    <p className="text-slate-400">Monitor phishing and malware threats.</p>
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase p-4">
                            <th className="p-4">Threat Type</th>
                            <th className="p-4">Sender / Subject</th>
                            <th className="p-4">Recipient</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Detected</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {threats.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-slate-500">No email threats found.</td></tr>
                        ) : (
                            threats.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-700/30">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <ExclamationTriangleIcon className="w-5 h-5 text-rose-500" />
                                            <span className="text-white font-medium">{t.threat_type}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-white">{t.subject}</div>
                                        <div className="text-xs text-slate-500">{t.sender}</div>
                                    </td>
                                    <td className="p-4 text-slate-300">{t.recipient}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${t.status === 'blocked' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-400'}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400 text-sm">
                                        {new Date(t.detected_at).toLocaleString()}
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

export default EmailSecurity;
