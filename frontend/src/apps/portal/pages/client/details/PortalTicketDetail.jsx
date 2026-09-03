import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { helpdeskService } from '../../../../helpdesk/api/helpdeskService';
import toast from 'react-hot-toast';

export default function PortalTicketDetail() {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        helpdeskService.getTickets().then(data => {
            const arr = Array.isArray(data) ? data : (data?.results ?? []);
            const found = arr.find(t => String(t.id) === String(id));
            if (found) setTicket(found);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="text-center text-slate-500 py-12">Loading ticket...</div>;
    if (!ticket) return <div className="text-center text-slate-500 py-12">Ticket not found</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Link to="/portal/tickets" className="flex items-center text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Tickets
            </Link>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-lg">
                <div className="border-b border-slate-800 pb-6 mb-6">
                    <h1 className="text-2xl font-bold text-white mb-2">{ticket.title ?? ticket.subject}</h1>
                    <div className="flex items-center space-x-4 text-slate-400 text-sm">
                        <span>Ticket #{ticket.id}</span>
                        <span>•</span>
                        <span>{ticket.created_at?.split('T')[0]}</span>
                        <span>•</span>
                        <span className="uppercase text-xs font-bold text-blue-400">{ticket.status?.replace('_', ' ')}</span>
                    </div>
                </div>
                
                <div className="prose prose-invert max-w-none text-slate-300">
                    {ticket.description || "No description provided."}
                </div>
            </div>
        </div>
    );
}

