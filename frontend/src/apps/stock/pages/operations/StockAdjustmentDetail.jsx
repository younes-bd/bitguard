import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { inventoryService } from '../../api/inventoryService';
import { ArrowLeft, Printer, Edit3 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function StockAdjustmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [adjustment, setAdjustment] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAdjustment = async () => {
        try {
            setLoading(true);
            const data = await inventoryService.getAdjustment(id);
            setAdjustment(data);
        } catch (error) {
            console.error("Failed to load adjustment", error);
            toast.error("Failed to load adjustment");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdjustment();
    }, [id]);

    const handlePrint = async () => {
        try {
            const { default: reportingService } = await import('@/apps/reporting/api/reportingService');
            const res = await reportingService.generateReport(null, 'stock.StockAdjustment', id);
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

    if (!adjustment) return (
        <div className="text-center py-12 text-slate-400">Adjustment not found.</div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/admin/stock/adjustments')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Adjustments</span>
                </button>
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all shadow-lg font-medium border border-slate-700"
                    >
                        <Printer size={18} />
                        <span>Print Count Sheet</span>
                    </button>
                </div>
            </div>

            {/* Document Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="border-b border-slate-800 p-6 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                            <Edit3 size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-1">{adjustment.reference || `ADJ-${adjustment.id}`}</h1>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="text-slate-400">Date: <span className="text-slate-200">{adjustment.created_at ? new Date(adjustment.created_at).toLocaleDateString() : '-'}</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Item</p>
                            <p className="text-white font-medium">{adjustment.inventory_item_name || adjustment.inventory_item || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Reason</p>
                            <p className="text-white">{adjustment.reason || 'Physical Count'}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Counted Quantity</p>
                            <div className="text-2xl font-bold text-emerald-400">
                                {adjustment.counted_quantity}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
