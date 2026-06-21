import React, { useState, useEffect } from 'react';
import { AlertCircle, FileText, Send, XCircle, Clock } from 'lucide-react';
import client from '../../../../core/api/client';
import toast from 'react-hot-toast';

export default function DunningManager() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOverdue();
    }, []);

    const fetchOverdue = () => {
        setLoading(true);
        client.get('erp/invoices/', { params: { status: 'overdue' } })
            .then(res => setInvoices(res.data?.results || res.data || []))
            .catch(() => toast.error('Failed to fetch overdue invoices'))
            .finally(() => setLoading(false));
    };

    const handleSendReminder = async (id) => {
        try {
            await client.post(`erp/invoices/${id}/send-reminder/`);
            toast.success('Reminder sent');
            fetchOverdue();
        } catch {
            toast.error('Failed to send reminder');
        }
    };

    const handleMarkUncollectable = async (id) => {
        if (!window.confirm("Are you sure you want to write off this invoice as uncollectable?")) return;
        try {
            await client.patch(`erp/invoices/${id}/`, { status: 'uncollectable' });
            toast.success('Invoice marked as uncollectable');
            fetchOverdue();
        } catch {
            toast.error('Failed to update invoice');
        }
    };

    const daysOverdue = (dueDate) => {
        if (!dueDate) return 0;
        const diff = Date.now() - new Date(dueDate).getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading dunning data...</p>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <AlertCircle className="text-rose-400" size={28} /> Dunning Management
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Track and recover overdue payments from clients</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Total Overdue</p>
                    <p className="text-3xl font-black text-rose-400">
                        ${invoices.reduce((s, i) => s + parseFloat(i.total_amount || 0), 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">At Risk (&gt;30 Days)</p>
                    <p className="text-3xl font-black text-amber-400">
                        {invoices.filter(i => daysOverdue(i.due_date) > 30).length} Invoices
                    </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-center">
                    <p className="text-xs font-bold text-slate-500 mb-2">Auto-Reminders Active:</p>
                    <div className="flex gap-2">
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">7 Days</span>
                        <span className="px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">14 Days</span>
                        <span className="px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">30 Days</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-950/60 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                        <tr>
                            <th className="p-4">Invoice</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Due Date</th>
                            <th className="p-4">Aging</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {invoices.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-12 text-center text-slate-500">
                                    <FileText size={40} className="mx-auto mb-3 opacity-20" />
                                    No overdue invoices found. Excellent!
                                </td>
                            </tr>
                        ) : (
                            invoices.map(inv => {
                                const days = daysOverdue(inv.due_date);
                                return (
                                    <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4">
                                            <p className="text-white font-medium text-sm">#{inv.invoice_number || inv.id}</p>
                                        </td>
                                        <td className="p-4 text-sm text-slate-300">{inv.client_name || `Client #${inv.client}`}</td>
                                        <td className="p-4 text-sm text-slate-400">{inv.due_date}</td>
                                        <td className="p-4">
                                            <span className={`flex items-center gap-1 text-xs font-bold ${days > 30 ? 'text-rose-400' : days > 14 ? 'text-amber-400' : 'text-slate-400'}`}>
                                                <Clock size={12} /> {days} days
                                            </span>
                                        </td>
                                        <td className="p-4 text-white font-bold text-sm">${parseFloat(inv.total_amount).toLocaleString()}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleSendReminder(inv.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all" title="Send email reminder">
                                                    <Send size={12} /> Send Reminder
                                                </button>
                                                <button onClick={() => handleMarkUncollectable(inv.id)} className="p-1.5 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 rounded-lg transition-colors" title="Write off as uncollectable">
                                                    <XCircle size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

