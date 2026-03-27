import React, { useState, useEffect } from 'react';
import { supportService } from '../api/supportService';

const SupportDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await supportService.getTickets();
            // Assuming standardised { status: 'success', data: { results: [] } } response
            setTickets(res.data?.results || []);
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
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Support & Help Desk</h1>

            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
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
                                <tr key={ticket.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs">{ticket.id.split('-')[0]}</td>
                                    <td className="px-4 py-3 font-semibold text-white">{ticket.title}</td>
                                    <td className="px-4 py-3 uppercase text-xs tracking-wider">{ticket.status}</td>
                                    <td className="px-4 py-3 uppercase text-xs tracking-wider">{ticket.priority}</td>
                                    <td className="px-4 py-3">{new Date(ticket.created_at).toLocaleDateString()}</td>
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
