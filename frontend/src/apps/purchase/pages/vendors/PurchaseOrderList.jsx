import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Search, Filter, Calendar, Building2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { erpService } from '../../../../core/api/erpService';

const PurchaseOrderList = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await erpService.getPurchaseOrders();
                setOrders(data || []);
            } catch (err) {
                console.error("Failed to load purchase orders", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'received': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'confirmed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'sent': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <ShoppingCart className="text-emerald-500" />
                        Purchase Orders
                    </h1>
                    <p className="text-sm text-slate-400">Track and manage vendor procurement and inventory intake.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/admin/purchase/orders/create')}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20"
                    >
                        <Plus size={18} />
                        <span>Create PO</span>
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-slate-800">
                            <th className="px-6 py-4">PO Number</th>
                            <th className="px-6 py-4">Vendor</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Issue Date</th>
                            <th className="px-6 py-4">Expected</th>
                            <th className="px-6 py-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {orders.length > 0 ? orders.map((order) => (
                            <tr key={order.id} className="group hover:bg-emerald-500/[0.02] transition-colors cursor-pointer" onClick={() => navigate(`/admin/purchase/orders/${order.id}`)}>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{order.po_number}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Building2 size={14} className="text-slate-500" />
                                        <span className="text-sm text-slate-300">{order.vendor_name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(order.status)}`}>
                                        {order.status === 'received' && <CheckCircle2 size={10} />}
                                        {order.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-slate-400">{order.issue_date}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-slate-400">{order.expected_delivery || 'Not set'}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-sm font-bold text-white">${parseFloat(order.total_amount).toLocaleString()}</span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="text-slate-400">No purchase orders found.</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PurchaseOrderList;
