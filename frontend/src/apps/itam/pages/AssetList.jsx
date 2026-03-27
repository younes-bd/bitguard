import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Monitor, ChevronRight } from 'lucide-react';
import itamService from '../api/itamService';

const TYPE_OPTIONS = ['', 'laptop', 'desktop', 'server', 'network', 'mobile', 'printer', 'software', 'cloud', 'other'];
const STATUS_OPTIONS = ['', 'active', 'spare', 'maintenance', 'retired', 'lost'];

const typeIcons = {
    laptop: '💻', desktop: '🖥️', server: '🗄️', network: '🌐',
    mobile: '📱', printer: '🖨️', software: '📦', cloud: '☁️', other: '📌',
};

const statusBadge = (status) => {
    const map = {
        active: 'bg-emerald-500/10 text-emerald-400', spare: 'bg-blue-500/10 text-blue-400',
        maintenance: 'bg-amber-500/10 text-amber-400', retired: 'bg-slate-700 text-slate-400', lost: 'bg-red-500/10 text-red-400',
    };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>{status?.replace('_', ' ')}</span>;
};

const AssetList = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        itamService.getAssets({ type: typeFilter || undefined, status: statusFilter || undefined })
            .then(r => { setAssets(r.results ?? r ?? []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [typeFilter, statusFilter]);

    const filtered = assets.filter(a =>
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.asset_tag?.toLowerCase().includes(search.toLowerCase()) ||
        a.client_name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">All Assets</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{assets.length} assets registered</p>
                </div>
                <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={16} /> Add Asset
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search by name, tag, client..." value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-sm" />
                </div>
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40">
                    <option value="">All Types</option>
                    {TYPE_OPTIONS.filter(Boolean).map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40">
                    <option value="">All Status</option>
                    {STATUS_OPTIONS.filter(Boolean).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Asset', 'Tag', 'Type', 'Client', 'Status', 'Warranty', 'Purchase Date', ''].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={8} className="py-12 text-center text-slate-500">Loading assets...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={8} className="py-12 text-center text-slate-500">
                                <Monitor size={32} className="mx-auto mb-2 opacity-20" />
                                No assets found
                            </td></tr>
                        ) : filtered.map(a => (
                            <tr key={a.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{typeIcons[a.asset_type] ?? '📌'}</span>
                                        <div>
                                            <div className="text-white font-medium">{a.name}</div>
                                            <div className="text-slate-500 text-xs">{[a.make, a.model].filter(Boolean).join(' ') || '—'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-slate-400 font-mono text-xs">{a.asset_tag ?? '—'}</td>
                                <td className="px-5 py-4 text-slate-400 capitalize">{a.asset_type}</td>
                                <td className="px-5 py-4 text-slate-400">{a.client_name ?? 'Internal'}</td>
                                <td className="px-5 py-4">{statusBadge(a.status)}</td>
                                <td className="px-5 py-4 text-xs">
                                    {a.warranty_expires ? (
                                        <span className={a.is_warranty_active ? 'text-emerald-400' : 'text-red-400'}>
                                            {a.warranty_expires}
                                        </span>
                                    ) : <span className="text-slate-500">—</span>}
                                </td>
                                <td className="px-5 py-4 text-slate-400 text-xs">{a.purchase_date ?? '—'}</td>
                                <td className="px-5 py-4">
                                    <ChevronRight size={16} className="text-slate-600 hover:text-teal-400 cursor-pointer transition-colors" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssetList;
