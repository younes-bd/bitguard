import React, { useState, useEffect } from 'react';
import { Search, Filter, Shield, User, Clock } from 'lucide-react';
import client from '../../../../core/api/client';

const AuditLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('audit/logs/', { params: { search, limit: 100 } })
            .then(r => { setLogs(r.data?.results ?? r.data ?? []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [search]);

    const actionColor = (action) => {
        if (!action) return 'text-slate-400';
        if (action.includes('delete') || action.includes('remove')) return 'text-red-400';
        if (action.includes('create') || action.includes('add')) return 'text-emerald-400';
        if (action.includes('update') || action.includes('edit')) return 'text-blue-400';
        if (action.includes('login') || action.includes('auth')) return 'text-violet-400';
        return 'text-slate-300';
    };

    const timeAgo = (dateStr) => {
        if (!dateStr) return '—';
        const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Shield size={22} className="text-violet-400" />
                        Audit Log
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Immutable record of all system actions</p>
                </div>
            </div>
            <div className="relative max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by action, user, or resource..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Timestamp', 'User', 'Action', 'Resource', 'IP Address'].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="font-mono">
                        {loading ? (
                            <tr><td colSpan={5} className="py-16 text-center text-slate-500 font-sans">Loading audit logs...</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan={5} className="py-16 text-center text-slate-500 font-sans">No audit log entries found</td></tr>
                        ) : logs.map((log, i) => (
                            <tr key={log.id ?? i} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                                <td className="px-5 py-3 text-slate-500 text-xs whitespace-nowrap">
                                    <Clock size={11} className="inline mr-1.5 text-slate-600" />
                                    {timeAgo(log.timestamp ?? log.created_at)}
                                </td>
                                <td className="px-5 py-3 text-slate-300 text-xs">
                                    <User size={11} className="inline mr-1.5 text-slate-600" />
                                    {log.user?.email ?? log.user ?? log.performed_by ?? 'System'}
                                </td>
                                <td className={`px-5 py-3 text-xs font-semibold ${actionColor(log.action)}`}>
                                    {log.action ?? '—'}
                                </td>
                                <td className="px-5 py-3 text-slate-400 text-xs">{log.resource ?? log.model ?? '—'}</td>
                                <td className="px-5 py-3 text-slate-600 text-xs">{log.ip_address ?? '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogPage;
