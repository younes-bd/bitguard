import React, { useState, useEffect } from 'react';
import { FileText, DollarSign, Clock, CheckCircle2, Download, ExternalLink } from 'lucide-react';
import { billingService } from '../../../../core/api/billingService';

const STATUS_BADGE = {
    paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    void: 'bg-slate-700 text-slate-400 border-slate-600',
};

const InvoicesList = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const data = await billingService.getInvoices();
            setInvoices(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to fetch invoices", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <FileText className="text-emerald-400" size={28} />
                    Billing Invoices
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Track subscription invoices and payment status</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-panel p-5 rounded-xl border border-slate-700/50">
                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Total Collections</div>
                    <div className="text-3xl font-bold text-white">${invoices.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-slate-700/50">
                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Paid Invoices</div>
                    <div className="text-3xl font-bold text-emerald-400">{invoices.filter(i => i.status === 'paid').length}</div>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-slate-700/50">
                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Pending</div>
                    <div className="text-3xl font-bold text-amber-400">{invoices.filter(i => i.status === 'pending').length}</div>
                </div>
            </div>

            <div className="glass-panel border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-700/50">
                                {['Invoice #', 'Customer', 'Amount', 'Status', 'Generated', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {loading ? (
                                <tr><td colSpan={6} className="py-12 text-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto"></div>
                                </td></tr>
                            ) : invoices.length === 0 ? (
                                <tr><td colSpan={6} className="py-12 text-center text-slate-500 italic">No invoices found.</td></tr>
                            ) : invoices.map(inv => (
                                <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-5 py-4 text-white font-mono font-medium">{inv.invoice_number}</td>
                                    <td className="px-5 py-4">
                                        <div className="text-slate-300 font-medium">{inv.customer_name || 'Anonymous'}</div>
                                        <div className="text-[10px] text-slate-500 font-mono">{inv.id.substring(0, 8)}...</div>
                                    </td>
                                    <td className="px-5 py-4 text-white font-semibold">
                                        <div className="flex items-center gap-1">
                                            <DollarSign size={13} className="text-emerald-400" />
                                            {parseFloat(inv.amount).toFixed(2)}
                                            <span className="text-[10px] text-slate-500 font-normal ml-1">{inv.currency || 'USD'}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${STATUS_BADGE[inv.status] || STATUS_BADGE.pending}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-500 text-xs">
                                        {new Date(inv.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-2">
                                            {inv.pdf_url && (
                                                <a href={inv.pdf_url} target="_blank" rel="noreferrer" className="p-1.5 bg-slate-800 text-slate-400 hover:text-emerald-400 rounded transition-colors border border-slate-700">
                                                    <Download size={14} />
                                                </a>
                                            )}
                                            <button className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded transition-colors border border-slate-700">
                                                <ExternalLink size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InvoicesList;


