import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Shield, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { helpdeskService } from '../api/helpdeskService';
import { toast } from 'react-hot-toast';

const TicketThread = ({ ticketId, onStatusChange }) => {
    const [ticket, setTicket] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        fetchTicket();
    }, [ticketId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [ticket?.messages]);

    const fetchTicket = async () => {
        try {
            const data = await helpdeskService.getTicket(ticketId);
            setTicket(data);
        } catch (error) {
            toast.error("Failed to load conversation");
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            await helpdeskService.addMessage(ticketId, newMessage);
            setNewMessage('');
            await fetchTicket();
        } catch (error) {
            toast.error("Message delivery failed");
        } finally {
            setSending(false);
        }
    };

    const handleResolve = async () => {
        try {
            await helpdeskService.resolveTicket(ticketId);
            toast.success("Ticket marked as resolved");
            await fetchTicket();
            if (onStatusChange) onStatusChange();
        } catch (error) {
            toast.error("Action failed");
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <div className="glass-panel rounded-2xl border border-slate-700/50 flex flex-col h-[600px] overflow-hidden">
            {/* Thread Header */}
            <div className="p-6 border-b border-slate-700/50 bg-slate-900/50 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">{ticket.title}</h3>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                            <Clock size={12} /> Opened {new Date(ticket.created_at).toLocaleString()}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase border 
                            ${ticket.priority === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                              ticket.priority === 'high' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                              'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                            {ticket.priority} Priority
                        </span>
                    </div>
                </div>
                {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                    <button 
                        onClick={handleResolve}
                        className="px-4 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                    >
                        <CheckCircle2 size={14} /> Mark Resolved
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
            >
                {/* Initial Description */}
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                        <User size={20} />
                    </div>
                    <div className="flex-1 bg-slate-800/40 rounded-2xl p-4 border border-slate-700/30">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-bold text-white">Issue Description</span>
                            <span className="text-[10px] text-slate-500 font-mono">ORIGINAL POST</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                    </div>
                </div>

                {/* Thread Messages */}
                {ticket.messages?.map((msg, idx) => {
                    const isStaff = msg.sender_is_staff; // Assuming serializer provides this
                    return (
                        <div key={idx} className={`flex gap-4 ${isStaff ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0
                                ${isStaff ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                {isStaff ? <Shield size={20} /> : <User size={20} />}
                            </div>
                            <div className={`max-w-[80%] rounded-2xl p-4 border transition-all
                                ${isStaff ? 'bg-blue-500/5 border-blue-500/20 text-right' : 'bg-slate-800/20 border-slate-700/30'}`}>
                                <div className={`flex items-center gap-3 mb-2 ${isStaff ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-xs font-bold text-white">{msg.sender_name || 'User'}</span>
                                    <span className="text-[10px] text-slate-500 font-mono">{new Date(msg.created_at).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            {ticket.status !== 'closed' ? (
                <div className="p-6 bg-slate-900/50 border-t border-slate-700/50">
                    <form onSubmit={handleSendMessage} className="relative">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message here..."
                            rows="1"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-16 py-4 text-sm text-white focus:border-blue-500 outline-none resize-none transition-all custom-scrollbar"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                        />
                        <button 
                            type="submit"
                            disabled={sending || !newMessage.trim()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all disabled:opacity-50 active:scale-90"
                        >
                            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                    </form>
                    <p className="text-[10px] text-slate-500 mt-3 text-center uppercase font-bold tracking-widest">
                        Press Enter to send message
                    </p>
                </div>
            ) : (
                <div className="p-8 bg-slate-900/50 border-t border-slate-700/50 text-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">This ticket is closed and archived.</span>
                </div>
            )}
        </div>
    );
};

export default TicketThread;
