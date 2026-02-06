import React, { useState, useEffect } from 'react';
import securityService from '../../../shared/core/services/securityService';
import { GlobeAltIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const NetworkSecurity = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await securityService.getNetworkEvents();
            setEvents(response.data.results || response.data);
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
                    <h1 className="text-2xl font-bold text-white">Network Security</h1>
                    <p className="text-slate-400">Monitor traffic and firewall events.</p>
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase p-4">
                            <th className="p-4">Action</th>
                            <th className="p-4">Protocol</th>
                            <th className="p-4">Source</th>
                            <th className="p-4">Destination</th>
                            <th className="p-4">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {events.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-slate-500">No network events found.</td></tr>
                        ) : (
                            events.map((e) => (
                                <tr key={e.id} className="hover:bg-slate-700/30">
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${e.action === 'blocked' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                            {e.action}
                                        </span>
                                    </td>
                                    <td className="p-4 text-white font-mono">{e.protocol}</td>
                                    <td className="p-4 text-slate-300 font-mono">{e.source_ip}</td>
                                    <td className="p-4 font-mono">
                                        <span className="flex items-center gap-2 text-slate-300">
                                            <ArrowRightIcon className="w-3 h-3 text-slate-500" />
                                            {e.destination_ip}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400 text-sm">
                                        {new Date(e.timestamp).toLocaleString()}
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

export default NetworkSecurity;
