import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Wrench, Activity, AlertTriangle, ChevronRight, Plus } from 'lucide-react';
import itamService from '../api/itamService';

const typeIcons = {
    laptop: '💻', desktop: '🖥️', server: '🗄️', network: '🌐',
    mobile: '📱', printer: '🖨️', software: '📦', cloud: '☁️', other: '📌',
};

const statusBadge = (status) => {
    const map = {
        active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        spare: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        maintenance: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        retired: 'bg-slate-700 text-slate-400 border-slate-600',
        lost: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>
            {status?.replace('_', ' ')}
        </span>
    );
};

const AssetDashboard = () => {
    const [stats, setStats] = useState(null);
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            itamService.getStats().catch(() => ({ total: 0, active: 0, maintenance: 0, retired: 0, by_type: {} })),
            itamService.getAssets({ page_size: 8 }).catch(() => ({ results: [] })),
        ]).then(([s, a]) => {
            setStats(s);
            setAssets(a.results ?? a ?? []);
            setLoading(false);
        });
    }, []);

    const kpis = stats ? [
        { label: 'Total Assets', value: stats.total, icon: Monitor, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Active', value: stats.active, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'In Maintenance', value: stats.maintenance, icon: Wrench, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Retired', value: stats.retired, icon: AlertTriangle, color: 'text-slate-400', bg: 'bg-slate-700/40' },
    ] : [];

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-400">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Asset Management</h1>
                    <p className="text-slate-400 text-sm mt-0.5">ITAM — Hardware, Software &amp; Cloud Resources</p>
                </div>
                <Link to="/admin/itam/assets"
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={16} /> Add Asset
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? [...Array(4)].map((_, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse h-24" />
                )) : kpis.map(kpi => (
                    <div key={kpi.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                        <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center mb-3`}>
                            <kpi.icon size={20} className={kpi.color} />
                        </div>
                        <div className="text-2xl font-bold text-white">{kpi.value ?? 0}</div>
                        <div className="text-slate-400 text-sm">{kpi.label}</div>
                    </div>
                ))}
            </div>

            {/* Asset Type Breakdown */}
            {stats?.by_type && Object.keys(stats.by_type).length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4">Assets by Type</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(stats.by_type).map(([type, count]) => (
                            <div key={type} className="bg-slate-800/60 rounded-lg p-3 flex items-center gap-3">
                                <span className="text-2xl">{typeIcons[type] ?? '📌'}</span>
                                <div>
                                    <div className="text-white font-semibold">{count}</div>
                                    <div className="text-slate-400 text-xs capitalize">{type}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Assets */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                    <h3 className="text-white font-semibold">Recent Assets</h3>
                    <Link to="/admin/itam/assets" className="text-teal-400 hover:text-teal-300 text-sm font-medium flex items-center gap-1">
                        View All <ChevronRight size={14} />
                    </Link>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Name', 'Type', 'Client', 'Status', 'Warranty'].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="py-12 text-center text-slate-500">Loading assets...</td></tr>
                        ) : assets.length === 0 ? (
                            <tr><td colSpan={5} className="py-12 text-center text-slate-500">
                                <Monitor size={32} className="mx-auto mb-2 opacity-20" />
                                No assets registered yet
                            </td></tr>
                        ) : assets.map(a => (
                            <tr key={a.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <span>{typeIcons[a.asset_type] ?? '📌'}</span>
                                        <div>
                                            <div className="text-white font-medium">{a.name}</div>
                                            <div className="text-slate-500 text-xs">{a.make} {a.model}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-slate-400 capitalize">{a.asset_type}</td>
                                <td className="px-5 py-4 text-slate-400">{a.client_name ?? 'Internal'}</td>
                                <td className="px-5 py-4">{statusBadge(a.status)}</td>
                                <td className="px-5 py-4 text-slate-400 text-xs">
                                    {a.warranty_expires ? (
                                        <span className={a.is_warranty_active ? 'text-emerald-400' : 'text-red-400'}>
                                            {a.warranty_expires} {a.is_warranty_active ? '✓' : '✗ Expired'}
                                        </span>
                                    ) : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssetDashboard;
