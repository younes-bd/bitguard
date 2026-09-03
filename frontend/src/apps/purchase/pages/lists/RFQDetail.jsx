import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { purchaseService } from '../../api/purchaseService';
import { ArrowLeft, Printer, Send, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function RFQDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rfq, setRfq] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchRfq = async () => {
        try {
            setLoading(true);
            const data = await purchaseService.getPurchaseOrder(id);
            setRfq(data);
        } catch (error) {
            console.error("Failed to load RFQ", error);
            toast.error("Failed to load RFQ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRfq();
    }, [id]);

    const handlePrint = async () => {
        try {
            const { default: reportingService } = await import('@/apps/reporting/api/reportingService');
            // An RFQ is a PurchaseOrder model. The backend uses the status to render the correct template.
            const res = await reportingService.generateReport(null, 'purchase.PurchaseOrder', rfq.id);
            if (res && res.url) {
                const response = await fetch(res.url);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = res.filename || 'rfq.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate PDF');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
    );

    if (!rfq) return (
        <div className="text-center py-12 text-slate-400">RFQ not found.</div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/admin/purchase/rfqs')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to RFQs</span>
                </button>
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all shadow-lg font-medium border border-slate-700"
                    >
                        <Printer size={18} />
                        <span>Print RFQ</span>
                    </button>
                </div>
            </div>

            {/* Document Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="border-b border-slate-800 p-6 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
                            <FileText size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-1">{rfq.reference || rfq.name || `RFQ-${rfq.id}`}</h1>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="text-slate-400">Vendor: <span className="text-slate-200">{rfq.vendor_name || rfq.vendor?.name || 'N/A'}</span></span>
                            </div>
                        </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                        rfq.status === 'sent' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                        rfq.status === 'confirmed' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' :
                        rfq.status === 'done' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' :
                        'bg-slate-500/20 text-slate-400 border-slate-500/50'
                    }`}>
                        {rfq.status || 'draft'}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Order Date</p>
                            <p className="text-white font-medium">{rfq.date_order ? new Date(rfq.date_order).toLocaleDateString() : '-'}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Total</p>
                            <p className="text-2xl font-bold text-orange-400">
                                {rfq.currency || '$'}{rfq.amount_total || '0.00'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lines */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white">Products</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950/50 text-slate-400">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Product</th>
                                <th className="px-6 py-4 font-semibold text-right">Qty</th>
                                <th className="px-6 py-4 font-semibold text-right">Unit Price</th>
                                <th className="px-6 py-4 font-semibold text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {rfq.lines && rfq.lines.length > 0 ? rfq.lines.map((line, idx) => (
                                <tr key={idx} className="hover:bg-slate-800/30">
                                    <td className="px-6 py-4 text-white font-medium">{line.product_name || line.product}</td>
                                    <td className="px-6 py-4 text-right text-slate-300">{line.product_qty || line.quantity}</td>
                                    <td className="px-6 py-4 text-right text-slate-300">{rfq.currency || '$'}{line.price_unit}</td>
                                    <td className="px-6 py-4 text-right font-bold text-white">{rfq.currency || '$'}{line.price_subtotal}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No products requested</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
