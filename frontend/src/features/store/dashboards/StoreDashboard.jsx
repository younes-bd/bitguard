import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, CreditCard, Clock, ChevronRight, Download, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storeService } from '../../../shared/core/services/storeService';

const StoreDashboard = () => {
    const navigate = useNavigate();

    // Real Data State
    const [stats, setStats] = useState({
        activeLicenses: 0,
        pendingOrders: 0,
        monthlySpend: '$0.00',
        hardwareDevices: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Parallel fetch of real data
            const [ordersRes, licensesRes] = await Promise.all([
                storeService.getOrders(),
                storeService.getLicenses(),
            ]);

            const orders = Array.isArray(ordersRes) ? ordersRes : ordersRes.results || [];
            const licenses = Array.isArray(licensesRes) ? licensesRes : licensesRes.results || [];

            // Calculate Stats from Real Data
            const activeLicensesCount = licenses.length;
            const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

            // Calculate Monthly Spend (Simplified logic: sum of orders in last 30 days)
            const now = new Date();
            const lastMonth = new Date(now.setDate(now.getDate() - 30));
            const monthlySpendRaw = orders
                .filter(o => new Date(o.created_at) > lastMonth)
                .reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);

            // Format currency
            const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

            setStats({
                activeLicenses: activeLicensesCount,
                pendingOrders: pendingOrdersCount,
                monthlySpend: formatter.format(monthlySpendRaw),
                hardwareDevices: 0 // Placeholder until Asset API is ready
            });

            // Map Recent Orders
            const mappedOrders = orders.slice(0, 5).map(order => ({
                id: `ORD-${order.id}`,
                product: order.product_name || `Order #${order.id}`, // Backend might need to send product name or we fetch it
                date: new Date(order.created_at).toLocaleDateString(),
                amount: formatter.format(order.amount),
                status: order.status,
                type: 'standard'
            }));

            setRecentOrders(mappedOrders);

        } catch (error) {
            console.error("Failed to load store dashboard", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Store Overview</h1>
                    <p className="text-slate-400">Manage your procurement, subscriptions, and hardware assets.</p>
                </div>
                <button
                    onClick={() => navigate('/app/store/products')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                >
                    <ShoppingBag size={18} />
                    Browse Catalog
                </button>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-gradient-to-br from-indigo-900/10 to-slate-900/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
                            <ShieldCheck size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.activeLicenses}</div>
                    <div className="text-sm text-slate-400 font-medium uppercase">Active Licenses</div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-gradient-to-br from-amber-900/10 to-slate-900/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-500/20 rounded-lg text-amber-400">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.pendingOrders}</div>
                    <div className="text-sm text-slate-400 font-medium uppercase">Pending Orders</div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-gradient-to-br from-emerald-900/10 to-slate-900/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400">
                            <CreditCard size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.monthlySpend}</div>
                    <div className="text-sm text-slate-400 font-medium uppercase">Monthly Spend</div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-gradient-to-br from-blue-900/10 to-slate-900/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                            <Package size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.hardwareDevices}</div>
                    <div className="text-sm text-slate-400 font-medium uppercase">Hardware Assets</div>
                </div>
            </div>

            {/* Split View: Recent Orders & Quick Procurement */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 glass-panel rounded-xl border border-slate-700/50 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Recent Procurement</h2>
                        <button onClick={() => navigate('/app/store/orders')} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-900/50 uppercase font-medium border-b border-slate-700/50">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Product/Service</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${order.type === 'software' ? 'bg-indigo-500/10 text-indigo-400' :
                                                        order.type === 'hardware' ? 'bg-blue-500/10 text-blue-400' :
                                                            'bg-purple-500/10 text-purple-400'
                                                    }`}>
                                                    {order.type === 'software' ? <Download size={14} /> :
                                                        order.type === 'hardware' ? <Package size={14} /> : <CreditCard size={14} />}
                                                </div>
                                                <span className="text-slate-200 font-medium">{order.product}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-300">{order.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${order.status === 'completed' || order.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    order.status === 'processing' ? 'bg-amber-500/10 text-amber-400' :
                                                        'bg-slate-700 text-slate-400'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                            No active orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recommended (Upsell) - Keeping Mock for Visuals */}
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-gradient-to-b from-slate-800/40 to-slate-900/40">
                    <h2 className="text-xl font-bold text-white mb-6">Recommended for You</h2>
                    <div className="space-y-4">
                        <div className="group p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-indigo-500/50 transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                    <ShieldCheck size={20} />
                                </div>
                                <span className="text-xs font-bold text-emerald-400">New</span>
                            </div>
                            <h3 className="font-bold text-white mb-1">Advanced Threat Protection</h3>
                            <p className="text-xs text-slate-500 mb-3">Upgrade your endpoint security with AI-driven analysis.</p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white font-bold">$29/mo</span>
                                <ChevronRight size={16} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                            </div>
                        </div>

                        <div className="group p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-indigo-500/50 transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <Package size={20} />
                                </div>
                                <span className="text-xs font-bold text-slate-500">Restock</span>
                            </div>
                            <h3 className="font-bold text-white mb-1">Cisco Meraki Switch</h3>
                            <p className="text-xs text-slate-500 mb-3">Enterprise-grade cloud managed network switch.</p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white font-bold">$1,299</span>
                                <ChevronRight size={16} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-6 py-3 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium">
                        View All Offers
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoreDashboard;
