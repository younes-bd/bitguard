import React, { useEffect, useState } from 'react';
import { crmService } from '../../../core/api/crmService';
import { Target, Search, Plus, TrendingUp, Clock, CheckCircle2, XCircle } from 'lucide-react';

const STATUS_MAP = {
    new: { label: 'New', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    contacted: { label: 'Contacted', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    qualified: { label: 'Qualified', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    converted: { label: 'Converted', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    lost: { label: 'Lost', color: 'bg-slate-700 text-slate-400 border-slate-600' },
};

const SOURCE_MAP = {
    website: '🌐', referral: '🤝', cold_call: '📞', event: '🎪',
    social: '📱', partner: '🏢', ad: '📢', other: '📌',
};

const LeadList = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const data = await crmService.getLeads();
                setLeads(Array.isArray(data) ? data : data.results || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    const filtered = leads.filter(l =>
        `${l.first_name} ${l.last_name} ${l.company} ${l.email}`.toLowerCase().includes(search.toLowerCase())
    );

    const countByStatus = (status) => leads.filter(l => l.status === status).length;

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Target className="text-purple-400" size={32} />
                        Lead Management
                    </h1>
                    <p className="text-slate-400">Track, qualify, and convert inbound leads.</p>
                </div>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all flex items-center gap-2">
                    <Plus size={18} /> New Lead
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                    type="text"
                    placeholder="Search leads by name, company, email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel p-5 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-blue-400" />
                        <span className="text-slate-400 text-xs uppercase font-bold">Total Leads</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{leads.length}</div>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock size={16} className="text-blue-400" />
                        <span className="text-slate-400 text-xs uppercase font-bold">New</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">{countByStatus('new')}</div>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span className="text-slate-400 text-xs uppercase font-bold">Converted</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400">{countByStatus('converted')}</div>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                        <XCircle size={16} className="text-slate-400" />
                        <span className="text-slate-400 text-xs uppercase font-bold">Lost</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-400">{countByStatus('lost')}</div>
                </div>
            </div>

            {/* Lead Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Lead', 'Company', 'Source', 'Status', 'Created'].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={5} className="py-12 text-center text-slate-500">
                                <Target size={32} className="mx-auto mb-2 opacity-20" />
                                No leads found
                            </td></tr>
                        ) : filtered.map(lead => {
                            const st = STATUS_MAP[lead.status] || STATUS_MAP.new;
                            return (
                                <tr key={lead.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer">
                                    <td className="px-5 py-4">
                                        <div>
                                            <div className="text-white font-medium">{lead.first_name} {lead.last_name}</div>
                                            <div className="text-slate-500 text-xs">{lead.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-slate-400">{lead.company || '—'}</td>
                                    <td className="px-5 py-4">
                                        <span className="flex items-center gap-1.5 text-slate-400">
                                            <span>{SOURCE_MAP[lead.source] || '📌'}</span>
                                            <span className="capitalize">{lead.source?.replace('_', ' ') || 'Unknown'}</span>
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${st.color}`}>
                                            {st.label}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-500 text-xs">
                                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '—'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeadList;
