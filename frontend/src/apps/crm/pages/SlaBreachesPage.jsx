import React from 'react';
import { AlertTriangle, Clock, Users, FileText } from 'lucide-react';

const MOCK_BREACHES = [
    { id: 1, contract: 'Acme Corp — Platinum', type: 'First Response', breach_time: '2026-03-20T15:00:00Z', sla_target: '1h', actual: '2h 15m', severity: 'critical' },
    { id: 2, contract: 'TechStart — Gold', type: 'Resolution', breach_time: '2026-03-19T10:00:00Z', sla_target: '12h', actual: '14h 30m', severity: 'warning' },
    { id: 3, contract: 'Global Fin — Silver', type: 'First Response', breach_time: '2026-03-18T09:00:00Z', sla_target: '8h', actual: '9h 45m', severity: 'warning' },
];

const SlaBreachesPage = () => (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                <AlertTriangle className="text-red-400" size={28} />
                SLA Breaches
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Track service level agreement violations and response time failures</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="text-slate-400 text-xs uppercase font-bold mb-1">Total Breaches (30d)</div>
                <div className="text-3xl font-bold text-red-400">{MOCK_BREACHES.length}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="text-slate-400 text-xs uppercase font-bold mb-1">Critical</div>
                <div className="text-3xl font-bold text-red-400">{MOCK_BREACHES.filter(b => b.severity === 'critical').length}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="text-slate-400 text-xs uppercase font-bold mb-1">Affected Contracts</div>
                <div className="text-3xl font-bold text-amber-400">{new Set(MOCK_BREACHES.map(b => b.contract)).size}</div>
            </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-800">
                        {['Contract', 'Breach Type', 'SLA Target', 'Actual', 'Severity', 'When'].map(h => (
                            <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {MOCK_BREACHES.map(b => (
                        <tr key={b.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                            <td className="px-5 py-4 text-white font-medium">{b.contract}</td>
                            <td className="px-5 py-4 text-slate-400">{b.type}</td>
                            <td className="px-5 py-4 text-emerald-400 font-mono">{b.sla_target}</td>
                            <td className="px-5 py-4 text-red-400 font-mono">{b.actual}</td>
                            <td className="px-5 py-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                    b.severity === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}>{b.severity}</span>
                            </td>
                            <td className="px-5 py-4 text-slate-500 text-xs">{new Date(b.breach_time).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default SlaBreachesPage;
