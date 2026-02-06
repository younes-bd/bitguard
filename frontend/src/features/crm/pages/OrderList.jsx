import React, { useEffect, useState } from 'react';
import { crmService } from '../../../shared/core/services/crmService';
import { ShoppingCart, Search, Filter, DollarSign, User, Calendar, CheckCircle, Clock } from 'lucide-react';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await crmService.getOrders();
            setOrders(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'processing': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <ShoppingCart className="text-emerald-400" size={32} />
                        Sales Orders
                    </h1>
                    <p className="text-slate-400">View and manage all client orders.</p>
                </div>
            </div>

            <div className="glass-panel rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-800/80 text-slate-400 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="p-4 border-b border-slate-700">Order ID</th>
                                <th className="p-4 border-b border-slate-700">Client</th>
                                <th className="p-4 border-b border-slate-700">Date</th>
                                <th className="p-4 border-b border-slate-700">Total</th>
                                <th className="p-4 border-b border-slate-700">Status</th>
                                <th className="p-4 border-b border-slate-700">Items</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50 text-slate-300">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="p-4 font-mono text-blue-400">#{order.id}</td>
                                    <td className="p-4 font-medium text-white flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                                            <User size={12} />
                                        </div>
                                        {order.user_name || order.user || 'Unknown User'}
                                    </td>
                                    <td className="p-4 text-sm text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-emerald-400 font-mono">
                                        ${parseFloat(order.total_amount || order.amount || 0).toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-400">
                                        {/* Assuming items or description is available, otherwise generic */}
                                        {order.items_count || 1} items
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-slate-500">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderList;


