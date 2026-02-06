import React, { useEffect, useState } from 'react';
import { crmService } from '../../../shared/core/services/crmService';
import {
    Users, Ticket, FileText, TrendingUp, AlertCircle, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CrmDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalClients: 0,
        activeTickets: 0,
        pendingContracts: 0
    });
    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Parallel fetch for dashboard data
                const [clients, tickets, contracts] = await Promise.all([
                    crmService.getClients(),
                    crmService.getTickets(),
                    crmService.getContracts()
                ]);

                const clientList = Array.isArray(clients) ? clients : clients.results || [];
                const ticketList = Array.isArray(tickets) ? tickets : tickets.results || [];
                const contractList = Array.isArray(contracts) ? contracts : contracts.results || [];

                setStats({
                    totalClients: clientList.length,
                    activeTickets: ticketList.filter(t => t.status !== 'resolved').length,
                    pendingContracts: contractList.filter(c => c.status === 'pending').length
                });

                setRecentTickets(ticketList.slice(0, 5));
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-2">CRM Overview</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-gradient-to-br from-blue-900/20 to-slate-900/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <TrendingUp size={12} /> +12%
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.totalClients}</div>
                    <div className="text-sm text-slate-400 font-medium uppercase">Total Clients</div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-gradient-to-br from-pink-900/20 to-slate-900/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-pink-500/20 rounded-lg text-pink-400">
                            <Ticket size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-500">Active</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.activeTickets}</div>
                    <div className="text-sm text-slate-400 font-medium uppercase">Open Tickets</div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-gradient-to-br from-indigo-900/20 to-slate-900/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
                            <FileText size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.pendingContracts}</div>
                    <div className="text-sm text-slate-400 font-medium uppercase">Pending Contracts</div>
                </div>
            </div>

            {/* Recent Activity / Tickets */}
            <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <AlertCircle className="text-pink-400" size={20} />
                        Recent Support Requests
                    </h2>
                    <button
                        onClick={() => navigate('/crm/tickets')}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        View All
                    </button>
                </div>

                <div className="space-y-4">
                    {recentTickets.map(ticket => (
                        <div
                            key={ticket.id}
                            onClick={() => navigate(`/crm/tickets/${ticket.id}`)}
                            className="flex items-center justify-between p-4 rounded-lg bg-slate-800/40 border border-slate-700/30 hover:border-pink-500/30 cursor-pointer transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-10 rounded-full ${ticket.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                <div>
                                    <h3 className="font-bold text-white">{ticket.subject}</h3>
                                    <div className="text-xs text-slate-500">{ticket.client_name || 'Unknown Client'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase bg-slate-700 text-slate-300`}>
                                    {ticket.status}
                                </span>
                                <div className="text-slate-500 text-xs flex items-center gap-1">
                                    <Clock size={12} />
                                    <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {recentTickets.length === 0 && (
                        <div className="text-center py-8 text-slate-500">No active tickets.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CrmDashboard;

