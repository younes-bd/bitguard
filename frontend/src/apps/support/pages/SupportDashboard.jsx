import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Ticket, Clock, AlertCircle } from 'lucide-react';
import supportService from '../../../core/api/supportService';

const SupportDashboard = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await supportService.getTickets();
            // supportService unwraps data via response.data.data
            setTickets(Array.isArray(res) ? res : res?.results || []);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-slate-300">Loading Support...</div>;
    }

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Support & Help Desk</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage technical issues and service requests</p>
                </div>
                <button
                    onClick={() => navigate('/admin/support/new')}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold shadow-lg shadow-teal-500/20 transition-all"
                >
                    <Plus size={18} />
                    <span>Open New Ticket</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Total Issues</p>
                    <p className="text-3xl font-bold text-white">{tickets.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Open Tickets</p>
                    <p className="text-3xl font-bold text-teal-400">{tickets.filter(t => t.status !== 'closed').length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">High Priority</p>
                    <p className="text-3xl font-bold text-rose-500">{tickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length}</p>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800 bg-slate-950/50">
                    <h3 className="text-lg font-bold text-white">Active Tickets</h3>
                </div>
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800 text-slate-400">
                        <tr>
                            <th className="px-4 py-3 font-medium">Ticket ID</th>
                            <th className="px-4 py-3 font-medium">Title</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Priority</th>
                            <th className="px-4 py-3 font-medium">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {tickets.length > 0 ? (
                            tickets.map(ticket => (
                                <tr key={ticket.id} className="hover:bg-slate-800/50 transition-colors border-b border-slate-800 last:border-0">
                                    <td className="px-4 py-4 font-mono text-xs text-teal-500">#{ticket.id.split('-')[0]}</td>
                                    <td className="px-4 py-4">
                                        <div className="font-semibold text-white">{ticket.title}</div>
                                        <div className="text-[10px] text-slate-500">{ticket.description?.substring(0, 40)}...</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                            ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                            ticket.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                            'bg-slate-800 text-slate-400 border-slate-700'
                                        }`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`flex items-center gap-1 text-[10px] font-bold uppercase ${
                                            ticket.priority === 'urgent' ? 'text-rose-500' : 
                                            ticket.priority === 'high' ? 'text-orange-400' : 
                                            'text-slate-400'
                                        }`}>
                                            <AlertCircle size={10} />
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-slate-500 text-xs">{new Date(ticket.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                                    No support tickets found for this tenant.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SupportDashboard;
