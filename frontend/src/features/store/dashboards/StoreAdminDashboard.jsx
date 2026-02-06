import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp, Package } from 'lucide-react';

const mockSalesData = [
    { name: 'Jan', revenue: 4000, orders: 24 },
    { name: 'Feb', revenue: 3000, orders: 18 },
    { name: 'Mar', revenue: 5000, orders: 32 },
    { name: 'Apr', revenue: 2780, orders: 15 },
    { name: 'May', revenue: 1890, orders: 40 },
    { name: 'Jun', revenue: 6390, orders: 55 },
    { name: 'Jul', revenue: 8490, orders: 60 },
];

const StoreAdminDashboard = () => {
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
                <KpiCard title="Total Revenue" value="$45,231" change="+20.1%" icon={DollarSign} color="indigo" />
                <KpiCard title="Active Trials" value="340" change="+12.5%" icon={Users} color="emerald" />
                <KpiCard title="Total Orders" value="1,245" change="+4.3%" icon={ShoppingBag} color="blue" />
                <KpiCard title="Avg. Order Value" value="$82.00" change="-1.2%" icon={TrendingUp} color="amber" />
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
                            <AreaChart data={mockSalesData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
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
                            <BarChart data={mockSalesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#1e293b' }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                />
                                <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
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
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 font-mono text-indigo-400">#ORD-2024-00{i}</td>
                                    <td className="p-4 font-medium text-white">Tech Corp Inc.</td>
                                    <td className="p-4">SOC Platform (Enterprise)</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                                            Completed
                                        </span>
                                    </td>
                                    <td className="p-4 text-right text-white font-mono">$299.00</td>
                                </tr>
                            ))}
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
