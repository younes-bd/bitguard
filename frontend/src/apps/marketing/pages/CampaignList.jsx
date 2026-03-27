import React, { useState } from 'react';
import { Megaphone, Search, Plus, Calendar, Users, TrendingUp, Pause, Play } from 'lucide-react';

const MOCK_CAMPAIGNS = [
    { id: 1, name: 'Q1 Product Launch', status: 'active', type: 'email', reach: 12500, conversions: 340, start_date: '2026-01-15', end_date: '2026-03-31' },
    { id: 2, name: 'MSP Partner Webinar', status: 'active', type: 'event', reach: 850, conversions: 62, start_date: '2026-03-01', end_date: '2026-03-15' },
    { id: 3, name: 'Black Friday SaaS Sale', status: 'completed', type: 'ad', reach: 45000, conversions: 1200, start_date: '2025-11-20', end_date: '2025-11-30' },
    { id: 4, name: 'Security Awareness Week', status: 'draft', type: 'content', reach: 0, conversions: 0, start_date: '2026-04-01', end_date: '2026-04-07' },
];

const STATUS_BADGE = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    draft: 'bg-slate-700 text-slate-400 border-slate-600',
    paused: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const CampaignList = () => {
    const [search, setSearch] = useState('');
    const filtered = MOCK_CAMPAIGNS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Campaigns</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Create, manage, and track marketing campaigns</p>
                </div>
                <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                    <Plus size={16} /> New Campaign
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Active Campaigns', value: MOCK_CAMPAIGNS.filter(c => c.status === 'active').length, icon: Play, color: 'text-emerald-400' },
                    { label: 'Total Reach', value: MOCK_CAMPAIGNS.reduce((s, c) => s + c.reach, 0).toLocaleString(), icon: Users, color: 'text-blue-400' },
                    { label: 'Conversions', value: MOCK_CAMPAIGNS.reduce((s, c) => s + c.conversions, 0).toLocaleString(), icon: TrendingUp, color: 'text-purple-400' },
                    { label: 'Drafts', value: MOCK_CAMPAIGNS.filter(c => c.status === 'draft').length, icon: Pause, color: 'text-slate-400' },
                ].map(kpi => (
                    <div key={kpi.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                        <kpi.icon size={20} className={`${kpi.color} mb-2`} />
                        <div className="text-2xl font-bold text-white">{kpi.value}</div>
                        <div className="text-slate-400 text-xs uppercase font-bold mt-1">{kpi.label}</div>
                    </div>
                ))}
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="text" placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50" />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Campaign', 'Type', 'Status', 'Reach', 'Conversions', 'Dates'].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(c => (
                            <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer">
                                <td className="px-5 py-4 text-white font-medium">{c.name}</td>
                                <td className="px-5 py-4"><span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs uppercase font-mono">{c.type}</span></td>
                                <td className="px-5 py-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${STATUS_BADGE[c.status]}`}>{c.status}</span></td>
                                <td className="px-5 py-4 text-slate-400">{c.reach.toLocaleString()}</td>
                                <td className="px-5 py-4 text-emerald-400 font-semibold">{c.conversions.toLocaleString()}</td>
                                <td className="px-5 py-4 text-slate-500 text-xs"><Calendar size={12} className="inline mr-1" />{c.start_date} → {c.end_date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CampaignList;
