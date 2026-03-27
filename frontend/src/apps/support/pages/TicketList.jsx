import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import client from '../../../core/api/client';

const statusBadge = (status) => {
    const map = {
        open: 'bg-blue-500/10 text-blue-400',
        in_progress: 'bg-amber-500/10 text-amber-400',
        resolved: 'bg-emerald-500/10 text-emerald-400',
        closed: 'bg-slate-700 text-slate-400',
        escalated: 'bg-red-500/10 text-red-400',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>
            {status?.replace('_', ' ')}
        </span>
    );
};

const priorityBadge = (priority) => {
    const map = { critical: 'text-red-400', high: 'text-orange-400', medium: 'text-amber-400', low: 'text-slate-400' };
    return <span className={`text-xs font-bold capitalize ${map[priority] ?? 'text-slate-400'}`}>{priority}</span>;
};

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        client.get('support/tickets/')
            .then(r => { setTickets(r.data?.results ?? r.data ?? []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const filtered = tickets.filter(t =>
        t.subject?.toLowerCase().includes(search.toLowerCase()) ||
        t.status?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Support Tickets</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{tickets.length} total tickets</p>
                </div>
                <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={16} /> New Ticket
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40" />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Ticket', 'Subject', 'Client', 'Priority', 'Status', 'Created', ''].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="py-16 text-center text-slate-500">Loading tickets...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={7} className="py-16 text-center text-slate-500">
                                <CheckCircle size={36} className="mx-auto mb-2 text-emerald-500/30" />
                                No tickets found
                            </td></tr>
                        ) : filtered.map(t => (
                            <tr key={t.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                                <td className="px-5 py-4 text-slate-400 font-mono text-xs">#{t.id?.toString().slice(0, 8)}</td>
                                <td className="px-5 py-4 text-white font-medium max-w-[240px] truncate">{t.subject}</td>
                                <td className="px-5 py-4 text-slate-400">{t.client?.name ?? t.client ?? '—'}</td>
                                <td className="px-5 py-4">{priorityBadge(t.priority)}</td>
                                <td className="px-5 py-4">{statusBadge(t.status)}</td>
                                <td className="px-5 py-4 text-slate-400">{t.created_at?.split('T')[0] ?? '—'}</td>
                                <td className="px-5 py-4">
                                    <ChevronRight size={16} className="text-slate-600 hover:text-blue-400 cursor-pointer transition-colors" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TicketList;
