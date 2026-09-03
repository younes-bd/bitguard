import React, { useState, useEffect } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { portalService } from '../../../api/portalService';
import toast from 'react-hot-toast';

const statusBadge = (status) => {
    const map = { open: 'bg-amber-500/10 text-amber-400', in_progress: 'bg-blue-500/10 text-blue-400', resolved: 'bg-emerald-500/10 text-emerald-400' };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>{status?.replace('_', ' ')}</span>;
};

const PortalTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ subject: '', description: '', priority: 'medium' });
    const [submitting, setSubmitting] = useState(false);

    const fetchTickets = () => {
        setLoading(true);
        portalService.getTickets()
            .then(data => { setTickets(Array.isArray(data) ? data : (data?.results ?? [])); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await portalService.createTicket(formData);
            toast.success('Ticket created successfully');
            setIsModalOpen(false);
            setFormData({ subject: '', description: '', priority: 'medium' });
            fetchTickets();
        } catch (error) {
            toast.error('Failed to create ticket');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-400 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">My Support Tickets</h1>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
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

            {/* Modal overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-white mb-6">Create New Ticket</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Subject</label>
                                <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder="Brief issue summary" />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                                <textarea required rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none" placeholder="Provide details about your issue..." />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</label>
                                <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none">
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]">
                                    {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Submit Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortalTickets;


