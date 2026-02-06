import React, { useEffect, useState } from 'react';
import { crmService } from '../../../shared/core/services/crmService';
import {
    Ticket, Search, Filter, AlertCircle, CheckCircle, Clock, MoreHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TicketList = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const data = await crmService.getTickets();
            setTickets(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to load tickets", error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'medium': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return <AlertCircle size={16} className="text-blue-400" />;
            case 'resolved': return <CheckCircle size={16} className="text-emerald-400" />;
            case 'pending': return <Clock size={16} className="text-yellow-400" />;
            default: return <Clock size={16} className="text-slate-400" />;
        }
    };

    const filteredTickets = filterStatus === 'all'
        ? tickets
        : tickets.filter(t => t.status?.toLowerCase() === filterStatus);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Ticket className="text-pink-500" size={32} />
                        Support Tickets
                    </h1>
                    <p className="text-slate-400">Track and resolve customer issues.</p>
                </div>
                <button
                    onClick={() => navigate('/crm/tickets/create')}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg shadow-lg shadow-pink-500/20 transition-all"
                >
                    New Ticket
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 pb-2 overflow-x-auto">
                {['all', 'open', 'pending', 'resolved'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${filterStatus === status
                            ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Ticket List */}
            <div className="space-y-4">
                {filteredTickets.map(ticket => (
                    <div
                        key={ticket.id}
                        className="glass-panel p-4 rounded-xl border border-slate-700/50 hover:border-pink-500/30 hover:bg-slate-800/80 transition-all cursor-pointer flex flex-col md:flex-row gap-4 items-center"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-slate-500 font-mono text-sm">#{ticket.id.toString().padStart(4, '0')}</span>
                                <h3 className="text-lg font-bold text-white truncate">{ticket.subject}</h3>
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1.5">
                                    {getStatusIcon(ticket.status)}
                                    <span className="capitalize">{ticket.status}</span>
                                </span>
                                <span>•</span>
                                <span>{ticket.client_name || 'Unknown Client'}</span>
                                <span>•</span>
                                <span>Updated {new Date(ticket.updated_at || Date.now()).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-700/50 pt-4 md:pt-0">
                            <div className="flex -space-x-2">
                                {/* Mock Assignees */}
                                <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-xs">AB</div>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>
                ))}

                {filteredTickets.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                            <Ticket size={32} />
                        </div>
                        <p className="text-slate-400">No tickets found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketList;


