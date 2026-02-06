import React, { useState, useEffect } from 'react';
import securityService from '../../../shared/core/services/securityService';
import { CloudIcon, LockClosedIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

const CloudSecurity = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApps();
    }, []);

    const fetchApps = async () => {
        try {
            const response = await securityService.getCloudApps();
            setApps(response.data.results || response.data);
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
                    <h1 className="text-2xl font-bold text-white">Cloud App Security</h1>
                    <p className="text-slate-400">Monitor shadows IT and sanctioned apps.</p>
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase p-4">
                            <th className="p-4">App Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Risk Level</th>
                            <th className="p-4">Users</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {apps.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-slate-500">No cloud apps found.</td></tr>
                        ) : (
                            apps.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-700/30">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{app.name}</div>
                                    </td>
                                    <td className="p-4 text-slate-300">{app.category}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${app.risk_level === 'high' ? 'bg-rose-500/10 text-rose-500' :
                                                app.risk_level === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-emerald-500/10 text-emerald-500'
                                            }`}>
                                            {app.risk_level}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-300">{app.connected_users}</td>
                                    <td className="p-4">
                                        {app.sanctioned ? (
                                            <span className="flex items-center gap-1 text-emerald-400 text-sm"><LockClosedIcon className="w-4 h-4" /> Sanctioned</span>
                                        ) : (
                                            <span className="text-slate-500 text-sm">Unsanctioned</span>
                                        )}
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

export default CloudSecurity;
