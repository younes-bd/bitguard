import React, { useState, useEffect, useRef } from 'react';
import { Activity, Clock, AlertTriangle, CheckCircle, Eye, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import client from '@/core/api/client';
import toast from 'react-hot-toast';

const formatCountdown = (ms) => {
    if (ms <= 0) return { text: 'BREACHED', breached: true };
    const totalSecs = Math.floor(ms / 1000);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return { text: `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`, breached: false };
};

const getRowStyle = (pct, breached) => {
    if (breached) return 'bg-rose-500/10 border-rose-500/30 animate-pulse';
    if (pct < 25) return 'bg-rose-500/5 border-rose-500/20';
    if (pct < 50) return 'bg-amber-500/5 border-amber-500/20';
    return 'bg-emerald-500/5 border-emerald-500/10';
};

const getTimerColor = (pct, breached) => {
    if (breached) return 'text-rose-400 font-black';
    if (pct < 25) return 'text-rose-400 font-bold';
    if (pct < 50) return 'text-amber-400 font-bold';
    return 'text-emerald-400 font-bold';
};

export default function SlaLiveDashboard() {
    const [tickets, setTickets] = useState([]);
    const [slaTiers, setSlaTiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [now, setNow] = useState(Date.now());
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();
    const intervalRef = useRef(null);

    const fetchData = async () => {
        try {
            const [ticketsRes, slaRes] = await Promise.all([
                client.get('support/tickets/', { params: { status: 'open', limit: 200 } }),
                client.get('sign/sla-tiers/').catch(() => ({ data: [] }))
            ]);
            setTickets(ticketsRes.data?.results || ticketsRes.data || []);
            setSlaTiers(slaRes.data?.results || slaRes.data || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch SLA data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const dataInterval = setInterval(fetchData, 60000);
        const clockInterval = setInterval(() => setNow(Date.now()), 1000);
        intervalRef.current = { dataInterval, clockInterval };
        return () => {
            clearInterval(dataInterval);
            clearInterval(clockInterval);
        };
    }, []);

    const getSlaHours = (ticket) => {
        const tier = slaTiers.find(t => t.id === ticket.sla_tier || t.name === ticket.sla_tier_name);
        return tier?.response_hours || 24;
    };

    const computedTickets = tickets.map(ticket => {
        const slaHours = getSlaHours(ticket);
        const deadline = new Date(ticket.created_at).getTime() + slaHours * 3600 * 1000;
        const remaining = deadline - now;
        const totalMs = slaHours * 3600 * 1000;
        const pct = Math.max(0, (remaining / totalMs) * 100);
        const { text, breached } = formatCountdown(remaining);
        return { ...ticket, remaining, pct, countdownText: text, breached };
    });

    const stats = {
        total: computedTickets.length,
        breached: computedTickets.filter(t => t.breached).length,
        atRisk: computedTickets.filter(t => !t.breached && t.pct < 25).length,
        ok: computedTickets.filter(t => !t.breached && t.pct >= 25).length,
    };

    const filtered = filter === 'breached' ? computedTickets.filter(t => t.breached)
        : filter === 'at_risk' ? computedTickets.filter(t => !t.breached && t.pct < 25)
        : computedTickets;

    filtered.sort((a, b) => a.remaining - b.remaining);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px] gap-4 flex-col">
            <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading SLA data...</p>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Activity className="text-teal-400" size={28} /> Live SLA Board
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Real-time SLA countdown — auto-refreshes every 60s</p>
                </div>
                <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors text-sm">
                    <RefreshCw size={14} /> Refresh Now
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Open', value: stats.total, color: 'text-white', bg: 'bg-slate-900' },
                    { label: 'Breached', value: stats.breached, color: 'text-rose-400', bg: 'bg-rose-500/5 border-rose-500/20' },
                    { label: 'At Risk (<25%)', value: stats.atRisk, color: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/20' },
                    { label: 'Within SLA', value: stats.ok, color: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/20' },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} border border-slate-800 rounded-2xl p-4`}>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">{s.label}</p>
                        <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {[['all','All'], ['breached','Breached'], ['at_risk','At Risk']].map(([val, label]) => (
                    <button key={val} onClick={() => setFilter(val)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-colors ${filter === val ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                        {label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                        <CheckCircle size={40} className="mx-auto mb-3 text-emerald-700" />
                        <p className="font-bold text-slate-400">All Clear</p>
                        <p className="text-sm">No tickets in the selected filter</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-950/60 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                            <tr>
                                <th className="p-4">Ticket</th>
                                <th className="p-4">Priority</th>
                                <th className="p-4">SLA Tier</th>
                                <th className="p-4">Created</th>
                                <th className="p-4">Time Remaining</th>
                                <th className="p-4">Status</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filtered.map(ticket => (
                                <tr key={ticket.id} className={`border ${getRowStyle(ticket.pct, ticket.breached)} transition-colors`}>
                                    <td className="p-4">
                                        <p className="text-white font-semibold text-sm">{ticket.title || ticket.subject}</p>
                                        <p className="text-slate-500 text-xs">#{ticket.id}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs font-black uppercase ${ticket.priority === 'critical' ? 'text-rose-400' : ticket.priority === 'high' ? 'text-amber-400' : 'text-slate-400'}`}>
                                            {ticket.priority || 'normal'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400 text-sm">{ticket.sla_tier_name || 'Standard'}</td>
                                    <td className="p-4 text-slate-400 text-sm">{new Date(ticket.created_at).toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`font-mono text-sm ${getTimerColor(ticket.pct, ticket.breached)}`}>
                                            {ticket.countdownText}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="w-24 bg-slate-800 rounded-full h-1.5">
                                            <div className={`h-1.5 rounded-full transition-all ${ticket.breached ? 'bg-rose-500 w-full' : ticket.pct < 25 ? 'bg-rose-500' : ticket.pct < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                style={{ width: ticket.breached ? '100%' : `${ticket.pct}%` }} />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => navigate(`/admin/helpdesk/tickets/${ticket.id}`)}
                                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 bg-slate-800 rounded-lg">
                                            <Eye size={12} /> View
                                        </button>
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


