import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Package, ShoppingCart, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import scmService from '../../../../core/api/scmService';

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex gap-4 items-center">
        <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}><Icon size={22} /></div>
        <div>
            <p className="text-slate-400 text-xs uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
        </div>
    </div>
);

const ScmDashboard = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        scmService.getStats().then(s => { setStats(s); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const cards = [
        { label: 'Active Vendors', value: stats.active_vendors ?? stats.total_vendors ?? 0, icon: Users, color: 'orange' },
        { label: 'Inventory Items', value: stats.total_items ?? 0, icon: Package, color: 'blue' },
        { label: 'Low Stock Alerts', value: stats.low_stock_items ?? stats.low_stock_count ?? 0, icon: AlertTriangle, color: 'rose' },
        { label: 'Pending Orders', value: stats.pending_orders ?? 0, icon: ShoppingCart, color: 'amber' },
        { label: 'Inventory Value', value: stats.total_value != null ? `$${Number(stats.total_value).toLocaleString()}` : '—', icon: TrendingUp, color: 'emerald' },
        { label: 'Open POs', value: stats.open_pos ?? 0, icon: Truck, color: 'indigo' },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Supply Chain Management</h1>
                <p className="text-slate-400 text-sm mt-1">Inventory, vendors, and purchase orders</p>
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" /></div>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {cards.map(c => <StatCard key={c.label} {...c} />)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: 'Inventory', path: '/admin/scm/inventory', desc: 'Track stock levels across all products', icon: Package, color: 'blue' },
                            { title: 'Vendors', path: '/admin/scm/vendors', desc: 'Manage supplier relationships', icon: Users, color: 'orange' },
                            { title: 'Purchase Orders', path: '/admin/scm/purchase-orders', desc: 'Create and track purchase orders', icon: ShoppingCart, color: 'amber' },
                            { title: 'Low Stock Items', path: '/admin/scm/inventory?filter=low_stock', desc: `${stats.low_stock_items ?? 0} items need restocking`, icon: AlertTriangle, color: 'rose' },
                        ].map(t => (
                            <Link key={t.title} to={t.path}
                                className="flex gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-orange-500/30 transition-colors no-underline group">
                                <div className={`p-3 rounded-xl bg-${t.color}-500/10 text-${t.color}-500 group-hover:bg-${t.color}-500/20 transition-colors flex-shrink-0`}><t.icon size={22} /></div>
                                <div>
                                    <p className="text-white font-semibold">{t.title}</p>
                                    <p className="text-slate-400 text-sm mt-0.5">{t.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ScmDashboard;
