import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { purchaseService } from '../../api/purchaseService';
import {
    ArrowLeft, Printer, Download, Mail,
    CheckCircle, AlertCircle, Clock, FileCheck, RefreshCcw, FileText, Truck
} from 'lucide-react';

const PurchaseOrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [po, setPo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchPO = async () => {
        try {
            const data = await purchaseService.getPurchaseOrder(id);
            setPo(data);
        } catch (error) {
            console.error("Failed to load purchase order", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPO();
    }, [id]);

    const handleReceive = async () => {
        if (!window.confirm("Mark this Purchase Order as Received? This will update inventory and allow bill creation.")) return;
        
        setActionLoading(true);
        try {
            await purchaseService.receivePurchaseOrder(id);
            await fetchPO();
        } catch (error) {
            console.error("Receiving failed", error);
            alert("Failed to update status.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
    );

    if (!po) return (
        <div className="text-center py-12 text-slate-400">Purchase Order not found.</div>
    );

    const getStatusBadge = (status) => {
        const styles = {
            draft: "bg-slate-500/20 text-slate-400 border-slate-500/50",
            sent: "bg-blue-500/20 text-blue-400 border-blue-500/50",
            confirmed: "bg-purple-500/20 text-purple-400 border-purple-500/50",
            in_transit: "bg-orange-500/20 text-orange-400 border-orange-500/50",
            received: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
            cancelled: "bg-red-500/20 text-red-400 border-red-500/50"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${styles[status] || styles.draft}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/admin/purchase/orders')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Registry</span>
                </button>
                <div className="flex flex-wrap gap-2">
                    {(po.status === 'draft' || po.status === 'sent') && (
                        <button 
                            onClick={async () => {
                                setActionLoading(true);
                                try {
                                    await purchaseService.approvePurchaseOrder(id);
                                    await fetchPO();
                                } catch (e) { alert("Failed to approve"); }
                                finally { setActionLoading(false); }
                            }}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all shadow-lg font-medium"
                        >
                            <CheckCircle size={18} />
                            <span>Confirm Order</span>
                        </button>
                    )}
                    {(po.status === 'confirmed' || po.status === 'in_transit') && (
                        <button 
                            onClick={handleReceive}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/10 font-medium"
                        >
                            {actionLoading ? <RefreshCcw size={18} className="animate-spin" /> : <Truck size={18} />}
                            <span>Mark as Received</span>
                        </button>
                    )}
                    {po.status !== 'received' && po.status !== 'cancelled' && (
                        <button 
                            onClick={async () => {
                                setActionLoading(true);
                                try {
                                    await purchaseService.cancelPurchaseOrder(id);
                                    await fetchPO();
                                } catch (e) { alert("Failed to cancel"); }
                                finally { setActionLoading(false); }
                            }}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-400 rounded-xl transition-colors border border-slate-700"
                        >
                            <AlertCircle size={18} />
                            <span>Cancel</span>
                        </button>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/50">
                        <Printer size={18} />
                        <span>Print</span>
                    </button>
                    <button 
                        onClick={async () => {
                            setActionLoading(true);
                            try {
                                await purchaseService.downloadPurchaseOrder(id);
                            } catch (e) {
                                alert("Failed to download PDF.");
                            } finally {
                                setActionLoading(false);
                            }
                        }}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 text-slate-300 rounded-xl transition-colors border border-slate-700/50"
                    >
                        <Download size={18} />
                        <span>PDF Export</span>
                    </button>
                    <button 
                        onClick={async () => {
                            setActionLoading(true);
                            try {
                                alert("Dispatching to Vendor coming soon.");
                            } catch (e) {
                                alert("Failed to dispatch PO.");
                            } finally {
                                setActionLoading(false);
                            }
                        }}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-800 text-white rounded-xl transition-all shadow-lg shadow-orange-500/20 font-medium"
                    >
                        <Mail size={18} />
                        <span>Dispatch to Vendor</span>
                    </button>
                </div>
            </div>

            {/* Document Paper */}
            <div className="bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                {/* Header Decoration */}
                <div className="h-2 w-full bg-orange-500"></div>
                
                {/* Brand & Type */}
                <div className="p-12 flex justify-between items-start border-b border-slate-100">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl">B</div>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">BITGUARD</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mb-1 uppercase tracking-tighter">
                            Purchase Order
                        </h1>
                        <div className="text-slate-400 font-mono text-lg">#{po.po_number || 'PO-0000'}</div>
                    </div>
                    <div className="text-right space-y-1">
                        <div className="text-slate-500 text-sm uppercase font-bold tracking-widest">Bill To / Ship To</div>
                        <div className="font-bold text-slate-900">BitGuard Enterprise Solutions</div>
                        <div className="text-slate-500 text-sm leading-relaxed">
                            123 Innovation Drive, Level 42<br />
                            Silicon Valley, CA 94025<br />
                            United States of America<br />
                            <span className="text-slate-400 mt-1 block">VAT: US994455221</span>
                        </div>
                    </div>
                </div>

                {/* Vendor & Metadata Grid */}
                <div className="p-12 grid grid-cols-2 lg:grid-cols-4 gap-12 bg-slate-50/50 border-b border-slate-100">
                    <div>
                        <div className="text-[10px] text-slate-400 uppercase font-black mb-3 tracking-[0.2em]">Vendor</div>
                        <div className="font-bold text-slate-900 text-lg">{po.vendor_name || 'Vendor Name'}</div>
                        <div className="text-slate-500 text-sm leading-relaxed mt-2">
                            {po.vendor_address || 'Vendor Address'}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-400 uppercase font-black mb-3 tracking-[0.2em]">Timeline</div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <CalendarIcon size={14} className="text-slate-300" />
                                <span className="text-sm text-slate-600">Issued: <span className="text-slate-900 font-bold">{po.issue_date || 'N/A'}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ClockIcon size={14} className="text-slate-300" />
                                <span className="text-sm text-slate-600">Expected: <span className="text-slate-900 font-bold">{po.expected_delivery_date || 'N/A'}</span></span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-400 uppercase font-black mb-3 tracking-[0.2em]">Document Details</div>
                        <div className="space-y-2">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-slate-400">STATUS</span>
                                {getStatusBadge(po.status || 'draft')}
                            </div>
                        </div>
                    </div>
                    <div className="text-right flex flex-col justify-between">
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase font-black mb-3 tracking-[0.2em]">PO Total</div>
                            <div className="text-3xl font-black text-slate-900">${(po.total_amount || 0).toLocaleString()}</div>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{po.reference || 'REF: NONE'}</div>
                    </div>
                </div>

                {/* Line Items Table */}
                <div className="p-12 pb-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-900 text-slate-900 text-[10px] font-black uppercase tracking-widest">
                                <th className="pb-6 w-12">#</th>
                                <th className="pb-6 pl-4">Description / Product Code</th>
                                <th className="pb-6 text-right w-24">Quantity</th>
                                <th className="pb-6 text-right w-32">Unit Price</th>
                                <th className="pb-6 text-right w-32">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {po.items && po.items.map((item, i) => (
                                <tr key={i} className="border-b border-slate-100 group">
                                    <td className="py-6 text-slate-400 font-mono text-xs">{i + 1}</td>
                                    <td className="py-6 pl-4">
                                        <div className="font-bold text-slate-900">{item.description}</div>
                                        {item.sku && <div className="text-[10px] text-slate-400 mt-1 uppercase">SKU: {item.sku}</div>}
                                    </td>
                                    <td className="py-6 text-right font-mono text-sm">{item.quantity}</td>
                                    <td className="py-6 text-right font-mono text-sm">${(Number(item.unit_price) || 0).toLocaleString()}</td>
                                    <td className="py-6 text-right font-bold text-slate-900 font-mono text-sm">${(Number(item.total) || 0).toLocaleString()}</td>
                                </tr>
                            ))}
                            {(!po.items || po.items.length === 0) && (
                                <tr>
                                    <td colSpan="5" className="py-6 text-center text-slate-400 text-sm">No items found for this PO.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Summary Totals */}
                <div className="px-12 pb-12 flex justify-between items-start gap-12 mt-8">
                    <div className="max-w-md">
                        <div className="text-[10px] text-slate-400 uppercase font-black mb-4 tracking-[0.2em]">Notes & Instructions</div>
                        <div className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            {po.notes || "Please quote this PO Number on all delivery dockets and invoices. All goods must be delivered to our primary warehouse unless otherwise specified. Payment terms: Net 30 from receipt of valid invoice."}
                        </div>
                    </div>
                    
                    <div className="w-80 bg-slate-900 text-white rounded-3xl p-8 shadow-2xl space-y-4">
                        <div className="flex justify-between items-center text-xs text-slate-400">
                            <span>Subtotal</span>
                            <span className="font-mono">${(Number(po.subtotal) || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-400">
                            <span>Tax</span>
                            <span className="font-mono">${(Number(po.tax_total) || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-end pt-2 border-t border-white/10 mt-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Total Authorization</span>
                            <span className="text-3xl font-black font-mono leading-none">${(Number(po.total_amount) || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Secure Footer */}
                <div className="bg-slate-50 p-8 flex justify-between items-center border-t border-slate-100">
                    <div className="flex items-center gap-3 text-slate-400">
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                            <CheckCircle size={16} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Authorized Procurement Document</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Generated by BitGuard ERP OS
                    </div>
                </div>
            </div>
        </div>
    );
};

const CalendarIcon = ({ size, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const ClockIcon = ({ size, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;

export default PurchaseOrderDetail;
