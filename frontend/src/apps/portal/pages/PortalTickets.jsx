import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import client from '../../../core/api/client';

const statusBadge = (status) => {
    const map = { open: 'bg-amber-500/10 text-amber-400', in_progress: 'bg-blue-500/10 text-blue-400', resolved: 'bg-emerald-500/10 text-emerald-400' };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>{status?.replace('_', ' ')}</span>;
};

const PortalTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('/support/tickets/')
            .then(r => { setTickets(r.data?.results ?? r.data ?? []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">My Support Tickets</h1>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={15} /> New Ticket
                </button>
            </div>
            <div className="space-y-3">
                {loading ? <div className="text-center py-16 text-slate-500">Loading tickets...</div>
                    : tickets.length === 0 ? <div className="text-center py-16 text-slate-500">No tickets yet</div>
                        : tickets.map(t => (
                            <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex justify-between items-center hover:border-slate-700 transition-colors">
                                <div>
                                    <p className="text-white font-medium">{t.title ?? t.subject}</p>
                                    <p className="text-slate-500 text-xs mt-1">{t.created_at?.split('T')[0]} · {t.priority ?? 'normal'} priority</p>
                                </div>
                                {statusBadge(t.status)}
                            </div>
                        ))}
            </div>
        </div>
    );
};

export default PortalTickets;
