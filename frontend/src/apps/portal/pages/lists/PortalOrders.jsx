import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { ecommerceService } from '../../../../core/api/ecommerceService';

const statusBadge = (status) => {
    const map = { 
        'Pending': 'bg-amber-500/10 text-amber-400', 
        'Processing': 'bg-blue-500/10 text-blue-400', 
        'Completed': 'bg-emerald-500/10 text-emerald-400',
        'paid': 'bg-emerald-500/10 text-emerald-400',
        'pending_payment': 'bg-amber-500/10 text-amber-400'
    };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>{status}</span>;
};

export default function PortalOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ecommerceService.getOrders()
            .then(data => { setOrders(Array.isArray(data) ? data : (data?.results ?? [])); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-400">
            <h1 className="text-xl font-bold text-white">My Sale Orders</h1>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Order #', 'Date', 'Total', 'Status', 'Payment', ''].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan={6} className="py-16 text-center text-slate-500">Loading orders...</td></tr>
                            : orders.length === 0 ? <tr><td colSpan={6} className="py-16 text-center text-slate-500">No orders yet</td></tr>
                                : orders.map(order => (
                                    <tr key={order.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                                        <td className="px-5 py-3 text-slate-300 font-mono">#{order.order_number ?? order.id}</td>
                                        <td className="px-5 py-3 text-slate-400">{order.date_order?.split('T')[0] ?? order.created_at?.split('T')[0]}</td>
                                        <td className="px-5 py-3 text-white font-semibold">${Number(order.total_amount ?? order.total ?? 0).toFixed(2)}</td>
                                        <td className="px-5 py-3">{statusBadge(order.status)}</td>
                                        <td className="px-5 py-3">{statusBadge(order.payment)}</td>
                                        <td className="px-5 py-3 text-right">
                                            <button className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 ml-auto">
                                                <Eye size={14} /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
