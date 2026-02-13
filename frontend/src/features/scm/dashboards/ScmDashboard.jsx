import React, { useEffect, useState } from 'react';
import { Layers, Truck, Archive, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import scmService from '../services/scmService';

const ScmDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await scmService.getInventorySummary();
                const data = response.data;
                setStats([
                    { label: 'Active Vendors', value: data.active_vendors, icon: Truck, color: 'orange' },
                    { label: 'Low Stock Items', value: data.low_stock_count, icon: Archive, color: 'red' },
                    { label: 'Pending POs', value: data.pending_orders, icon: FileText, color: 'blue' },
                    { label: 'Total Inventory', value: `$${(data.total_value / 1000000).toFixed(1)}M`, icon: Layers, color: 'emerald' },
                ]);
            } catch (error) {
                console.error("Failed to load SCM stats", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="p-8 text-slate-400">Loading Supply Chain Metrics...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight font-['Oswald']">Supply Chain Overview</h1>
                <p className="text-slate-400 mt-2">Monitor inventory, procurement, and vendor performance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:bg-${stat.color}-500/20 transition-colors`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`text-${stat.color}-400 text-xs font-bold uppercase tracking-wider`}>Live</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-64 flex items-center justify-center text-slate-500 border-dashed">
                    Inventory Chart Placeholder
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-64 flex items-center justify-center text-slate-500 border-dashed">
                    Procurement Activity Placeholder
                </div>
            </div>
        </div>
    );
};

export default ScmDashboard;
