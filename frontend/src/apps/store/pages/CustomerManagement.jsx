import React, { useState, useEffect } from 'react';
import { Users, Search, Activity, Loader2 } from 'lucide-react';
import client from '../../../core/api/client';

export default function CustomerManagement() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('store/customers/')
            .then(res => setCustomers(res.data.results || res.data || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="text-indigo-400" /> Store Customers
                </h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-center">
                    <div className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">Total Active Buyers</div>
                    <div className="text-3xl font-bold text-white">{customers.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-center">
                    <div className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">Pending Profiles</div>
                    <div className="text-3xl font-bold text-white">{customers.filter(c => c.status !== 'active').length}</div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input type="text" placeholder="Search customers..." className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
                    </div>
                </div>
                
                {loading ? (
                    <div className="py-24 text-center text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-500" />
                        Fetching CRM portfolios...
                    </div>
                ) : customers.length === 0 ? (
                    <div className="py-24 text-center text-slate-500 flex flex-col items-center">
                        <Users size={48} className="mb-4 text-slate-700" />
                        No customer profiles provisioned in this tenant yet.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50">
                                <th className="px-6 py-4 text-left font-semibold text-slate-400">Username</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-400">Email</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-400">Phone</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-400">Status</th>
                                <th className="px-6 py-4 text-right font-semibold text-slate-400">Profile Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {customers.map(c => (
                                <tr key={c.id} className="hover:bg-slate-800/30 cursor-pointer group transition-colors">
                                    <td className="px-6 py-4 text-white font-medium group-hover:text-indigo-400">{c.username || 'Unlinked Profile'}</td>
                                    <td className="px-6 py-4 text-slate-400">{c.email || 'N/A'}</td>
                                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{c.phone || '--'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase inline-flex items-center gap-1 ${c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                            {c.status === 'active' && <Activity size={10} />}
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-500">
                                        {new Date(c.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
