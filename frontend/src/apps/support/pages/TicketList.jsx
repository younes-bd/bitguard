import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import client from '../../../core/api/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

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
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        client.get('support/tickets/')
            .then(r => { setTickets(r.data?.results ?? r.data ?? []); setLoading(false); })
            .catch((err) => {
                toast.error('Failed to load tickets.');
                setLoading(false);
            });
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
                <button onClick={() => navigate('/admin/support/tickets/create')} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
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
                                <td className="px-5 py-4 text-white font-medium max-w-[240px] truncate">{t.subject || t.title}</td>
                                <td className="px-5 py-4 text-slate-400">{t.client?.name ?? t.client ?? '—'}</td>
                                <td className="px-5 py-4">{priorityBadge(t.priority)}</td>
                                <td className="px-5 py-4">{statusBadge(t.status)}</td>
                                <td className="px-5 py-4 text-slate-400">{t.created_at?.split('T')[0] ?? '—'}</td>
                                <td className="px-5 py-4 text-slate-400">{t.due_date ? t.due_date.split('T')[0] : 'None'}</td>
                                <td className="px-5 py-4">
                                    <button onClick={() => setSelectedTicket(t)} className="text-blue-400 hover:text-blue-300 transition-colors">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Ticket Detail Modal with KB Integration */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Ticket #{selectedTicket.id?.toString().slice(0, 8)}</h3>
                                <p className="text-slate-400 text-sm">{selectedTicket.subject || selectedTicket.title}</p>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-white transition-colors">
                                &times;
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 text-slate-300 text-sm space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-slate-500 uppercase text-xs font-bold mb-1">Status</p>
                                    <div>{statusBadge(selectedTicket.status)}</div>
                                </div>
                                <div>
                                    <p className="text-slate-500 uppercase text-xs font-bold mb-1">Due Date</p>
                                    <p className="font-mono text-white">{selectedTicket.due_date ? new Date(selectedTicket.due_date).toLocaleString() : 'No SLA Match'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-500 uppercase text-xs font-bold mb-1">Description</p>
                                <div className="bg-slate-800/50 p-4 rounded-lg">{selectedTicket.description || 'No description provided.'}</div>
                            </div>
                            
                            {/* KB Integration Section */}
                            <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-5">
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2"><CheckCircle size={16} className="text-blue-400"/> Knowledge Base Integration</h4>
                                {selectedTicket.is_converted_to_kb ? (
                                    <p className="text-emerald-400 text-sm flex items-center gap-2"><CheckCircle size={14}/> Successfully converted to KB Article.</p>
                                ) : (
                                    <div className="flex gap-3">
                                        {selectedTicket.status === 'resolved' && (
                                            <button 
                                                onClick={async () => {
                                                    try {
                                                        await client.post(`support/tickets/${selectedTicket.id}/create_kb_from_ticket/`);
                                                        toast.success('Converted to KB successfully');
                                                        setSelectedTicket({...selectedTicket, is_converted_to_kb: true});
                                                    } catch (e) {
                                                        toast.error('Error converting to KB article');
                                                    }
                                                }}
                                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                            >
                                                Convert to KB Article
                                            </button>
                                        )}
                                        <button onClick={() => {
                                            const id = prompt('Enter KB Article ID to link:');
                                            if (id) {
                                                client.post(`support/tickets/${selectedTicket.id}/link_article/`, { article_id: id })
                                                    .then(() => toast.success('KB Article linked!'))
                                                    .catch(() => toast.error('Failed to link article.'));
                                            }
                                        }} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold border border-slate-700 transition-colors">
                                            Link Existing KB Article
                                        </button>
                                    </div>
                                )}
                                {selectedTicket.related_articles?.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-slate-400 text-xs uppercase font-bold mb-2">Linked Articles</p>
                                        <ul className="space-y-1">
                                            {selectedTicket.related_articles.map(id => (
                                                <li key={id} className="text-blue-400 text-sm cursor-pointer hover:underline">Article ID: {id}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketList;

