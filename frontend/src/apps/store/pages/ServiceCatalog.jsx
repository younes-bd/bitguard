import React, { useState, useEffect } from 'react';
import { Plus, Tag, DollarSign, Clock, CheckCircle, ChevronRight, Search } from 'lucide-react';
import client from '../../../core/api/client';

const categoryColors = {
    'Managed IT': 'bg-blue-500/10 text-blue-400', 'Cybersecurity': 'bg-red-500/10 text-red-400',
    'Cloud': 'bg-violet-500/10 text-violet-400', 'Consulting': 'bg-amber-500/10 text-amber-400',
    'Hardware': 'bg-slate-700 text-slate-300', 'Software': 'bg-emerald-500/10 text-emerald-400',
};

const MOCK_SERVICES = [
    { id: 1, name: 'Managed Security (MDR)', category: 'Cybersecurity', billing: 'Monthly', price: 1200, unit: 'endpoint', description: 'Full 24/7 managed detection and response — alerts, investigation, and containment.', active: true },
    { id: 2, name: 'Microsoft 365 Management', category: 'Managed IT', billing: 'Monthly', price: 15, unit: 'user/mo', description: 'M365 tenant administration, user lifecycle, license optimization.', active: true },
    { id: 3, name: 'Cloud Infrastructure Setup', category: 'Cloud', billing: 'One-off', price: 4500, unit: 'project', description: 'Azure / AWS infrastructure design, migration, and deployment.', active: true },
    { id: 4, name: 'vCISO Advisory (Fractional)', category: 'Consulting', billing: 'Monthly', price: 3800, unit: 'retainer', description: '10 hours/month security leadership, compliance roadmap, board reporting.', active: true },
    { id: 5, name: 'IT Hardware Procurement', category: 'Hardware', billing: 'One-off', price: 0, unit: 'custom quote', description: 'Laptop, server, and networking device procurement with warranty management.', active: true },
    { id: 6, name: 'Vulnerability Assessment', category: 'Cybersecurity', billing: 'One-off', price: 2500, unit: 'assessment', description: 'Internal/external vulnerability scan with executive report.', active: true },
    { id: 7, name: 'Helpdesk Support (Tier 1-3)', category: 'Managed IT', billing: 'Monthly', price: 85, unit: 'user/mo', description: 'Unlimited tier 1-3 end-user IT support with SLA guarantee.', active: true },
    { id: 8, name: 'Backup & Disaster Recovery', category: 'Cloud', billing: 'Monthly', price: 450, unit: 'server/mo', description: 'Automated daily backup, offsite replication, tested recovery runbooks.', active: true },
];

const ServiceCatalog = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        client.get('store/service-catalog/')
            .then(r => { setServices(r.data?.results ?? r.data ?? []); setLoading(false); })
            .catch(() => { setServices(MOCK_SERVICES); setLoading(false); });
    }, []);

    const categories = [...new Set(services.map(s => s.category))];
    const filtered = services.filter(s =>
        (s.name?.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase())) &&
        (!categoryFilter || s.category === categoryFilter)
    );

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Service Catalog</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{services.length} services — formally defined and priced</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={16} /> Add Service
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm" />
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setCategoryFilter('')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${!categoryFilter ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-blue-500/40'}`}>
                        All
                    </button>
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setCategoryFilter(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${categoryFilter === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-blue-500/40'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Service Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading ? (
                    [...Array(6)].map((_, i) => <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-40 animate-pulse" />)
                ) : filtered.length === 0 ? (
                    <div className="col-span-3 py-16 text-center text-slate-500">No services found</div>
                ) : filtered.map(s => (
                    <div key={s.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-colors group cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${categoryColors[s.category] ?? 'bg-slate-700 text-slate-300'}`}>
                                {s.category}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock size={10} /> {s.billing}
                            </span>
                        </div>
                        <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-blue-400 transition-colors">{s.name}</h3>
                        <p className="text-slate-400 text-xs mb-4 line-clamp-2">{s.description}</p>
                        <div className="flex items-center justify-between">
                            <div>
                                {s.price > 0 ? (
                                    <span className="text-white font-bold">${s.price.toLocaleString()}<span className="text-slate-500 font-normal text-xs"> / {s.unit}</span></span>
                                ) : (
                                    <span className="text-slate-400 text-sm">Custom Quote</span>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span className="text-emerald-400 text-xs font-medium">Active</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceCatalog;
