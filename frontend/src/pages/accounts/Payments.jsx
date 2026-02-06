import React, { useState, useEffect } from 'react';
import { CreditCard, Package, AlertCircle, ShoppingBag, Download, ExternalLink, Calendar } from 'lucide-react';
import client from '../../shared/core/services/client';

const Payments = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Subscriptions (Platform)
                // We use the store API which exposes SubscriptionViewSet
                const subsRes = await client.get('store/subscriptions/');
                setSubscriptions(subsRes.data);

                // Fetch Orders (Store History)
                const ordersRes = await client.get('store/orders/');
                setOrders(ordersRes.data);

            } catch (err) {
                console.error("Failed to fetch payments info:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading payments info...</div>;

    const hasActiveSubscription = subscriptions.some(sub => sub.status === 'active' || sub.status === 'past_due');

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 p-6">
            <h1 className="text-3xl font-bold text-white text-center md:text-left font-[Oswald] tracking-wide">Payments & Subscriptions</h1>
            <p className="text-slate-400 text-center md:text-left">Manage your payment methods, subscriptions, and billing history.</p>

            {/* Platform Subscriptions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Package size={20} className="text-blue-500" /> Platform Subscriptions
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">SaaS Platform access plans.</p>
                    </div>
                    {/* Link to Pricing/Plans page if not subscribed */}
                    {!hasActiveSubscription && (
                        <a href="/pricing" className="text-xs font-bold text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-full hover:bg-blue-500/10">Browse Plans</a>
                    )}
                </div>
                <div className="divide-y divide-slate-800">
                    {subscriptions.length > 0 ? subscriptions.map(sub => (
                        <div key={sub.id} className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-white text-lg">{sub.plan_name || 'Premium Plan'}</h3> {/* Serializer needs plan name */}
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                                            sub.status === 'past_due' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
                                        }`}>
                                        {sub.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-500 mt-1 flex items-center gap-4">
                                    <span className="flex items-center gap-1"><Calendar size={14} /> Expires: {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : 'Never'}</span>
                                    {sub.stripe_subscription_id && <span className="text-xs font-mono bg-slate-950 px-2 py-0.5 rounded">ID: {sub.stripe_subscription_id.slice(-8)}...</span>}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {sub.status === 'active' && (
                                    <button className="text-slate-300 hover:text-white text-sm font-medium px-4 py-2 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
                                        Cancel
                                    </button>
                                )}
                                <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                                    Manage
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 flex flex-col items-center gap-4 text-slate-500 italic">
                            <div className="w-16 h-16 rounded-full bg-slate-950 flex items-center justify-center">
                                <AlertCircle size={32} className="opacity-50" />
                            </div>
                            <div>No active platform subscriptions found.</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Store Order History */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <ShoppingBag size={20} className="text-purple-500" /> Order History
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">Purchases from the Store and Client Portal.</p>
                </div>

                {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950 text-slate-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-slate-400 text-sm">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4 text-slate-300 text-sm">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-white font-medium">
                                            ${order.amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${order.status === 'completed' || order.status === 'paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                    order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-slate-700 text-slate-400'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a href={`/store/orders/${order.id}`} className="text-blue-400 text-sm font-medium hover:underline flex items-center gap-1">
                                                View <ExternalLink size={12} />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-slate-500">
                        No recent orders found.
                    </div>
                )}
            </div>

            {/* Payment Methods (Placeholder for Future Stripe Integration) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <CreditCard size={20} className="text-emerald-500" /> Payment Methods
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">Cards and billing information.</p>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl mb-4">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-16 bg-slate-800 rounded flex items-center justify-center text-xs font-bold text-slate-500">VISA</div>
                            <div>
                                <div className="text-white font-medium">Visa ending in 4242</div>
                                <div className="text-xs text-slate-500">Expires 12/28 • Default</div>
                            </div>
                        </div>
                        <button className="text-slate-400 hover:text-white">Remove</button>
                    </div>

                    <button className="w-full py-3 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 font-medium hover:border-blue-500 hover:text-blue-400 transition-colors flex items-center justify-center gap-2">
                        <CreditCard size={18} /> Add New Payment Method
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Payments;
