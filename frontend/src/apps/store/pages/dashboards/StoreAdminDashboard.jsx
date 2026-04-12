import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp, Package, Loader2 } from 'lucide-react';
import client from '../../../../core/api/client';
import { storeService } from '../../../../core/api/storeService';

const StoreAdminDashboard = () => {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [metricsRes, chartRes, ordersRes] = await Promise.all([
                    client.get('dashboard/metrics/'),
                    client.get('dashboard/mrr/'),
                    storeService.getOrders()
                ]);
                
                setMetrics(metricsRes.data.data);
                if (chartRes.data.data?.monthly_history) {
                    setChartData(chartRes.data.data.monthly_history);
                }
                
                const ordersRaw = ordersRes?.data?.data || ordersRes?.data || ordersRes;
                const ordersData = Array.isArray(ordersRaw) ? ordersRaw : ordersRaw?.results || [];
                setRecentOrders(ordersData.slice(0, 5));
            } catch (error) {
                console.error("Failed to load store dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    const storeMetrics = metrics?.store || {};
    const totalRev = storeMetrics.lifetime_revenue || 0;
    const totalOrders = storeMetrics.total_orders || 0;
    const aov = totalOrders > 0 ? (totalRev / totalOrders) : 0;
    const pendingOrders = storeMetrics.pending_orders || 0;
    return (
        <div className="space-y-8 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Store Command Center</h1>
                    <p className="text-slate-400">Overview of sales, inventory, and subscription metrics.</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all">
                    Generate Report
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Revenue" value={`$${totalRev.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} change="Live" icon={DollarSign} color="indigo" />
                <KpiCard title="Pending Orders" value={pendingOrders} change="Active" icon={Package} color="emerald" />
                <KpiCard title="Total Orders" value={totalOrders.toLocaleString()} change="All Time" icon={ShoppingBag} color="blue" />
                <KpiCard title="Avg. Order Value" value={`$${aov.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} change="Estimated" icon={TrendingUp} color="amber" />
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Revenue Trend */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <DollarSign size={20} className="text-indigo-400" /> Revenue Trend
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Overview */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <ShoppingBag size={20} className="text-emerald-400" /> Monthly Orders
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#1e293b' }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                />
                                <Bar dataKey="mrr" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800">
                    <h3 className="text-xl font-bold text-white">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950 text-slate-200 uppercase font-bold">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Product</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {(recentOrders || []).length > 0 ? (recentOrders || []).map((order) => (
                                <tr key={order.id} className="hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => navigate('/admin/store/orders')}>
                                    <td className="p-4 font-mono text-indigo-400">#{order.order_number || `ORD-${order.id}`}</td>
                                    <td className="p-4 font-medium text-white">{order.customer_name || 'Anonymous User'}</td>
                                    <td className="p-4 text-slate-300">{order.items?.length || 0} items</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded border text-xs font-bold uppercase
                                            ${order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                              order.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                                              'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                            {order.status || 'unknown'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right text-white font-mono">${parseFloat(order.total_amount || 0).toFixed(2)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        No recent orders found.
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

const KpiCard = ({ title, value, change, icon: Icon, color }) => {
    const isPositive = change.startsWith('+');
    const colors = {
        indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${colors[color] || colors.indigo}`}>
                    <Icon size={24} />
                </div>
                <span className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {change}
                </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
        </div>
    );
};

export default StoreAdminDashboard;
