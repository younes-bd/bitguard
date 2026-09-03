import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { inventoryService } from '../../api/inventoryService';
import { ArrowLeft, Printer, Truck, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function StockPickingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [picking, setPicking] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPicking = async () => {
        try {
            setLoading(true);
            const data = await inventoryService.getPicking(id);
            setPicking(data);
        } catch (error) {
            console.error("Failed to load picking", error);
            toast.error("Failed to load transfer");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPicking();
    }, [id]);

    const handlePrint = async () => {
        try {
            const { default: reportingService } = await import('@/apps/reporting/api/reportingService');
            const res = await reportingService.generateReport(null, 'stock.StockPicking', id);
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!picking) return (
        <div className="text-center py-12 text-slate-400">Transfer not found.</div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/admin/stock/transfers')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Transfers</span>
                </button>
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all shadow-lg font-medium border border-slate-700"
                    >
                        <Printer size={18} />
                        <span>Print Picking List</span>
                    </button>
                </div>
            </div>

            {/* Document Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="border-b border-slate-800 p-6 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                            <Truck size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-1">{picking.reference || picking.name || `WH/OUT/${picking.id}`}</h1>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="text-slate-400">Type: <span className="text-slate-200">{picking.picking_type?.name || picking.picking_type || 'Internal Transfer'}</span></span>
                            </div>
                        </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                        picking.state === 'done' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' :
                        picking.state === 'confirmed' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' :
                        picking.state === 'cancel' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                        'bg-blue-500/20 text-blue-400 border-blue-500/50'
                    }`}>
                        {picking.state || 'draft'}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Source Document</p>
                            <p className="text-white font-medium">{picking.origin || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Contact</p>
                            <p className="text-white">{picking.partner_name || picking.partner || '-'}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Locations</p>
                            <div className="flex items-center gap-3 text-white">
                                <span>{picking.location?.name || picking.location_id || 'WH/Stock'}</span>
                                <ArrowRight className="w-4 h-4 text-slate-500" />
                                <span>{picking.location_dest?.name || picking.location_dest_id || 'Partners/Customers'}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Scheduled Date</p>
                            <p className="text-white">{picking.scheduled_date || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lines */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white">Operations</h3>
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
                            {picking.move_lines && picking.move_lines.length > 0 ? picking.move_lines.map((line, idx) => (
                                <tr key={idx} className="hover:bg-slate-800/30">
                                    <td className="px-6 py-4 text-white font-medium">{line.product_name || line.product}</td>
                                    <td className="px-6 py-4 text-right text-slate-300">{line.product_uom_qty || line.demand}</td>
                                    <td className="px-6 py-4 text-right text-blue-400 font-bold">{line.quantity_done || line.done || 0}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-slate-500">No operations found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
