import React, { useState, useEffect } from 'react';
import { Database, Search, Filter, Download, RefreshCw, AlertTriangle, Info, AlertCircle, Loader2 } from 'lucide-react';
import client from '../../../core/api/client';

const SEVERITY_MAP = {
    critical: { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: AlertCircle },
    warning: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: AlertTriangle },
    info: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Info },
    debug: { color: 'bg-slate-700 text-slate-400 border-slate-600', icon: Database },
};

const LogAnalysisPage = () => {
    const [search, setSearch] = useState('');
    const [severityFilter, setSeverityFilter] = useState('all');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await client.get('soc/logs/');
            const data = res.data.results ? res.data.results : (Array.isArray(res.data) ? res.data : []);
            setLogs(data);
        } catch (err) {
            console.error("Failed to fetch logs", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filtered = logs
        .filter(l => severityFilter === 'all' || l.severity === severityFilter)
        .filter(l => (l.message || '').toLowerCase().includes(search.toLowerCase()) || (l.source || '').toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Database className="text-red-400" size={28} />
                        Log Analysis
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Centralized log aggregation and security event analysis</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors flex items-center gap-2">
                        <Download size={14} /> Export
                    </button>
                    <button onClick={fetchLogs} className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm transition-colors flex items-center gap-2">
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>
            </div>

            {/* KPI Tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Events', value: loading ? '...' : logs.length.toLocaleString(), color: 'text-white' },
                    { label: 'Critical', value: loading ? '...' : logs.filter(l => l.severity === 'critical').length, color: 'text-red-400' },
                    { label: 'Warnings', value: loading ? '...' : logs.filter(l => l.severity === 'warning').length, color: 'text-amber-400' },
                    { label: 'Sources', value: loading ? '...' : new Set(logs.map(l => l.source)).size, color: 'text-blue-400' },
                ].map(kpi => (
                    <div key={kpi.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                        <div className="text-slate-400 text-xs uppercase font-bold mb-1">{kpi.label}</div>
                        <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    />
                </div>
                <div className="flex items-center gap-1">
                    <Filter size={14} className="text-slate-500" />
                    {['all', 'critical', 'warning', 'info', 'debug'].map(sev => (
                        <button
                            key={sev}
                            onClick={() => setSeverityFilter(sev)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors ${
                                severityFilter === sev
                                    ? 'bg-red-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                        >
                            {sev}
                        </button>
                    ))}
                </div>
            </div>

            {/* Log Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Timestamp', 'Source', 'Severity', 'Message', 'Count'].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-slate-500">
                                    <Loader2 size={32} className="mx-auto mb-2 animate-spin text-red-500" />
                                    Querying SIEM database...
                                </td>
                            </tr>
                        )}
                        {!loading && filtered.length === 0 ? (
                            <tr><td colSpan={5} className="py-12 text-center text-slate-500">
                                <Database size={32} className="mx-auto mb-2 opacity-20" />
                                No log entries match your filters
                            </td></tr>
                        ) : filtered.map(log => {
                            const sev = SEVERITY_MAP[log.severity] || SEVERITY_MAP.info;
                            const SevIcon = sev.icon;
                            return (
                                <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                    <td className="px-5 py-4 text-slate-400 text-xs font-mono whitespace-nowrap">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono uppercase">{log.source || 'SYSLOG'}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border w-fit ${sev.color}`}>
                                            <SevIcon size={11} /> {log.severity || 'info'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-300 max-w-md truncate">{log.message || log.event_data || 'Unknown event'}</td>
                                    <td className="px-5 py-4 text-slate-500 font-mono">{log.count || 1}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LogAnalysisPage;
