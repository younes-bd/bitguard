import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Save, ArrowLeft, Package, MapPin, Search } from 'lucide-react';
import { erpService } from '../../../../core/api/erpService';
import { toast } from 'react-hot-toast';

const DeliveryNoteCreate = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [form, setForm] = useState({
        invoice: '',
        dn_number: '',
        shipping_address: '',
        tracking_number: '',
        notes: '',
        status: 'draft',
    });

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                // Fetch paid or partially paid standard invoices that don't have DNs yet
                const data = await erpService.getInvoices();
                setInvoices(data?.filter(i => i.type === 'standard' && i.status !== 'draft') || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchInvoices();
    }, []);

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleInvoiceSelect = (e) => {
        const invId = e.target.value;
        const selected = invoices.find(i => i.id === invId);
        if (selected) {
            setForm({
                ...form,
                invoice: invId,
                // generate a tentative DN number
                dn_number: selected.invoice_number.replace('INV', 'DN'),
                // prefill address if available on client (assuming CRM sync, simple text here)
                shipping_address: 'Address on file for ' + selected.client_name
            });
        } else {
            setForm({ ...form, invoice: '', dn_number: '', shipping_address: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dn = await erpService.createDeliveryNote(form);
            toast.success('Delivery Note created');
            navigate(`/admin/inventory/deliveries/${dn.id}`);
        } catch (err) {
            toast.error('Failed to create Delivery Note');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/admin/inventory/deliveries')}
                        className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Truck className="text-blue-500" />
                            New Delivery Note
                        </h1>
                    </div>
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={loading || !form.invoice || !form.dn_number}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 transition-all shadow-lg shadow-blue-500/20"
                >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={18} /> Create Note</>}
                </button>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Link to Invoice *</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <select 
                                name="invoice"
                                value={form.invoice}
                                onChange={handleInvoiceSelect}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none transition-all appearance-none"
                            >
                                <option value="">Select invoice to fulfill...</option>
                                {invoices.map(inv => (
                                    <option key={inv.id} value={inv.id}>{inv.invoice_number} — {inv.client_name}</option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Delivery notes must be linked to a valid standard invoice.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">DN Number *</label>
                        <div className="relative">
                            <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="text" 
                                name="dn_number"
                                value={form.dn_number}
                                onChange={handleFormChange}
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Shipping Address</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-slate-500" size={18} />
                        <textarea 
                            name="shipping_address"
                            value={form.shipping_address}
                            onChange={handleFormChange}
                            rows="3"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none transition-all resize-none"
                            placeholder="Full delivery address..."
                        ></textarea>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tracking Number</label>
                        <input 
                            type="text" 
                            name="tracking_number"
                            value={form.tracking_number}
                            onChange={handleFormChange}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. 1Z9999999999999999"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Status</label>
                        <select 
                            name="status"
                            value={form.status}
                            onChange={handleFormChange}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all appearance-none"
                        >
                            <option value="draft">Draft (Preparing)</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Delivery Instructions / Notes</label>
                    <textarea 
                        name="notes"
                        value={form.notes}
                        onChange={handleFormChange}
                        rows="2"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all resize-none"
                        placeholder="Leave at front door, signature required, etc."
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default DeliveryNoteCreate;
