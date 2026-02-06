import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { crmService } from '../../../shared/core/services/crmService';
import {
    ArrowLeft, User, Paperclip, Send, Clock,
    CheckCircle, AlertCircle, MessageSquare
} from 'lucide-react';

const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const data = await crmService.getTicket(id);
                setTicket(data);
            } catch (error) {
                console.error("Failed to load ticket", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [id]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        // In a real app, post to API
        console.log("Sending...", newMessage);
        setNewMessage("");
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!ticket) return <div className="text-white text-center py-10">Ticket not found</div>;

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/crm/tickets')}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-white max-w-xl truncate">{ticket.subject}</h1>
                            <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                {ticket.status}
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm">Ticket #{ticket.id} • {ticket.client_name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg">
                        Resolve Ticket
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
                {/* Chat Area */}
                <div className="flex-1 glass-panel rounded-xl border border-slate-700/50 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Initial Description */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                                <User size={20} className="text-slate-400" />
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="font-bold text-white">Client</span>
                                    <span className="text-xs text-slate-500">{new Date(ticket.created_at).toLocaleString()}</span>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-r-xl rounded-bl-xl text-slate-300 leading-relaxed border border-slate-700">
                                    {ticket.description}
                                </div>
                            </div>
                        </div>

                        {/* Mock Reply */}
                        <div className="flex gap-4 flex-row-reverse">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                <span className="font-bold text-white">You</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-xs text-slate-500">10 mins ago</span>
                                    <span className="font-bold text-white">Support Agent</span>
                                </div>
                                <div className="bg-blue-600/20 p-4 rounded-l-xl rounded-br-xl text-blue-100 leading-relaxed border border-blue-500/30">
                                    We are looking into this issue right now. Can you provide the server logs?
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-slate-900/50 border-t border-slate-700/50">
                        <form onSubmit={handleSendMessage} className="flex gap-4">
                            <button type="button" className="p-3 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                                <Paperclip size={20} />
                            </button>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a reply..."
                                className="flex-1 bg-slate-800 border-none rounded-lg px-4 text-white focus:ring-1 focus:ring-blue-500"
                            />
                            <button type="submit" className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg">
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="w-full lg:w-80 shrink-0 space-y-4 overflow-y-auto">
                    <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Details</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs text-slate-500 uppercase">Priority</div>
                                <div className="text-white font-medium capitalize">{ticket.priority}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase">Category</div>
                                <div className="text-white font-medium capitalize">{ticket.category || 'Technical Support'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase">Assigned To</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-6 h-6 rounded-full bg-purple-500 text-xs flex items-center justify-center font-bold">JD</div>
                                    <span className="text-white">John Doe</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">SLA Status</h3>
                        <div className="flex items-center gap-3 text-orange-400 bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
                            <Clock size={20} />
                            <div>
                                <div className="text-sm font-bold">2h 15m remaining</div>
                                <div className="text-xs opacity-80">Response needed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetail;


