import React, { useState, useEffect } from 'react';
import { crmService } from '../../../../core/api/crmService';
import { X, DollarSign, Calendar, User, FileText, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const STAGES = [
    { id: 'prospecting', label: 'Prospecting' },
    { id: 'proposal', label: 'Proposal' },
    { id: 'negotiation', label: 'Negotiation' },
    { id: 'won', label: 'Closed Won' },
    { id: 'lost', label: 'Closed Lost' }
];

export default function DealModal({ isOpen, onClose, deal, onSave }) {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: '',
        client: '',
        amount: '',
        stage: 'prospecting',
        expected_close_date: ''
    });

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await crmService.getClients();
                setClients(Array.isArray(data) ? data : data.results || []);
            } catch (error) {
                console.error('Failed to fetch clients', error);
            }
        };
        fetchClients();

        if (deal) {
            setFormData({
                title: deal.title || '',
                client: deal.client || '',
                amount: deal.amount || '',
                stage: deal.stage || 'prospecting',
                expected_close_date: deal.expected_close_date || ''
            });
        }
    }, [deal]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (deal?.id) {
                await crmService.updateDeal(deal.id, formData);
                toast.success('Deal updated');
            } else {
                await crmService.createDeal(formData);
                toast.success('Deal created');
            }
            onSave();
        } catch (error) {
            console.error('Failed to save deal', error);
            toast.error('Failed to save deal');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateProposal = async () => {
        if (!deal?.id) return;
        setGenerating(true);
        try {
            // First we would need to generate a Quote via Contracts API, 
            // but for this demo workflow, we will create a Quote directly 
            // from the backend or redirect them to create a Quote.
            // Since this is UI implementation, we'll assume we navigate to 
            // the Quote creation page pre-filled, or we simulate generation.
            
            // To simulate the full enterprise workflow, usually the system
            // automatically creates a draft quote and takes you to it.
            import('../../../../core/api/client').then(async ({ default: apiClient }) => {
                try {
                    const response = await apiClient.post('contracts/quotes/', {
                        deal: deal.id,
                        client: formData.client,
                        status: 'draft',
                        valid_until: formData.expected_close_date
                    });
                    const newQuote = response.data;
                    toast.success('Service Proposal Generated!');
                    navigate(`/admin/crm/quotes/${newQuote.id}`);
                } catch(err) {
                    // Fallback to Quotes list if auto-generation fails
                    navigate('/admin/contracts/quotes');
                }
            });
        } catch (error) {
            console.error('Failed to generate proposal', error);
            toast.error('Failed to generate proposal');
        } finally {
            setGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
                    <h2 className="text-xl font-bold text-white">{deal ? 'Edit Deal' : 'New Deal'}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <form id="deal-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-1">Deal Title</label>
                            <input 
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Acme Corp Managed Services"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-1">Client</label>
                                <select 
                                    required
                                    value={formData.client}
                                    onChange={e => setFormData({...formData, client: e.target.value})}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Select a client...</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-1">Stage</label>
                                <select 
                                    value={formData.stage}
                                    onChange={e => setFormData({...formData, stage: e.target.value})}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    {STAGES.map(s => (
                                        <option key={s.id} value={s.id}>{s.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-1">Amount ($)</label>
                                <div className="relative">
                                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input 
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={e => setFormData({...formData, amount: e.target.value})}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-1">Expected Close</label>
                                <div className="relative">
                                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input 
                                        type="date"
                                        value={formData.expected_close_date}
                                        onChange={e => setFormData({...formData, expected_close_date: e.target.value})}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>

                    {deal && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mt-6">
                            <h3 className="text-lg font-bold text-blue-400 mb-2 flex items-center gap-2">
                                <FileText size={20} />
                                Document Generation
                            </h3>
                            <p className="text-slate-300 text-sm mb-4">
                                Ready to pitch? Generate a dynamic Service Proposal (Quote) from this deal. It will automatically pull in the client details and pricing.
                            </p>
                            <button 
                                type="button"
                                onClick={handleGenerateProposal}
                                disabled={generating || !formData.client}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                            >
                                {generating ? 'Generating...' : 'Generate Service Proposal'} <ChevronRight size={18} />
                            </button>
                        </div>
                    )}

                    {deal && formData.stage === 'won' && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 mt-6">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-2">
                                <DollarSign size={20} />
                                Convert to Sale Order
                            </h3>
                            <p className="text-slate-300 text-sm mb-4">
                                This deal is marked as Won! Convert it to a Sale Order to start fulfillment and billing.
                            </p>
                            <button 
                                type="button"
                                onClick={async () => {
                                    setGenerating(true);
                                    try {
                                        await crmService.convertDealToSale(deal.id);
                                        toast.success('Converted to Sale Order!');
                                        navigate(`/admin/sales/orders`);
                                        onClose();
                                    } catch(e) {
                                        toast.error('Failed to convert to sale order.');
                                    } finally {
                                        setGenerating(false);
                                    }
                                }}
                                disabled={generating || !formData.client}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                            >
                                {generating ? 'Processing...' : 'Convert to Sale Order'} <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="px-6 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="deal-form"
                        disabled={loading}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Deal'}
                    </button>
                </div>
            </div>
        </div>
    );
}
