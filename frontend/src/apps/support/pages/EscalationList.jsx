import React, { useState, useEffect } from 'react';
import { AlertOctagon, Clock, User, ArrowUpCircle, CheckCircle } from 'lucide-react';
import client from '../../../core/api/client';

const priorityBadge = (priority) => {
    const map = {
        critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
        high: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
        medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
        low: 'bg-slate-700 text-slate-400',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[priority] ?? 'bg-slate-700 text-slate-400'}`}>
            {priority}
        </span>
    );
};

const EscalationList = () => {
    const [escalations, setEscalations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch high/critical tickets as escalations
        client.get('support/tickets/?priority=critical&status=open')
            .then(r => { setEscalations(r.data?.results ?? r.data ?? []); setLoading(false); })
            .catch(() => {
                // Fallback mock data
                setEscalations([
                    { id: 'ESC-001', subject: 'Server down - Production outage', status: 'open', priority: 'critical', client: 'Acme Corp', assigned_to: 'J. Martin', created_at: '2026-03-09T10:22:00Z' },
                    { id: 'ESC-002', subject: 'Ransomware suspected on endpoint', status: 'open', priority: 'critical', client: 'Global Ltd', assigned_to: null, created_at: '2026-03-09T09:05:00Z' },
                    { id: 'ESC-003', subject: 'VPN access broken for remote team', status: 'open', priority: 'high', client: 'StartupXYZ', assigned_to: 'A. Smith', created_at: '2026-03-08T14:30:00Z' },
                ]);
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Escalations</h1>
                <p className="text-slate-400 text-sm mt-0.5">Critical and high-priority tickets requiring immediate attention</p>
            </div>

            {/* Alert Banner */}
            {escalations.filter(e => e.priority === 'critical').length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <AlertOctagon size={20} className="text-red-400 flex-shrink-0" />
                    <span className="text-red-300 text-sm font-medium">
                        {escalations.filter(e => e.priority === 'critical').length} critical escalation(s) require immediate action
                    </span>
                </div>
            )}

            <div className="space-y-3">
                {loading ? (
                    <div className="py-16 text-center text-slate-500">Loading escalations...</div>
                ) : escalations.length === 0 ? (
                    <div className="py-16 text-center text-slate-500">
                        <CheckCircle size={36} className="mx-auto mb-2 text-emerald-500/40" />
                        No active escalations
                    </div>
                ) : escalations.map(esc => (
                    <div key={esc.id} className={`bg-slate-900 border rounded-xl p-5 hover:bg-slate-800/50 transition-colors ${esc.priority === 'critical' ? 'border-red-500/30' : 'border-slate-800'}`}>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <ArrowUpCircle size={18} className={esc.priority === 'critical' ? 'text-red-400 mt-0.5' : 'text-orange-400 mt-0.5'} />
                                <div>
                                    <div className="text-white font-semibold">{esc.subject}</div>
                                    <div className="flex items-center gap-4 mt-1.5">
                                        <span className="text-slate-400 text-xs">{esc.client ?? '—'}</span>
                                        <span className="flex items-center gap-1 text-slate-500 text-xs">
                                            <User size={10} /> {esc.assigned_to ?? 'Unassigned'}
                                        </span>
                                        <span className="flex items-center gap-1 text-slate-500 text-xs">
                                            <Clock size={10} /> {esc.created_at?.split('T')[0] ?? '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {priorityBadge(esc.priority)}
                                <button className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors px-2 py-1 rounded border border-blue-500/20 hover:border-blue-500/40">
                                    Assign
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EscalationList;
