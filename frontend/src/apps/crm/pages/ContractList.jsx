import React, { useState, useEffect } from 'react';
import { Plus, FileText, Edit2, Trash2 } from 'lucide-react';
import contractsService from '../../../core/api/contractsService';
import { crmService } from '../../../core/api/crmService';
import GenericModal from '../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../core/components/shared/core/DeleteConfirmationModal';

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
    const [clients, setClients] = useState([]);
    const [slaTiers, setSlaTiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [conData, cliData, slaData] = await Promise.all([
                    contractsService.getContracts(),
                    crmService.getClients().catch(() => []),
                    contractsService.getSlaTiers ? contractsService.getSlaTiers().catch(() => []) : Promise.resolve([])
                ]);
                setContracts(conData?.results ?? conData ?? []);
                setClients(cliData?.results ?? cliData ?? []);
                setSlaTiers(slaData?.results ?? slaData ?? []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (selectedContract) {
                await contractsService.updateContract(selectedContract.id, formData);
            } else {
                await contractsService.createContract(formData);
            }
            setIsModalOpen(false);
            const data = await contractsService.getContracts();
            setContracts(data?.results ?? data ?? []);
        } catch (error) {
            alert('Failed to save contract');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedContract) return;
        setActionLoading(true);
        try {
            await contractsService.deleteContract(selectedContract.id);
            setIsDeleteModalOpen(false);
            const data = await contractsService.getContracts();
            setContracts(data?.results ?? data ?? []);
        } catch (error) {
            alert('Failed to delete contract');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const CONTRACT_FIELDS = [
        { name: 'title', label: 'Title', required: true },
        { name: 'client', label: 'Client', type: 'select', options: clients.map(c => ({ value: c.id, label: c.name })) },
        { name: 'sla_tier', label: 'SLA Tier', type: 'select', options: Array.isArray(slaTiers) ? slaTiers.map(s => ({ value: s.id, label: s.name })) : [] },
        { name: 'start_date', label: 'Start Date', type: 'date' },
        { name: 'end_date', label: 'End Date', type: 'date' },
        { name: 'value', label: 'Value ($)', type: 'number', step: '0.01' },
        { name: 'status', label: 'Status', type: 'select', options: [
            { value: 'draft', label: 'Draft' },
            { value: 'pending', label: 'Pending' },
            { value: 'active', label: 'Active' },
            { value: 'expired', label: 'Expired' },
            { value: 'cancelled', label: 'Cancelled' }
        ], default: 'draft' }
    ];

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Service Contracts</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{contracts.length} contracts</p>
                </div>
                <button onClick={() => { setSelectedContract(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={16} /><span>New Contract</span>
                </button>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['Contract', 'Client', 'SLA Tier', 'Start Date', 'End Date', 'Value', 'Status', ''].map(h => (
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
                            <tr key={c.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors group">
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
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedContract(c); setIsModalOpen(true); }}
                                            className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedContract(c); setIsDeleteModalOpen(true); }}
                                            className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Contract"
                fields={CONTRACT_FIELDS}
                initialData={selectedContract}
                onSubmit={handleSave}
                loading={actionLoading}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Contract"
                message={`Are you sure you want to delete ${selectedContract?.title || `Contract #${selectedContract?.id}`}?`}
                loading={actionLoading}
            />
        </div>
    );
};

export default ContractListPage;
