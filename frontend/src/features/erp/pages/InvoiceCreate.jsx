import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { erpService } from '../../../shared/core/services/erpService';
import { crmService } from '../../../shared/core/services/crmService';
import { Save, ArrowLeft, Plus, Trash2, FileText, User } from 'lucide-react';

const InvoiceCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);

    const [formData, setFormData] = useState({
        client: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: '',
        status: 'draft',
        notes: '',
        items: [
            { description: 'Service Fee', quantity: 1, unit_price: 0, amount: 0 }
        ]
    });

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await crmService.getClients();
                setClients(Array.isArray(data) ? data : data.results || []);
            } catch (error) {
                console.error("Failed to load clients", error);
            }
        };
        fetchClients();
    }, []);

    // Form Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        // Auto-calc amount
        if (field === 'quantity' || field === 'unit_price') {
            const qty = parseFloat(newItems[index].quantity) || 0;
            const price = parseFloat(newItems[index].unit_price) || 0;
            newItems[index].amount = qty * price;
        }

        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { description: '', quantity: 1, unit_price: 0, amount: 0 }]
        }));
    };

    const removeItem = (index) => {
        if (formData.items.length === 1) return;
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    // Calculations
    const subtotal = formData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const tax = subtotal * 0.1; // 10% tax example or 0
    const total = subtotal + tax;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            subtotal,
            tax,
            total
        };

        try {
            await erpService.createInvoice(payload);
            navigate('/erp/invoices');
        } catch (error) {
            console.error("Create failed", error);
            alert("Failed to create invoice.");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/erp/invoices')}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">New Invoice</h1>
                    <p className="text-slate-400">Create and send a new bill to a client</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Client & Dates */}
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                <User size={16} /> Client
                            </label>
                            <select
                                name="client"
                                value={formData.client}
                                onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                required
                            >
                                <option value="">Select Client</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Issue Date</label>
                                <input
                                    type="date"
                                    name="issue_date"
                                    value={formData.issue_date}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Due Date</label>
                                <input
                                    type="date"
                                    name="due_date"
                                    value={formData.due_date}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <FileText size={20} className="text-blue-400" />
                            Line Items
                        </h3>
                        <button
                            type="button"
                            onClick={addItem}
                            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                            <Plus size={16} /> Add Item
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.items.map((item, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <input
                                        placeholder="Description"
                                        value={item.description}
                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2 text-white text-sm focus:border-blue-500/50 outline-none"
                                        required
                                    />
                                </div>
                                <div className="w-24">
                                    <input
                                        type="number"
                                        placeholder="Qty"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2 text-white text-sm focus:border-blue-500/50 outline-none text-right"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="w-32">
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={item.unit_price}
                                        onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-2 text-white text-sm focus:border-blue-500/50 outline-none text-right"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div className="w-24 py-2 text-right text-slate-300 font-medium text-sm">
                                    ${parseFloat(item.amount).toFixed(2)}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 border-t border-slate-700 pt-4 flex flex-col items-end gap-2">
                        <div className="flex justify-between w-64 text-sm">
                            <span className="text-slate-400">Subtotal:</span>
                            <span className="text-white">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between w-64 text-sm">
                            <span className="text-slate-400">Tax (10%):</span>
                            <span className="text-white">${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between w-64 text-lg font-bold border-t border-slate-700 mt-2 pt-2">
                            <span className="text-white">Total:</span>
                            <span className="text-emerald-400">${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/erp/invoices')}
                        className="px-6 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-500/20 transition-colors flex items-center gap-2"
                    >
                        {loading ? 'Creating...' : (
                            <>
                                <Save size={18} />
                                Save Invoice
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InvoiceCreate;


