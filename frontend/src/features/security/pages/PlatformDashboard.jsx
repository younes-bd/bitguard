import React, { useState, useEffect } from 'react';
import { platformService } from '../../../shared/core/services/platformService';
import {
    ServerStackIcon,
    SignalIcon,
    CpuChipIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';

const PlatformDashboard = () => {
    const [monitors, setMonitors] = useState([]);
    const [networkEvents, setNetworkEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [monitorsData, networkData] = await Promise.all([
                platformService.getSystemMonitors(),
                platformService.getNetworkEvents({ limit: 10 })
            ]);
            setMonitors(monitorsData.results || monitorsData);
            setNetworkEvents(networkData.results || networkData);
        } catch (error) {
            console.error("Failed to fetch platform status", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Platform Status</h1>
                    <p className="text-slate-400">Infrastructure monitoring and network activity.</p>
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-sm font-medium flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Systems Operational
                </div>
            </div>

            {/* System Monitors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {monitors.length === 0 ? (
                    <div className="col-span-full bg-slate-800 p-6 rounded-xl border border-slate-700 text-center text-slate-500">
                        No active system monitors.
                    </div>
                ) : (
                    monitors.map(monitor => (
                        <div key={monitor.id} className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-indigo-500/10 rounded text-indigo-400">
                                    <CpuChipIcon className="w-6 h-6" />
                                </div>
                                <span className={`text-xs font-bold uppercase ${monitor.status === 'ok' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {monitor.status}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-white">{monitor.system_name}</h3>
                                <div className="mt-2 w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${monitor.health_score > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                        style={{ width: `${monitor.health_score}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-slate-400">
                                    <span>Health</span>
                                    <span>{monitor.health_score}%</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Network Activity Log */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <GlobeAltIcon className="w-5 h-5 text-blue-500" />
                        Network Traffic
                    </h3>
                    <span className="text-xs text-slate-500">Live Feed</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900/50 text-slate-400">
                            <tr>
                                <th className="p-3 font-medium">Timestamp</th>
                                <th className="p-3 font-medium">Source</th>
                                <th className="p-3 font-medium">Destination</th>
                                <th className="p-3 font-medium">Protocol</th>
                                <th className="p-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700 text-slate-300">
                            {networkEvents.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-slate-500">No network events recorded.</td>
                                </tr>
                            ) : (
                                networkEvents.map(event => (
                                    <tr key={event.id} className="hover:bg-slate-700/30">
                                        <td className="p-3 font-mono text-slate-400">{new Date(event.timestamp).toLocaleTimeString()}</td>
                                        <td className="p-3 font-mono">{event.source_ip}</td>
                                        <td className="p-3 font-mono">{event.destination_ip}</td>
                                        <td className="p-3 uppercase text-xs font-bold text-slate-400">{event.protocol}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${event.action === 'Allowed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                {event.action}
                                            </span>
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

export default PlatformDashboard;
