import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { erpService } from '../../../shared/core/services/erpService';
import {
    ArrowLeft, Printer, Download, Mail,
    CheckCircle, AlertCircle, Clock
} from 'lucide-react';

const InvoiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const data = await erpService.getInvoice(id);
                setInvoice(data);
            } catch (error) {
                console.error("Failed to load invoice", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!invoice) return (
        <div className="text-center py-12 text-slate-400">Invoice not found.</div>
    );

    const getStatusBadge = (status) => {
        const styles = {
            paid: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
            sent: "bg-blue-500/20 text-blue-400 border-blue-500/50",
            overdue: "bg-red-500/20 text-red-400 border-red-500/50",
            draft: "bg-slate-500/20 text-slate-400 border-slate-500/50"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${styles[status] || styles.draft}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/erp/invoices')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Invoices</span>
                </button>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700">
                        <Printer size={18} />
                        <span>Print</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700">
                        <Download size={18} />
                        <span>PDF</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                        <Mail size={18} />
                        <span>Send to Client</span>
                    </button>
                </div>
            </div>

            {/* Invoice Paper */}
            <div className="bg-white text-slate-900 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-slate-200 flex justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">INVOICE</h1>
                        <div className="text-slate-500">#{invoice.invoice_number}</div>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-xl text-slate-800">BitGuard Inc.</div>
                        <div className="text-slate-500 text-sm">
                            123 Tech Park, Suite 400<br />
                            San Francisco, CA 94107<br />
                            billing@bitguard.com
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Bill To</div>
                        <div className="font-medium text-slate-800">{invoice.client_name}</div>
                        <div className="text-sm text-slate-500">
                            {/* Mock address since it's flattened */}
                            Client Address Line 1<br />
                            City, Country
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Issue Date</div>
                        <div className="font-medium text-slate-800">{invoice.issue_date}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Due Date</div>
                        <div className="font-medium text-slate-800">{invoice.due_date}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Status</div>
                        <div>{getStatusBadge(invoice.status)}</div>
                    </div>
                </div>

                {/* Items */}
                <div className="px-8 pb-8">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-slate-100 text-slate-500 text-sm">
                                <th className="py-3 font-semibold">Description</th>
                                <th className="py-3 font-semibold text-right">Qty</th>
                                <th className="py-3 font-semibold text-right">Price</th>
                                <th className="py-3 font-semibold text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {invoice.items && invoice.items.map((item, i) => (
                                <tr key={i} className="border-b border-slate-50">
                                    <td className="py-4">{item.description}</td>
                                    <td className="py-4 text-right">{item.quantity}</td>
                                    <td className="py-4 text-right">${item.unit_price}</td>
                                    <td className="py-4 text-right font-medium">${item.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end mt-8">
                        <div className="w-64 space-y-2">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>${invoice.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Tax</span>
                                <span>${invoice.tax}</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl text-slate-900 border-t-2 border-slate-100 pt-2">
                                <span>Total</span>
                                <span>${invoice.total}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-8 border-t border-slate-200 text-center text-slate-500 text-sm">
                    Thank you for your business. Please make checks payable to BitGuard Inc.
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetail;


