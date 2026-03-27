import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, Filter } from 'lucide-react';
import client from '../../../core/api/client';

const severityBadge = (type) => {
    const map = {
        first_response: 'bg-amber-500/10 text-amber-400',
        resolution: 'bg-red-500/10 text-red-400',
        uptime: 'bg-purple-500/10 text-purple-400',
    };
    const labels = { first_response: 'First Response', resolution: 'Resolution', uptime: 'Uptime' };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[type] ?? 'bg-slate-700 text-slate-400'}`}>
            {labels[type] ?? type}
        </span>
    );
};

const SlaBreachLog = () => {
    const [breaches, setBreaches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('contracts/sla-breaches/')
            .then(r => { setBreaches(r.data?.results ?? r.data ?? []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleAcknowledge = async (id) => {
        try {
            await client.patch(`contracts/sla-breaches/${id}/`, { acknowledged: true });
            setBreaches(prev => prev.map(b => b.id === id ? { ...b, acknowledged: true } : b));
        } catch (e) { /* no-op */ }
    };

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">SLA Breach Log</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{breaches.length} breach events recorded</p>
                </div>
                <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Filter size={14} /> Filter
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Total Breaches', value: breaches.length, icon: AlertTriangle, color: 'text-red-400' },
                    { label: 'Unacknowledged', value: breaches.filter(b => !b.acknowledged).length, icon: Clock, color: 'text-amber-400' },
                    { label: 'Acknowledged', value: breaches.filter(b => b.acknowledged).length, icon: CheckCircle, color: 'text-emerald-400' },
                ].map(card => (
                    <div key={card.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
                        <card.icon size={28} className={card.color} />
                        <div>
                            <div className="text-2xl font-bold text-white">{card.value}</div>
                            <div className="text-slate-400 text-sm">{card.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Contract', 'Breach Type', 'Breached At', 'Status', 'Action'].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="py-16 text-center text-slate-500">Loading breach log...</td></tr>
                        ) : breaches.length === 0 ? (
                            <tr><td colSpan={5} className="py-16 text-center text-slate-500">
                                <CheckCircle size={36} className="mx-auto mb-2 text-emerald-500/40" />
                                No SLA breaches recorded
                            </td></tr>
                        ) : breaches.map(b => (
                            <tr key={b.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                                <td className="px-5 py-4 text-white font-medium">{b.contract?.client ?? b.contract ?? '—'}</td>
                                <td className="px-5 py-4">{severityBadge(b.breach_type)}</td>
                                <td className="px-5 py-4 text-slate-400">{b.breached_at?.split('T')[0] ?? '—'}</td>
                                <td className="px-5 py-4">
                                    {b.acknowledged
                                        ? <span className="text-emerald-400 text-xs font-semibold">✓ Acknowledged</span>
                                        : <span className="text-amber-400 text-xs font-semibold">Pending</span>}
                                </td>
                                <td className="px-5 py-4">
                                    {!b.acknowledged && (
                                        <button onClick={() => handleAcknowledge(b.id)}
                                            className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                                            Acknowledge
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SlaBreachLog;
