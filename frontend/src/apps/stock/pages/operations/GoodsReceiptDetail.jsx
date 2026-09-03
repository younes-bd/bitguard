import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { inventoryService } from '../../api/inventoryService';
import { ArrowLeft, Printer, CheckCircle, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function GoodsReceiptDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchReceipt = async () => {
        try {
            setLoading(true);
            const data = await inventoryService.getGoodsReceipt(id);
            setReceipt(data);
        } catch (error) {
            console.error("Failed to load goods receipt", error);
            toast.error("Failed to load goods receipt");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReceipt();
    }, [id]);

    const handlePrint = async () => {
        try {
            const { default: reportingService } = await import('@/apps/reporting/api/reportingService');
            const res = await reportingService.generateReport(null, 'stock.GoodsReceipt', id);
            if (res && res.url) {
                const response = await fetch(res.url);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = res.filename || 'document.pdf';
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
    );

    if (!receipt) return (
        <div className="text-center py-12 text-slate-400">Goods Receipt not found.</div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/admin/stock/receipts')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Receipts</span>
                </button>
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all shadow-lg font-medium border border-slate-700"
                    >
                        <Printer size={18} />
                        <span>Print Receipt</span>
                    </button>
                </div>
            </div>

            {/* Document Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="border-b border-slate-800 p-6 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                            <Package size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-1">{receipt.reference || `Receipt #${receipt.id}`}</h1>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="text-slate-400">Source: <span className="text-slate-200">{receipt.source_document || 'N/A'}</span></span>
                            </div>
                        </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                        receipt.state === 'done' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' :
                        'bg-blue-500/20 text-blue-400 border-blue-500/50'
                    }`}>
                        {receipt.state}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Vendor / Partner</p>
                            <p className="text-white font-medium">{receipt.partner_name || receipt.partner || 'Internal'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Scheduled Date</p>
                            <p className="text-white">{receipt.scheduled_date || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lines */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white">Received Lines</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950/50 text-slate-400">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Product</th>
                                <th className="px-6 py-4 font-semibold text-right">Demand</th>
                                <th className="px-6 py-4 font-semibold text-right">Done</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {receipt.lines && receipt.lines.length > 0 ? receipt.lines.map((line, idx) => (
                                <tr key={idx} className="hover:bg-slate-800/30">
                                    <td className="px-6 py-4 text-white">{line.product_name || line.product}</td>
                                    <td className="px-6 py-4 text-right text-slate-300">{line.product_uom_qty || line.demand}</td>
                                    <td className="px-6 py-4 text-right text-emerald-400 font-bold">{line.quantity_done || line.done || 0}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-slate-500">No lines found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
