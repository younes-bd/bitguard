import React, { useState, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';
import client from '../../../core/api/client';

const statusBadge = (status) => {
    const map = { paid: 'bg-emerald-500/10 text-emerald-400', unpaid: 'bg-amber-500/10 text-amber-400', overdue: 'bg-red-500/10 text-red-400' };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>{status}</span>;
};

const PortalInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('erp/invoices/').then(r => { setInvoices(r.data?.results ?? r.data ?? []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-400">
            <h1 className="text-xl font-bold text-white">My Invoices</h1>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Invoice #', 'Date', 'Due Date', 'Amount', 'Status', ''].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan={6} className="py-16 text-center text-slate-500">Loading invoices...</td></tr>
                            : invoices.length === 0 ? <tr><td colSpan={6} className="py-16 text-center text-slate-500">No invoices yet</td></tr>
                                : invoices.map(inv => (
                                    <tr key={inv.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                                        <td className="px-5 py-3 text-slate-300 font-mono">#{inv.invoice_number ?? inv.id}</td>
                                        <td className="px-5 py-3 text-slate-400">{inv.issue_date ?? inv.created_at?.split('T')[0]}</td>
                                        <td className="px-5 py-3 text-slate-400">{inv.due_date ?? '—'}</td>
                                        <td className="px-5 py-3 text-white font-semibold">${Number(inv.total ?? inv.amount ?? 0).toFixed(2)}</td>
                                        <td className="px-5 py-3">{statusBadge(inv.status)}</td>
                                        <td className="px-5 py-3">
                                            {inv.pdf_url && <a href={inv.pdf_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 no-underline"><Download size={12} /> PDF</a>}
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PortalInvoices;
