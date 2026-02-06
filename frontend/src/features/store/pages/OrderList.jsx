import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, CreditCard, Download, Search, Filter, Eye } from 'lucide-react';
import { storeService } from '../../../shared/core/services/storeService';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await storeService.getOrders();
                const fetchedOrders = Array.isArray(response) ? response : response.results || [];

                // Map API data to UI structure
                const formattedOrders = fetchedOrders.map(order => ({
                    id: `ORD-${order.id}`,
                    product: order.product_name || `Unknown Product (ID: ${order.product || '?'})`,
                    date: new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }),
                    amount: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.amount),
                    status: order.status,
                    type: order.product_type || 'service', // Assuming backend might send product_type
                    rawDate: new Date(order.created_at) // For sorting if needed
                }));

                setOrders(formattedOrders);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Filter Logic
    const filteredOrders = orders.filter(order =>
        order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mr-3"></div>
            Loading your order history...
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-2">My Orders & Assets</h1>

            <div className="glass-panel rounded-xl border border-slate-700/50 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-700/50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search orders, products, or subscriptions..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-900/50 uppercase font-medium border-b border-slate-700/50">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Product/Service</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{order.id}</td>
                                        <td className="px-6 py-4 font-medium text-slate-300">{order.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-200 font-medium">{order.product}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {order.type === 'digital' || order.type === 'software' ? <Download size={14} className="text-indigo-400" /> :
                                                    order.type === 'physical' || order.type === 'hardware' ? <Package size={14} className="text-blue-400" /> : <CreditCard size={14} className="text-purple-400" />}
                                                <span className="capitalize">{order.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-white">{order.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${order.status === 'completed' || order.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    order.status === 'processing' || order.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                        'bg-slate-700 text-slate-400'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-lg transition-colors">
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                                        No orders found matching your search.
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
