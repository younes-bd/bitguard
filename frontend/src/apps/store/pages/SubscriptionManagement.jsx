import React, { useState, useEffect } from 'react';
import { CreditCard, Search, CalendarClock, Loader2 } from 'lucide-react';
import client from '../../../core/api/client';

export default function SubscriptionManagement() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        client.get('store/subscriptions/')
            .then(res => setSubscriptions(res.data.results || res.data || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <CreditCard className="text-pink-400" /> Client Subscriptions
                </h1>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search subscriptions..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-950 border border-slate-800 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-pink-500" 
                        />
                    </div>
                </div>
                {loading ? (
                    <div className="py-20 text-center text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-pink-500" />
                        Loading billing ledgers...
                    </div>
                ) : subscriptions.length === 0 ? (
                    <div className="py-20 text-center text-slate-500 flex flex-col items-center">
                        <CalendarClock size={48} className="mb-4 text-slate-700" />
                        No active subscriptions in the billing registry.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50">
                                <th className="px-6 py-4 text-left font-semibold text-slate-400">Customer</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-400">Plan</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-400">Status</th>
                                <th className="px-6 py-4 text-right font-semibold text-slate-400">Next Renewal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {subscriptions.filter(sub => 
                                (sub.customer_details?.username || `Customer #${sub.customer}`).toLowerCase().includes(searchQuery.toLowerCase()) || 
                                (sub.plan_details?.name || `Plan #${sub.plan}`).toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (sub.status || '').toLowerCase().includes(searchQuery.toLowerCase())
                            ).map(sub => (
                                <tr key={sub.id} className="hover:bg-slate-800/30">
                                    <td className="px-6 py-4 text-white font-medium">{sub.customer_details?.username || `Customer #${sub.customer}`}</td>
                                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{sub.plan_details?.name || `Plan #${sub.plan}`}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-400">
                                        {sub.next_renewal_date ? new Date(sub.next_renewal_date).toLocaleDateString() : 'N/A'}
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
