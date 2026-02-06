import React, { useState, useEffect } from 'react';
import { storeService } from '../../../shared/core/services/storeService';
import { Search, Filter, Eye, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

const StoreOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await storeService.getOrders();
            setOrders(data);
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;
        try {
            await storeService.deleteOrder(orderId);
            loadOrders();
        } catch (error) {
            console.error("Failed to delete order", error);
            alert("Failed to delete order");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-slate-800 text-slate-400 border-slate-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Orders</h1>
                    <p className="text-slate-400">Track and manage customer purchases.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg transition-all">
                    <Filter size={18} />
                    <span>Filter View</span>
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-xs">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Payment</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 font-mono text-indigo-400">#{order.id}</td>
                                    <td className="p-4 font-medium text-white">{order.customer}</td>
                                    <td className="p-4 text-slate-400">{order.date}</td>
                                    <td className="p-4 font-bold text-slate-200">${order.amount.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {order.payment === 'Paid' ? (
                                            <div className="flex items-center gap-1 text-emerald-400 text-xs">
                                                <CheckCircle size={14} /> Paid
                                            </div>
                                        ) : order.payment === 'Failed' ? (
                                            <div className="flex items-center gap-1 text-red-400 text-xs">
                                                <XCircle size={14} /> Failed
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-amber-400 text-xs">
                                                <Clock size={14} /> Pending
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors">
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOrder(order.id)}
                                                className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StoreOrders;
