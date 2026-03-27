import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Globe, Phone, Users, ChevronRight } from 'lucide-react';
import client from '../../../../core/api/client';

const statusBadge = (status) => {
    const map = { active: 'bg-emerald-500/10 text-emerald-400', suspended: 'bg-red-500/10 text-red-400', trial: 'bg-blue-500/10 text-blue-400' };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>{status}</span>;
};

const TenantList = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        client.get('tenants/')
            .then(r => { 
                const data = r.data?.results ?? r.data;
                setTenants(Array.isArray(data) ? data : []); 
                setLoading(false); 
            })
            .catch(() => {
                setTenants([]);
                setLoading(false);
            });
    }, []);

    const filtered = tenants.filter(t =>
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.slug?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Tenants</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{tenants.length} registered tenants</p>
                </div>
                <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={16} /> New Tenant
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search tenants..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Tenant', 'Slug', 'Users', 'Status', 'Created', ''].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="py-16 text-center text-slate-500">Loading tenants...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={6} className="py-16 text-center text-slate-500">
                                <Building2 size={36} className="mx-auto mb-2 opacity-20" />
                                No tenants found
                            </td></tr>
                        ) : filtered.map(t => (
                            <tr key={t.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                            <Building2 size={14} className="text-violet-400" />
                                        </div>
                                        <span className="text-white font-medium">{t.name}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-slate-400 font-mono text-xs">{t.slug ?? '—'}</td>
                                <td className="px-5 py-4 text-slate-400">{t.user_count ?? '—'}</td>
                                <td className="px-5 py-4">{statusBadge(t.status ?? 'active')}</td>
                                <td className="px-5 py-4 text-slate-400">{t.created_at?.split('T')[0] ?? '—'}</td>
                                <td className="px-5 py-4">
                                    <button className="text-violet-400 hover:text-violet-300 transition-colors">
                                        <ChevronRight size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TenantList;
