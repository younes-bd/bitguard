import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Search, Trash2, Edit2 } from 'lucide-react';
import client from '../../../../core/api/client';
import GenericModal from '../../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../../core/components/shared/core/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const RISK_SCORE_COLOR = (score) => score > 12 ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : score >= 5 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

const RISK_FIELDS = [
    { name: 'summary', label: 'Risk Summary', required: true },
    { name: 'category', label: 'Category', type: 'select', options: [
        { value: 'technical', label: 'Technical' }, { value: 'operational', label: 'Operational' },
        { value: 'legal', label: 'Legal' }, { value: 'financial', label: 'Financial' }
    ], default: 'technical' },
    { name: 'likelihood', label: 'Likelihood (1â€“5)', type: 'number', min: '1', max: '5', default: '3' },
    { name: 'impact', label: 'Impact (1â€“5)', type: 'number', min: '1', max: '5', default: '3' },
    { name: 'owner', label: 'Risk Owner', required: true },
    { name: 'mitigation_plan', label: 'Mitigation Plan', type: 'textarea', rows: 3 },
    { name: 'status', label: 'Status', type: 'select', options: [
        { value: 'open', label: 'Open' }, { value: 'mitigating', label: 'Mitigating' }, { value: 'closed', label: 'Closed' }
    ], default: 'open' },
];

export default function RiskRegister() {
    const [risks, setRisks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchRisks = async () => {
        setLoading(true);
        try {
            const res = await client.get('erp/risks/');
            setRisks(res.data?.results || res.data || []);
        } catch { toast.error('Failed to load risks'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchRisks(); }, []);

    const handleCreate = async (formData) => {
        setActionLoading(true);
        try {
            await client.post('erp/risks/', formData);
            toast.success('Risk logged');
            setIsModalOpen(false);
            fetchRisks();
        } catch { toast.error('Failed to create risk'); }
        finally { setActionLoading(false); }
    };

    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await client.delete(`erp/risks/${deleteTarget.id}/`);
            toast.success('Risk deleted');
            setDeleteTarget(null);
            fetchRisks();
        } catch { toast.error('Failed to delete risk'); }
        finally { setActionLoading(false); }
    };

    const filtered = risks.filter(r => (r.summary || '').toLowerCase().includes(search.toLowerCase()));

    if (loading && risks.length === 0) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading risk register...</p>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <ShieldAlert className="text-rose-500" size={28} /> Risk Register
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Identify, score, and mitigate operational risks</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95">
                    <Plus size={18} /> Log Risk
                </button>
            </div>
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="text" placeholder="Search risks..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                        <ShieldAlert size={40} className="mx-auto mb-3 text-slate-700" />
                        <p className="font-bold text-slate-400">No Risks Logged</p>
                        <p className="text-sm mt-1">Start tracking your operational risks</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-950/60 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                            <tr>
                                <th className="p-4">Risk</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Score (LÃ—I)</th>
                                <th className="p-4">Owner</th>
                                <th className="p-4">Status</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filtered.map(risk => {
                                const score = (risk.likelihood || 1) * (risk.impact || 1);
                                return (
                                    <tr key={risk.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="p-4">
                                            <p className="text-white font-semibold text-sm">{risk.summary}</p>
                                            <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{risk.mitigation_plan}</p>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm capitalize">{risk.category}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${RISK_SCORE_COLOR(score)}`}>{score}</span>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">{risk.owner}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${risk.status === 'closed' ? 'bg-slate-700 text-slate-400' : risk.status === 'mitigating' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                {risk.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => setDeleteTarget(risk)} className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-400 transition-colors">
                                                <Trash2 size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
            <GenericModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Risk" fields={RISK_FIELDS} onSubmit={handleCreate} loading={actionLoading} />
            <DeleteConfirmationModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} itemName={deleteTarget?.summary} loading={actionLoading} />
        </div>
    );
}

