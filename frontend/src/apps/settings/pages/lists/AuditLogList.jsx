import React, { useState, useEffect } from 'react';
import { 
    History, Search, Filter, Download, User, 
    Activity, Clock, Globe, Database, Loader2 
} from 'lucide-react';
import { settingsService } from '../../api/settingsService';

const ACTION_COLORS = {
    'create': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'update': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'delete': 'text-red-400 bg-red-500/10 border-red-500/20',
    'login': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    'logout': 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    'default': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
};

const AuditLogList = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await settingsService.getAuditLogs();
            const data = res.data?.data || res.data?.results || res.data || [];
            setLogs(data);
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await settingsService.exportAuditLogs();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'audit_logs_export.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Export failed", error);
        }
    };

    const filteredLogs = logs.filter(log => 
        log.resource_type?.toLowerCase().includes(search.toLowerCase()) ||
        log.action?.toLowerCase().includes(search.toLowerCase()) ||
        log.user_email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <History className="text-purple-500" size={28} />
                        Security Audit Archive
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Immutable record of system-wide administrative operations</p>
                </div>
                <button 
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700"
                >
                    <Download size={14} /> Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                        type="text" 
                        placeholder="Filter by resource, action, or user..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-purple-500/50 outline-none transition-all"
                    />
                </div>
                <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
                    <Filter size={18} />
                </button>
            </div>

            {/* Logs Table */}
            <div className="glass-panel border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-700/50">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Event Time</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Identity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Action</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resource</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Origin</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        <Loader2 className="animate-spin mx-auto text-purple-500 mb-2" />
                                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Analyzing security logs...</span>
                                    </td>
                                </tr>
                            ) : filteredLogs.length > 0 ? filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium">{new Date(log.created_at).toLocaleDateString()}</span>
                                            <span className="text-[10px] text-slate-500 font-mono">{new Date(log.created_at).toLocaleTimeString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                                                <User size={12} />
                                            </div>
                                            <span className="text-slate-300 font-medium">{log.user_email || 'System'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${ACTION_COLORS[log.action] || ACTION_COLORS.default}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold tracking-tight">{log.resource_type}</span>
                                            <span className="text-[10px] text-slate-500 font-mono">ID: {log.resource_id?.split('-')[0] || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Globe size={12} />
                                            <span className="text-xs">{log.ip_address || 'Internal'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-[200px] truncate text-xs text-slate-500 italic">
                                            {JSON.stringify(log.details)}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 italic">
                                        No security events found matching current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLogList;
