import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, ShoppingCart, CreditCard, Loader2 } from 'lucide-react';
import client from '../../../core/api/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const SalesDashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [mrrData, setMrrData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [metricsRes, mrrRes] = await Promise.all([
                    client.get('dashboard/metrics/'),
                    client.get('dashboard/mrr/')
                ]);
                
                setMetrics(metricsRes.data.data);
                if (mrrRes.data.data && mrrRes.data.data.monthly_history) {
                    setMrrData(mrrRes.data.data.monthly_history);
                }
            } catch (error) {
                console.error("Failed to load sales dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    // Safely extract metrics
    const totalRevenue = metrics?.store?.lifetime_revenue || 0;
    const activeSubs = metrics?.contracts?.active_contracts || 0;
    const totalSales = metrics?.store?.total_orders || 0;
    const openDeals = metrics?.crm?.open_deals || 0;
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-white">Sales Overview</h1>
            <p className="text-slate-400">Monitor your sales performance and revenue.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stats Cards */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-white mt-2">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                        </div>
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <DollarSign size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Active Subscriptions</p>
                            <h3 className="text-2xl font-bold text-white mt-2">{activeSubs.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Total Orders</p>
                            <h3 className="text-2xl font-bold text-white mt-2">{totalSales.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                            <ShoppingCart size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Open Deals (CRM)</p>
                            <h3 className="text-2xl font-bold text-white mt-2">{openDeals.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                            <CreditCard size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-6">Monthly Recurring Revenue (MRR) Trend</h3>
                <div className="h-80 w-full">
                    {mrrData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mrrData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                                    formatter={(value) => [`$${value.toLocaleString()}`, 'MRR']}
                                />
                                <Bar dataKey="mrr" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            <p>No revenue data available for this tenant.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesDashboard;
