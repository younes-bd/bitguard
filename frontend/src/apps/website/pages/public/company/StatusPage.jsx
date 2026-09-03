import React, { useState, useEffect } from 'react';
import PageMeta from '@/core/components/shared/PageMeta';
import { settingsService } from '../../../../system/api/settingsService';
import { Loader2 } from 'lucide-react';

const StatusPage = () => {
    const [systems, setSystems] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [overallStatus, setOverallStatus] = useState('Operational');

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await settingsService.getSystemStatus();
                setSystems(data.systems.map(s => ({
                    ...s,
                    status: s.status.toLowerCase()
                })));
                setIncidents(data.incidents.map(i => ({
                    ...i,
                    status: i.status.toLowerCase(),
                    updates: [{ time: '10:00 AM UTC', text: i.description }]
                })));
                setOverallStatus(data.overallStatus);
            } catch (error) {
                console.error("Failed to load status:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);

    const getStatusColor = (status) => {
        switch(status) {
            case 'operational': return 'bg-emerald-500';
            case 'degraded': return 'bg-amber-500';
            case 'outage': return 'bg-red-500';
            case 'maintenance': return 'bg-blue-500';
            default: return 'bg-slate-500';
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'operational': return 'Operational';
            case 'degraded': return 'Degraded Performance';
            case 'outage': return 'Major Outage';
            case 'maintenance': return 'Under Maintenance';
            default: return 'Unknown';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center dark:bg-slate-900 bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="dark:bg-slate-900 bg-slate-50 min-h-screen pt-32 pb-20 transition-colors duration-300">
            <PageMeta 
                title="System Status | BitGuard" 
                description="Check the real-time status of BitGuard systems and services."
            />
            
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-slate-900 tracking-tight mb-4">
                            System Status
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            Current status of BitGuard services and infrastructure.
                        </p>
                    </div>
                    
                    {/* Subscribe Button */}
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 w-fit">
                        <i className="bi bi-bell-fill"></i> Subscribe to Updates
                    </button>
                </div>

                {/* Overall Status Banner */}
                <div className={`p-6 rounded-2xl mb-12 flex items-center gap-4 ${
                    overallStatus.toLowerCase() === 'operational' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                    overallStatus.toLowerCase() === 'degraded' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400' :
                    'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'
                }`}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                        {overallStatus.toLowerCase() === 'operational' ? <i className="bi bi-check-circle-fill text-3xl"></i> :
                         overallStatus.toLowerCase() === 'degraded' ? <i className="bi bi-exclamation-triangle-fill text-3xl"></i> :
                         <i className="bi bi-x-octagon-fill text-3xl"></i>}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">
                            {overallStatus.toLowerCase() === 'operational' ? 'All Systems Operational' :
                             overallStatus.toLowerCase() === 'degraded' ? 'Partial System Outage / Degraded Performance' :
                             'Major System Outage'}
                        </h2>
                        <p className="opacity-80 text-sm mt-1">Refreshed automatically. Last checked just now.</p>
                    </div>
                </div>

                {/* System List */}
                <div className="dark:bg-slate-900 bg-white rounded-2xl border dark:border-slate-800 border-slate-200 overflow-hidden shadow-sm mb-16 transition-colors duration-300">
                    {systems.map((sys, idx) => (
                        <div key={sys.id} className={`p-6 flex flex-col gap-4 ${idx !== systems.length - 1 ? 'border-b dark:border-slate-800 border-slate-100' : ''} transition-colors duration-300`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <span className="font-bold dark:text-white text-slate-900">{sys.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold dark:text-slate-400 text-slate-500">{getStatusText(sys.status)}</span>
                                    <div className={`w-3 h-3 rounded-full ${getStatusColor(sys.status)} ${sys.status === 'operational' ? 'shadow-[0_0_10px_rgba(16,185,129,0.5)]' : ''}`}></div>
                                </div>
                            </div>
                            
                            {/* 90 Days Uptime Bar */}
                            <div className="mt-2 group/uptime">
                                <div className="flex items-center gap-[2px] h-8 w-full">
                                    {Array.from({ length: 90 }).map((_, i) => {
                                        // Randomly simulate occasional degraded/outage for demo
                                        const rand = Math.random();
                                        const isOutage = rand > 0.99;
                                        const isDegraded = !isOutage && rand > 0.97;
                                        let bg = 'bg-emerald-500/80 hover:bg-emerald-400';
                                        if (isOutage) bg = 'bg-red-500/80 hover:bg-red-400';
                                        else if (isDegraded) bg = 'bg-amber-500/80 hover:bg-amber-400';
                                        
                                        return (
                                            <div 
                                                key={i} 
                                                className={`flex-1 h-full rounded-[1px] cursor-pointer transition-colors ${bg}`}
                                                title={`${90 - i} days ago: ${isOutage ? 'Major Outage' : isDegraded ? 'Degraded Performance' : 'No downtime recorded'}`}
                                            ></div>
                                        )
                                    })}
                                </div>
                                <div className="flex justify-between items-center mt-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                                    <span>90 days ago</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 px-2 py-0.5 rounded-md">{sys.uptime} uptime</span>
                                    <span>Today</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Past Incidents */}
                <div>
                    <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-8 transition-colors duration-300">Past Incidents</h3>
                    {incidents.length > 0 ? (
                        <div className="space-y-8">
                            {incidents.map(inc => (
                                <div key={inc.id} className="relative pl-8 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 last:before:hidden">
                                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-slate-50 dark:border-slate-950">
                                        <div className={`w-2 h-2 rounded-full ${
                                            inc.status === 'resolved' ? 'bg-emerald-500' :
                                            inc.status === 'investigating' ? 'bg-amber-500' : 'bg-blue-500'
                                        }`}></div>
                                    </div>
                                    <h4 className="text-lg font-bold dark:text-white text-slate-900 mb-1">{inc.title}</h4>
                                    <p className="text-sm dark:text-slate-500 text-slate-400 mb-4 font-semibold uppercase tracking-wider">{inc.date}</p>
                                    
                                    <div className="space-y-4">
                                        {inc.updates.map((upd, i) => (
                                            <div key={i} className="dark:bg-slate-900/50 bg-slate-50 p-4 rounded-xl border dark:border-slate-800 border-slate-100">
                                                <span className="text-xs font-bold dark:text-slate-500 text-slate-400 mb-2 block">{upd.time}</span>
                                                <p className="dark:text-slate-300 text-slate-700 text-sm leading-relaxed">{upd.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-10 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <i className="bi bi-shield-check text-4xl text-emerald-500 mb-4 block"></i>
                            <h4 className="text-lg font-bold dark:text-white text-slate-900 mb-2">No incidents reported</h4>
                            <p className="text-slate-500 dark:text-slate-400">All systems have been fully operational for the past 30 days.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
