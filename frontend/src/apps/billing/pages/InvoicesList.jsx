import React from 'react';
import { FileText, DollarSign, Clock, CheckCircle2 } from 'lucide-react';

const InvoicesList = () => {
    const [invoices, setInvoices] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        import('../../../core/api/client').then(({ default: client }) => {
            client.get('billing/invoices/')
                .then(r => {
                    setInvoices(r.data?.results ?? r.data ?? []);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        });
    }, []);

    return (
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
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Total Amount</div>
                    <div className="text-3xl font-bold text-emerald-400">${invoices.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Paid</div>
                    <div className="text-3xl font-bold text-emerald-400">{invoices.filter(i => i.status === 'paid').length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Pending</div>
                    <div className="text-3xl font-bold text-amber-400">{invoices.filter(i => i.status === 'pending').length}</div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Invoice #', 'Customer', 'Amount', 'Status', 'Generated', 'Due'].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="py-8 text-center text-slate-500">Loading...</td></tr>
                        ) : invoices.length === 0 ? (
                            <tr><td colSpan={6} className="py-8 text-center text-slate-500">No invoices found.</td></tr>
                        ) : invoices.map(inv => (
                            <tr key={inv.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer">
                                <td className="px-5 py-4 text-white font-mono font-medium">{inv.invoice_number}</td>
                                <td className="px-5 py-4 text-slate-300">{inv.customer_name || 'N/A'}</td>
                                <td className="px-5 py-4 text-white font-semibold flex items-center gap-1"><DollarSign size={13} className="text-emerald-400" />{parseFloat(inv.amount).toFixed(2)} {inv.currency || 'USD'}</td>
                                <td className="px-5 py-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${STATUS_BADGE[inv.status] || STATUS_BADGE.pending}`}>{inv.status}</span></td>
                                <td className="px-5 py-4 text-slate-500 text-xs">{inv.created_at?.split('T')[0]}</td>
                                <td className="px-5 py-4 text-slate-500 text-xs">{inv.due_date ? inv.due_date.split('T')[0] : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoicesList;

