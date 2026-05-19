import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Loader2, Search, Filter, Calendar, Terminal, RefreshCw } from 'lucide-react';
import { iamService } from '../../../../core/api/iamService';
import { toast } from 'react-hot-toast';

const AuditLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await iamService.getAuditLogs();
                setLogs(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch audit logs", error);
                toast.error("Failed to load security registry");
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        const logDate = new Date(log.timestamp || log.created_at);
        const matchesSearch = (
            (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.ip_address || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesStart = !startDate || logDate >= new Date(startDate);
        const matchesEnd = !endDate || logDate <= new Date(endDate + 'T23:59:59');
        
        return matchesSearch && matchesStart && matchesEnd;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-slate-500 font-mono text-sm animate-pulse tracking-widest">DECRYPTING SECURITY VECTORS...</p>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 font-['Outfit']">
                        <Terminal className="text-emerald-500" size={32} />
                        Security Audit Trail
                    </h1>
                    <p className="text-slate-400 text-sm mt-1 max-w-xl">
                        Immutable record of all administrative actions, authentication attempts, and system modifications within the BitGuard ecosystem.
                    </p>
                </div>
                <button 
                    onClick={() => {
                        const csvContent = "data:text/csv;charset=utf-8," 
                            + "Timestamp,User,Action,IP Address\n"
                            + logs.map(l => `${new Date(l.timestamp || l.created_at).toISOString()},${l.user_email || 'SYSTEM'},${l.action || l.event_type},${l.ip_address || '127.0.0.1'}`).join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", "audit_logs_export.csv");
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                    }}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20"
                >
                    <Activity size={18} /> Export CSV
                </button>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-4 bg-slate-900/50 p-4 border border-slate-800 rounded-2xl backdrop-blur-md">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search logs by action, user, or network origin..."
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-sm font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1">
                        <Calendar size={14} className="text-slate-500" />
                        <input 
                            type="date" 
                            className="bg-transparent text-slate-300 text-xs outline-none py-2"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <span className="text-slate-600 text-xs uppercase font-black tracking-widest">To</span>
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1">
                        <Calendar size={14} className="text-slate-500" />
                        <input 
                            type="date" 
                            className="bg-transparent text-slate-300 text-xs outline-none py-2"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    {(startDate || endDate || searchTerm) && (
                        <button 
                            onClick={() => { setStartDate(''); setEndDate(''); setSearchTerm(''); }}
                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                            title="Reset Filters"
                        >
                            <RefreshCw size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-800 text-slate-500 bg-slate-900/80">
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Timestamp (UTC)</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Security Principal</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Event Vector</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-right">Network Origin</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-800/30 transition-all group">
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-white text-sm font-bold">{new Date(log.timestamp || log.created_at).toLocaleDateString()}</span>
                                        <span className="text-slate-500 text-[11px] font-mono">{new Date(log.timestamp || log.created_at).toLocaleTimeString()}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                                            {log.user_email?.[0].toUpperCase() || 'S'}
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold">{log.user_email || 'SYSTEM'}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${
                                        (log.action || '').includes('DELETE') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                        (log.action || '').includes('CREATE') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        'bg-slate-800 text-slate-400 border-slate-700'
                                    }`}>
                                        {log.action || log.event_type}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <span className="font-mono text-xs text-slate-500 group-hover:text-emerald-400 transition-colors">{log.ip_address || '127.0.0.1'}</span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="px-8 py-24 text-center">
                                    <Activity className="mx-auto text-slate-800 mb-6" size={64} />
                                    <h3 className="text-2xl font-bold text-slate-500 mb-2">No Records Found</h3>
                                    <p className="text-slate-600 max-w-sm mx-auto">The security archive contains no entries matching your current search parameters.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogPage;
