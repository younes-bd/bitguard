import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { erpService } from '../../../../core/api/erpService';
import { crmService } from '../../../../core/api/crmService';
import { DollarSign, CreditCard, Calendar, FileText, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

const METHODS = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'cash', label: 'Cash' },
];

const PaymentForm = ({ invoiceId, invoiceNumber, balanceDue, onSuccess, onCancel }) => {
    const [form, setForm] = useState({
        invoice: invoiceId,
        amount: balanceDue || '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'bank_transfer',
        reference: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await erpService.createPayment(form);
            toast.success('Payment recorded successfully');
            onSuccess?.();
        } catch (err) {
            toast.error('Failed to record payment');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg">Record Payment</h2>
                            <p className="text-slate-400 text-xs">Invoice #{invoiceNumber}</p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Amount */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Amount Received
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <input
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                step="0.01"
                                min="0.01"
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-white text-lg font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all"
                                placeholder="0.00"
                            />
                        </div>
                        {balanceDue && (
                            <p className="text-xs text-slate-500">Balance due: <span className="text-emerald-400 font-bold">${parseFloat(balanceDue).toLocaleString()}</span></p>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <CreditCard size={12} /> Payment Method
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {METHODS.map(m => (
                                <button
                                    key={m.value}
                                    type="button"
                                    onClick={() => setForm(p => ({ ...p, payment_method: m.value }))}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                                        form.payment_method === m.value
                                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date & Reference */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={12} /> Date
                            </label>
                            <input
                                type="date"
                                name="payment_date"
                                value={form.payment_date}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <FileText size={12} /> Reference
                            </label>
                            <input
                                type="text"
                                name="reference"
                                value={form.reference}
                                onChange={handleChange}
                                placeholder="TXN ID, cheque #"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><Check size={16} /> Record Payment</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;
