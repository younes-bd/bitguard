import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CreditCard, ChevronLeft, Calendar, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch order by id
        setTimeout(() => {
            setOrder({
                id: id || 'ORD-2026-904',
                created_at: '2026-06-04T10:30:00Z',
                status: 'processing',
                payment_status: 'paid',
                total_amount: 1245.00,
                tax_amount: 95.00,
                items: [
                    { id: 1, name: 'Enterprise Firewall Appliance', sku: 'FW-ENT-1000', quantity: 1, price: 950.00 },
                    { id: 2, name: 'Advanced Threat Protection License (1Yr)', sku: 'LIC-ATP-1Y', quantity: 1, price: 200.00 }
                ],
                timeline: [
                    { id: 1, event: 'Order placed', date: '2026-06-04T10:30:00Z', completed: true },
                    { id: 2, event: 'Payment confirmed', date: '2026-06-04T10:32:00Z', completed: true },
                    { id: 3, event: 'Processing hardware', date: '2026-06-04T11:00:00Z', completed: true },
                    { id: 4, event: 'Shipped', date: null, completed: false },
                    { id: 5, event: 'Delivered', date: null, completed: false }
                ],
                shipping: {
                    carrier: 'FedEx',
                    tracking_number: 'PENDING',
                    address: '123 Enterprise Way, Suite 400, Tech City, TC 90210'
                }
            });
            setLoading(false);
        }, 800);
    }, [id]);

    if (loading) return <div className="p-8 text-gray-500">Loading Order Details...</div>;
    if (!order) return <div className="p-8 text-red-500">Order not found.</div>;

    const getStatusColor = (status) => {
        switch(status) {
            case 'paid': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30';
            case 'processing': return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30';
            case 'shipped': return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30';
            case 'delivered': return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30';
            default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800';
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/store/orders" className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        Order #{order.id}
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> {new Date(order.created_at).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2 bg-gray-50 dark:bg-slate-800/50">
                            <Package className="w-5 h-5 text-gray-400" />
                            <h2 className="font-semibold text-gray-900 dark:text-white">Line Items</h2>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-slate-700">
                            {order.items.map(item => (
                                <div key={item.id} className="p-4 flex gap-4">
                                    <div className="w-12 h-12 rounded bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-400">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                                        <p className="text-sm text-gray-500 font-mono mt-0.5">SKU: {item.sku}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900 dark:text-white">${item.price.toFixed(2)}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600 dark:text-slate-400">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900 dark:text-white">${(order.total_amount - order.tax_amount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-slate-400">
                                <span>Tax</span>
                                <span className="font-medium text-gray-900 dark:text-white">${order.tax_amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-slate-700 text-base">
                                <span className="font-bold text-gray-900 dark:text-white">Total</span>
                                <span className="font-bold text-blue-600 dark:text-blue-400">${order.total_amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden p-6">
                        <h2 className="font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" /> Order Timeline
                        </h2>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-slate-700 before:to-transparent">
                            {order.timeline.map((event, idx) => (
                                <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${event.completed ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-400'}`}>
                                        {event.completed ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-white dark:bg-slate-800" />}
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className={`font-bold ${event.completed ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-500'}`}>{event.event}</div>
                                        </div>
                                        {event.date && <div className="text-sm text-gray-500 dark:text-slate-400">{new Date(event.date).toLocaleString()}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Payment Info */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2 bg-gray-50 dark:bg-slate-800/50">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                            <h2 className="font-semibold text-gray-900 dark:text-white">Payment</h2>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 ${getStatusColor(order.payment_status)}`}>
                                    {order.payment_status}
                                </span>
                                <p className="text-sm text-gray-600 dark:text-slate-300">Paid via Stripe (Card ending in 4242)</p>
                            </div>
                            <button 
                                onClick={async () => {
                                    try {
                                        const { default: reportingService } = await import('../../../../core/api/reportingService');
                                        // The order id could be numeric or a string depending on how it was fetched. 
                                        const res = await reportingService.generateReport(null, 'store.Order', order.id);
                                        if (res && res.file) {
                                            window.open(res.file, '_blank');
                                        }
                                    } catch (err) {
                                        console.error("Download failed:", err);
                                        alert("Failed to download PDF.");
                                    }
                                }}
                                className="w-full py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <FileText className="w-4 h-4" /> Download Order PDF
                            </button>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2 bg-gray-50 dark:bg-slate-800/50">
                            <Truck className="w-5 h-5 text-gray-400" />
                            <h2 className="font-semibold text-gray-900 dark:text-white">Shipping</h2>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Carrier: {order.shipping.carrier}</p>
                                <p className="text-sm text-gray-600 dark:text-slate-400 font-mono">Tracking: {order.shipping.tracking_number}</p>
                            </div>
                            <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Shipping Address</h3>
                                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed max-w-[200px]">
                                    {order.shipping.address}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
