import React, { useState, useEffect } from 'react';
import { 
    LifeBuoy, Plus, Search, MessageSquare, Clock, 
    CheckCircle2, AlertCircle, ChevronRight, Loader2,
    Activity, Lock
} from 'lucide-react';
import { supportService } from '../../../../core/api/supportService';
import GenericModal from '../../../../core/components/shared/forms/GenericModal';
import TicketThread from '../../components/TicketThread';

const STATUS_CONFIG = {
    'open': { label: 'Waiting', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: Clock },
    'in_progress': { label: 'Assigned', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: Activity },
    'resolved': { label: 'Solved', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
    'closed': { label: 'Closed', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20', icon: Lock },
};

const CustomerTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const data = await supportService.getTickets();
            setTickets(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (formData) => {
        setActionLoading(true);
        try {
            await supportService.createTicket(formData);
            setIsCreateModalOpen(false);
            fetchTickets();
        } catch (error) {
            console.error("Failed to create ticket", error);
        } finally {
            setActionLoading(false);
        }
    };

    const TICKET_FIELDS = [
        { name: 'title', label: 'Summary', required: true, placeholder: 'Brief description of the issue' },
        { name: 'description', label: 'Details', type: 'textarea', required: true, placeholder: 'Steps to reproduce or problem details' },
        { name: 'priority', label: 'Priority', type: 'select', options: [
            { value: 'low', label: 'Low - General Question' },
            { value: 'medium', label: 'Medium - Functional Issue' },
            { value: 'high', label: 'High - System Error' },
            { value: 'critical', label: 'Critical - Business Blocker' }
        ], default: 'medium' }
    ];

    if (selectedTicketId) {
        return (
            <div className="animate-in slide-in-from-right duration-300">
                <button 
                    onClick={() => setSelectedTicketId(null)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-widest"
                >
                    <ChevronRight className="rotate-180" size={16} /> Back to My Tickets
                </button>
                <TicketThread ticketId={selectedTicketId} onStatusChange={fetchTickets} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <LifeBuoy className="text-blue-500" size={28} />
                        Service Desk
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Submit issues and track resolution status</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2"
                >
                    <Plus size={18} /> New Support Case
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="p-20 text-center">
                        <Loader2 className="animate-spin mx-auto text-blue-500 mb-2" size={32} />
                        <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Connecting to Helpdesk...</span>
                    </div>
                ) : tickets.length > 0 ? tickets.map((ticket) => {
                    const config = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
                    return (
                        <div 
                            key={ticket.id}
                            onClick={() => setSelectedTicketId(ticket.id)}
                            className="glass-panel p-5 rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-all group cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${config.color} transition-transform group-hover:scale-110`}>
                                        <config.icon size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{ticket.title}</h3>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                                <MessageSquare size={12} /> {ticket.messages?.length || 0} Replies
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                                <Clock size={12} /> Updated {new Date(ticket.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${config.color}`}>
                                        {config.label}
                                    </span>
                                    <ChevronRight className="text-slate-600 group-hover:text-white transition-colors" size={18} />
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="glass-panel p-16 rounded-2xl border border-slate-700/50 text-center">
                        <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
                            <LifeBuoy size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">No Active Tickets</h3>
                        <p className="text-slate-400 text-sm mb-8">Need technical assistance? Our support team is here to help.</p>
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all border border-slate-700"
                        >
                            Open Your First Case
                        </button>
                    </div>
                )}
            </div>

            <GenericModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Submit Support Case"
                fields={TICKET_FIELDS}
                onSubmit={handleCreateTicket}
                loading={actionLoading}
            />
        </div>
    );
};

export default CustomerTickets;

