import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { purchaseService } from '../../../../purchase/api/purchaseService';
import toast from 'react-hot-toast';

const PortalPurchases = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await purchaseService.getPurchaseOrders();
                const items = data?.data || data?.results || data || [];
                setOrders(Array.isArray(items) ? items : []);
            } catch (error) {
                toast.error('Failed to load purchase orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500">
                    <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold dark:text-white text-slate-900">Purchase Orders</h1>
                    <p className="dark:text-slate-400 text-slate-500">Review your past and active purchase orders.</p>
                </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <th className="p-4 font-semibold">Order ID</th>
                            <th className="p-4 font-semibold">Order Date</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-slate-500">
                                    <div className="w-6 h-6 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mx-auto mb-2"></div>
                                    Loading purchase orders...
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-slate-500">
                                    <ShoppingCart size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                                    No purchase orders found.
                                </td>
                            </tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{order.name || order.reference || order.id}</td>
                                    <td className="p-4 text-slate-500 text-sm">{order.date_order || order.created_at?.split('T')[0] || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            order.status === 'done' || order.status === 'purchase' ? 'bg-emerald-100 text-emerald-700' : 
                                            order.status === 'cancel' ? 'bg-red-100 text-red-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                            {order.status || 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm font-mono">${parseFloat(order.amount_total || order.total || 0).toFixed(2)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PortalPurchases;

