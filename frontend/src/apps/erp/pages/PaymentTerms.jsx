import React, { useState, useEffect } from 'react';
import { CalendarDays, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import api from '../../../core/api/client';
import toast from 'react-hot-toast';

const PaymentTerms = () => {
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        days_due: 30,
        discount_percent: 0,
        discount_days: 0,
        description: ''
    });

    useEffect(() => {
        fetchTerms();
    }, []);

    const fetchTerms = async () => {
        try {
            setLoading(true);
            const res = await api.get('/erp/payment-terms/');
            setTerms(res.data.data || res.data);
        } catch (err) {
            toast.error("Failed to load payment terms");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (formData.id) {
                await api.put(`/erp/payment-terms/${formData.id}/`, formData);
                toast.success("Payment term updated");
            } else {
                await api.post('/erp/payment-terms/', formData);
                toast.success("Payment term created");
            }
            setIsEditing(false);
            setFormData({ name: '', days_due: 30, discount_percent: 0, discount_days: 0, description: '' });
            fetchTerms();
        } catch (err) {
            toast.error("Failed to save payment term");
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this payment term?')) {
            try {
                await api.delete(`/erp/payment-terms/${id}/`);
                toast.success("Deleted successfully");
                fetchTerms();
            } catch (err) {
                toast.error("Failed to delete");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <CalendarDays className="text-emerald-400" size={28} />
                        Payment Terms
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage invoice due date rules and early-payment discounts</p>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} /> New Term
                    </button>
                )}
            </div>

            {isEditing && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <h3 className="text-white font-medium mb-4">{formData.id ? 'Edit Term' : 'New Payment Term'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Name</label>
                            <input 
                                type="text" value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. Net 30"
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Days Due</label>
                            <input 
                                type="number" value={formData.days_due}
                                onChange={e => setFormData({...formData, days_due: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Discount % (Early Pay)</label>
                            <input 
                                type="number" step="0.1" value={formData.discount_percent}
                                onChange={e => setFormData({...formData, discount_percent: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Discount Days</label>
                            <input 
                                type="number" value={formData.discount_days}
                                onChange={e => setFormData({...formData, discount_days: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-slate-400 text-xs mb-1">Description</label>
                            <input 
                                type="text" value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-3 justify-end">
                        <button 
                            onClick={() => { setIsEditing(false); setFormData({}); }}
                            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-500 transition-colors"
                        >
                            Save Term
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium">Days Due</th>
                            <th className="p-4 font-medium">Early Discount</th>
                            <th className="p-4 font-medium">Description</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {loading ? (
                            <tr><td colSpan="5" className="p-4 text-center text-slate-500">Loading terms...</td></tr>
                        ) : terms.length === 0 ? (
                            <tr><td colSpan="5" className="p-4 text-center text-slate-500">No payment terms found. Create one above.</td></tr>
                        ) : terms.map(term => (
                            <tr key={term.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="p-4 text-sm font-medium text-white">{term.name}</td>
                                <td className="p-4 text-sm text-slate-400">{term.days_due} days</td>
                                <td className="p-4 text-sm text-slate-400">
                                    {term.discount_percent > 0 
                                        ? `${term.discount_percent}% within ${term.discount_days} days` 
                                        : 'None'}
                                </td>
                                <td className="p-4 text-sm text-slate-400">{term.description || '-'}</td>
                                <td className="p-4 flex gap-3 justify-end">
                                    <button onClick={() => { setFormData(term); setIsEditing(true); }} className="text-slate-400 hover:text-white transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(term.id)} className="text-rose-400 hover:text-rose-300 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentTerms;
