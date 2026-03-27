import React, { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import contractsService from '../../../core/api/contractsService';

const statusBadge = (status) => {
    const map = {
        active: 'bg-emerald-500/10 text-emerald-400',
        expired: 'bg-slate-700 text-slate-400',
        pending: 'bg-amber-500/10 text-amber-400',
        cancelled: 'bg-red-500/10 text-red-400',
        draft: 'bg-blue-500/10 text-blue-400',
    };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>{status}</span>;
};

const ContractListPage = () => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        contractsService.getContracts().then(d => {
            setContracts(d?.results ?? d ?? []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Service Contracts</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{contracts.length} contracts</p>
                </div>
                <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={16} /><span>New Contract</span>
                </button>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Contract', 'Client', 'SLA Tier', 'Start Date', 'End Date', 'Value', 'Status'].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="py-16 text-center text-slate-500">Loading contracts...</td></tr>
                        ) : contracts.length === 0 ? (
                            <tr><td colSpan={7} className="py-16 text-center text-slate-500">No contracts yet</td></tr>
                        ) : contracts.map(c => (
                            <tr key={c.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <FileText size={14} className="text-violet-400" />
                                        <span className="text-white font-medium">{c.title ?? c.name ?? `Contract #${c.id}`}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-slate-300">{c.client?.name ?? c.client ?? '—'}</td>
                                <td className="px-5 py-4 text-slate-400">{c.sla_tier?.name ?? '—'}</td>
                                <td className="px-5 py-4 text-slate-400">{c.start_date ?? '—'}</td>
                                <td className="px-5 py-4 text-slate-400">{c.end_date ?? '—'}</td>
                                <td className="px-5 py-4 text-emerald-400 font-semibold">${Number(c.value ?? c.monthly_fee ?? 0).toLocaleString()}</td>
                                <td className="px-5 py-4">{statusBadge(c.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContractListPage;
