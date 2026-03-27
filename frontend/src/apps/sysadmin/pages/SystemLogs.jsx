import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, Server, Search, Filter } from 'lucide-react';
import { sysadminService } from '../api/sysadminService';

const SystemLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        sysadminService.getAuditLogs()
            .then(res => setLogs(res.data?.results || res.data || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleExport = async () => {
        try {
            const response = await sysadminService.exportAuditLogs();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'audit_logs.csv');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Failed to export CSV', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">System Logs</h1>
                    <p className="text-slate-400">Real-time monitoring and event history.</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-600 transition-colors bg-transparent">
                        <Filter size={18} />
                    </button>
                    <button onClick={handleExport} className="bg-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors border-none cursor-pointer">Export CSV</button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center gap-2">
                <Search size={16} className="text-slate-500 ml-2" />
                <input
                    type="text"
                    placeholder="Search logs by action or resource..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent border-none text-slate-300 focus:ring-0 text-sm h-8 outline-none"
                />
            </div>

            {/* Logs List */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-300">Recent Events</h3>
                    <span className="text-xs text-slate-500">Live Updating...</span>
                </div>
                <div className="divide-y divide-slate-800/50">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500 text-sm">Loading audit logs...</div>
                    ) : logs.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">No activity recorded.</div>
                    ) : logs.filter(l => l.action?.toLowerCase().includes(search.toLowerCase()) || l.resource_type?.toLowerCase().includes(search.toLowerCase())).map(log => (
                        <div key={log.id} className="p-4 hover:bg-slate-800/30 transition-colors flex items-start gap-4">
                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0
                                ${log.action === 'delete' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' :
                                    log.action === 'settings_change' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' :
                                        'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`}
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <span className={`text-sm font-mono font-medium uppercase
                                        ${log.action === 'delete' ? 'text-red-400' :
                                            log.action === 'settings_change' ? 'text-amber-400' : 'text-emerald-400'}`}>
                                        [{log.action}]
                                    </span>
                                    <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0 ml-4">
                                        <Clock size={12} /> {log.created_at ? new Date(log.created_at).toLocaleString() : 'Just now'}
                                    </span>
                                </div>
                                <p className="text-slate-300 text-sm mt-0.5">{log.user_email || log.user_name || 'System'} modified {log.resource_type}. {log.details?.message}</p>
                                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                    <Server size={12} />
                                    <span>{log.ip_address || 'Internal Server'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SystemLogs;
