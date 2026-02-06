import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../../../shared/core/services/client';
import { FileText, ArrowLeft, Check, X, Calendar, User, DollarSign, Download } from 'lucide-react';

const QuoteDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchQuote();
    }, [id]);

    const fetchQuote = async () => {
        try {
            const response = await client.get(`crm/quotes/${id}/`);
            setQuote(response.data);
        } catch (error) {
            console.error("Error fetching quote:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action) => {
        if (!window.confirm(`Are you sure you want to ${action} this quote?`)) return;

        setActionLoading(true);
        try {
            const response = await client.post(`crm/quotes/${id}/${action}/`);
            if (action === 'accept' && response.data.invoice_id) {
                alert(`Quote Accepted! Invoice #${response.data.invoice_id} created.`);
                navigate(`/erp/invoices/${response.data.invoice_id}`);
            } else {
                fetchQuote(); // Refresh status
            }
        } catch (error) {
            console.error(`Error performing ${action}:`, error);
            alert("Action failed. Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading quote details...</div>;
    if (!quote) return <div className="p-8 text-center">Quote not found.</div>;

    const isActionable = ['draft', 'sent'].includes(quote.status);

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={() => navigate('/crm/quotes')}
                className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={18} className="mr-2" />
                Back to Quotes
            </button>

            {/* Header Card */}
            <div className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-white font-mono">{quote.quote_number}</h1>
                            <span className={`px-3 py-1 rounded text-xs font-bold border uppercase tracking-wide ${quote.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    quote.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                }`}>
                                {quote.status}
                            </span>
                        </div>
                        <p className="text-slate-400 flex items-center gap-2">
                            <span>Client:</span>
                            <span className="font-medium text-white">{quote.client_name}</span>
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {isActionable && (
                            <>
                                <button
                                    onClick={() => handleAction('reject')}
                                    disabled={actionLoading}
                                    className="flex items-center px-4 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                >
                                    <X size={18} className="mr-2" />
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleAction('accept')}
                                    disabled={actionLoading}
                                    className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                >
                                    <Check size={18} className="mr-2" />
                                    Accept & Convert
                                </button>
                            </>
                        )}
                        <button className="p-2 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                            <Download size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Line Items */}
                    <div className="glass-panel rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-md overflow-hidden">
                        <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                            <h3 className="font-semibold text-slate-200">Line Items</h3>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 border-b border-slate-700 text-xs uppercase text-slate-500 font-bold">
                                <tr>
                                    <th className="px-6 py-3">Description</th>
                                    <th className="px-6 py-3 text-right">Qty</th>
                                    <th className="px-6 py-3 text-right">Unit Price</th>
                                    <th className="px-6 py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50 text-slate-300">
                                {quote.items && quote.items.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-700/30">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{item.description}</div>
                                            {item.product_name && <div className="text-xs text-slate-500">{item.product_name}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-400">{item.quantity}</td>
                                        <td className="px-6 py-4 text-right text-slate-400">${parseFloat(item.unit_price).toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right font-medium text-emerald-400 font-mono">${parseFloat(item.amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Summary Card */}
                    <div className="glass-panel rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-md p-6">
                        <h3 className="font-semibold text-slate-200 mb-4">Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span>${parseFloat(quote.subtotal || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Tax</span>
                                <span>${parseFloat(quote.tax || 0).toFixed(2)}</span>
                            </div>
                            <div className="pt-3 border-t border-slate-700/50 flex justify-between font-bold text-lg text-white">
                                <span>Total</span>
                                <span className="text-emerald-400 font-mono">${parseFloat(quote.total || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Card */}
                    <div className="glass-panel rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-md p-6">
                        <h3 className="font-semibold text-slate-200 mb-4">Infos</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-500">
                                    <Calendar size={16} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase">Issue Date</div>
                                    <div className="font-medium text-slate-300">{new Date(quote.issue_date || quote.created_at).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-500">
                                    <Calendar size={16} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase">Valid Until</div>
                                    <div className="font-medium text-slate-300">{quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteDetail;


