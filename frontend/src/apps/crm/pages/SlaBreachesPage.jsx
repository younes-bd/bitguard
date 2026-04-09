import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Users, FileText, Loader2 } from 'lucide-react';
import client from '../../../core/api/client';

const SlaBreachesPage = () => {
    const [breaches, setBreaches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('contracts/sla-breaches/')
            .then(res => {
                const data = res.data.results ? res.data.results : (Array.isArray(res.data) ? res.data : []);
                setBreaches(data);
            })
            .catch(err => console.error("Failed to load SLA breaches", err))
            .finally(() => setLoading(false));
    }, []);

    return (
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
                <div className="text-3xl font-bold text-red-400">{loading ? '...' : breaches.length}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="text-slate-400 text-xs uppercase font-bold mb-1">Critical</div>
                <div className="text-3xl font-bold text-red-400">{loading ? '...' : breaches.filter(b => b.severity === 'critical').length}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="text-slate-400 text-xs uppercase font-bold mb-1">Affected Contracts</div>
                <div className="text-3xl font-bold text-amber-400">{loading ? '...' : new Set(breaches.map(b => b.contract || b.id)).size}</div>
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
                    {loading && (
                        <tr>
                            <td colSpan="6" className="px-5 py-8 text-center text-slate-500">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                                Analyzing SLA logs...
                            </td>
                        </tr>
                    )}
                    {!loading && breaches.length > 0 ? breaches.map(b => (
                        <tr key={b.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                            <td className="px-5 py-4 text-white font-medium">{b.contract_name || b.contract || `Contract #${b.id}`}</td>
                            <td className="px-5 py-4 text-slate-400">{b.type || b.breach_type || 'Resolution'}</td>
                            <td className="px-5 py-4 text-emerald-400 font-mono">{b.sla_target || 'N/A'}</td>
                            <td className="px-5 py-4 text-red-400 font-mono">{b.actual || 'Failed'}</td>
                            <td className="px-5 py-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                    (b.severity || 'warning') === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}>{b.severity || 'warning'}</span>
                            </td>
                            <td className="px-5 py-4 text-slate-500 text-xs">{b.breach_time ? new Date(b.breach_time).toLocaleDateString() : new Date().toLocaleDateString()}</td>
                        </tr>
                    )) : !loading && (
                        <tr>
                            <td colSpan="6" className="px-5 py-8 text-center text-emerald-400">
                                No SLA breaches recorded. All contracts are healthy.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
    );
};

export default SlaBreachesPage;
