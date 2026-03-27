import React from 'react';
import { FileText, DollarSign, Clock, CheckCircle2 } from 'lucide-react';

const MOCK_INVOICES = [
    { id: 'INV-2026-001', client: 'Acme Corp', amount: 299, status: 'paid', date: '2026-03-01', due: '2026-03-15' },
    { id: 'INV-2026-002', client: 'TechStart Inc', amount: 99, status: 'paid', date: '2026-03-01', due: '2026-03-15' },
    { id: 'INV-2026-003', client: 'Global Finance', amount: 299, status: 'pending', date: '2026-03-15', due: '2026-03-30' },
    { id: 'INV-2026-004', client: 'DataFlow Ltd', amount: 99, status: 'overdue', date: '2026-02-15', due: '2026-03-01' },
];

const STATUS_BADGE = {
    paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const InvoicesList = () => (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                <FileText className="text-emerald-400" size={28} />
                Billing Invoices
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Track subscription invoices and payment status</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="text-slate-400 text-xs uppercase font-bold mb-1">Total Revenue (MTD)</div>
                <div className="text-3xl font-bold text-emerald-400">${MOCK_INVOICES.reduce((s, i) => s + i.amount, 0).toLocaleString()}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="text-slate-400 text-xs uppercase font-bold mb-1">Paid</div>
                <div className="text-3xl font-bold text-emerald-400">{MOCK_INVOICES.filter(i => i.status === 'paid').length}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="text-slate-400 text-xs uppercase font-bold mb-1">Overdue</div>
                <div className="text-3xl font-bold text-red-400">{MOCK_INVOICES.filter(i => i.status === 'overdue').length}</div>
            </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-800">
                        {['Invoice #', 'Client', 'Amount', 'Status', 'Date', 'Due'].map(h => (
                            <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {MOCK_INVOICES.map(inv => (
                        <tr key={inv.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer">
                            <td className="px-5 py-4 text-white font-mono font-medium">{inv.id}</td>
                            <td className="px-5 py-4 text-slate-300">{inv.client}</td>
                            <td className="px-5 py-4 text-white font-semibold flex items-center gap-1"><DollarSign size={13} className="text-emerald-400" />{inv.amount}</td>
                            <td className="px-5 py-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${STATUS_BADGE[inv.status]}`}>{inv.status}</span></td>
                            <td className="px-5 py-4 text-slate-500 text-xs">{inv.date}</td>
                            <td className="px-5 py-4 text-slate-500 text-xs">{inv.due}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default InvoicesList;
