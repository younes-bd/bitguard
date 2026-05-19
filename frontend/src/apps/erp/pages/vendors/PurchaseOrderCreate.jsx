import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Save, ArrowLeft, Trash2, Building2 } from 'lucide-react';
import { erpService } from '../../../../core/api/erpService';
import { toast } from 'react-hot-toast';

const PurchaseOrderCreate = () => {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [form, setForm] = useState({
        vendor: '',
        expected_delivery: '',
        notes: '',
        status: 'draft',
    });

    const [items, setItems] = useState([
        { description: '', quantity: 1, unit_price: 0, tax_rate: 0 }
    ]);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const data = await erpService.getVendors();
                setVendors(data?.filter(v => v.is_active) || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchVendors();
    }, []);

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => setItems([...items, { description: '', quantity: 1, unit_price: 0, tax_rate: 0 }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

    const calculateTotals = () => {
        let subtotal = 0;
        let tax = 0;
        items.forEach(item => {
            const lineSub = (item.quantity || 0) * (item.unit_price || 0);
            subtotal += lineSub;
            tax += lineSub * ((item.tax_rate || 0) / 100);
        });
        return { subtotal, tax, total: subtotal + tax };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await erpService.createPurchaseOrder({ ...form, items });
            toast.success('Purchase Order created');
            navigate('/admin/erp/purchase-orders');
        } catch (err) {
            toast.error('Failed to create PO');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const totals = calculateTotals();

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/admin/erp/purchase-orders')}
                        className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <ShoppingCart className="text-emerald-500" />
                            New Purchase Order
                        </h1>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => { setForm({ ...form, status: 'draft' }); handleSubmit(new Event('submit')); }}
                        disabled={loading || !form.vendor || items.length === 0}
                        className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 disabled:opacity-50 transition-all"
                    >
                        Save Draft
                    </button>
                    <button 
                        onClick={() => { setForm({ ...form, status: 'sent' }); handleSubmit(new Event('submit')); }}
                        disabled={loading || !form.vendor || items.length === 0 || !items[0].description}
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={18} /> Issue PO</>}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Line Items */}
                    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <h3 className="text-lg font-bold text-white">Line Items</h3>
                            <button onClick={addItem} className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg transition-colors">
                                <Plus size={14} /> Add Item
                            </button>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-900 text-slate-500 text-[10px] uppercase font-bold tracking-[0.1em] border-b border-slate-800">
                                        <th className="px-6 py-3 w-1/2">Description</th>
                                        <th className="px-4 py-3 w-24">Qty</th>
                                        <th className="px-4 py-3 w-32">Unit Price ($)</th>
                                        <th className="px-4 py-3 w-24">Tax (%)</th>
                                        <th className="px-4 py-3 text-right">Total</th>
                                        <th className="px-4 py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {items.map((item, index) => {
                                        const lineTotal = (item.quantity * item.unit_price) * (1 + item.tax_rate / 100);
                                        return (
                                            <tr key={index} className="group">
                                                <td className="px-6 py-3">
                                                    <input 
                                                        type="text" 
                                                        value={item.description} 
                                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                        placeholder="Item description"
                                                        className="w-full bg-transparent border-none text-sm text-white focus:ring-0 p-0 placeholder-slate-600"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input 
                                                        type="number" 
                                                        min="1"
                                                        value={item.quantity} 
                                                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                                                        className="w-full bg-transparent border-none text-sm text-white focus:ring-0 p-0"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input 
                                                        type="number" 
                                                        step="0.01"
                                                        value={item.unit_price} 
                                                        onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value))}
                                                        className="w-full bg-transparent border-none text-sm text-white focus:ring-0 p-0"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input 
                                                        type="number" 
                                                        value={item.tax_rate} 
                                                        onChange={(e) => handleItemChange(index, 'tax_rate', parseFloat(e.target.value))}
                                                        className="w-full bg-transparent border-none text-sm text-white focus:ring-0 p-0"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="text-sm font-bold text-slate-300">${lineTotal.toFixed(2)}</span>
                                                </td>
                                                <td className="px-4 py-3 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-400 p-1">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Details Panel */}
                    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Vendor *</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <select 
                                    name="vendor"
                                    value={form.vendor}
                                    onChange={handleFormChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-emerald-500 outline-none transition-all appearance-none"
                                >
                                    <option value="">Select a vendor...</option>
                                    {vendors.map(v => (
                                        <option key={v.id} value={v.id}>{v.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Expected Delivery Date</label>
                            <input 
                                type="date" 
                                name="expected_delivery"
                                value={form.expected_delivery}
                                onChange={handleFormChange}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Internal Notes</label>
                            <textarea 
                                name="notes"
                                value={form.notes}
                                onChange={handleFormChange}
                                rows="3"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-all resize-none"
                                placeholder="PO terms or notes..."
                            />
                        </div>
                    </div>

                    {/* Totals Panel */}
                    <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Subtotal</span>
                                <span className="text-white font-bold">${totals.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Tax</span>
                                <span className="text-white font-bold">${totals.tax.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total</span>
                            <span className="text-2xl font-bold text-emerald-400">${totals.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOrderCreate;
