import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Clock, AlertCircle, Plus, Edit2, Trash2 } from 'lucide-react';
import contractsService from '../../../core/api/contractsService';
import GenericModal from '../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../core/components/shared/core/DeleteConfirmationModal';

const SlaTiersPage = () => {
    const [tiers, setTiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTier, setSelectedTier] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchTiers = () => {
            contractsService.getSlaTiers()
                .then(d => setTiers(d))
                .catch(e => console.error(e))
                .finally(() => setLoading(false));
        };
        fetchTiers();
    }, []);

    const fetchOnlyTiers = async () => {
        try {
            const data = await contractsService.getSlaTiers();
            setTiers(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (selectedTier) {
                await contractsService.updateSlaTier(selectedTier.id, formData);
            } else {
                await contractsService.createSlaTier(formData);
            }
            setIsModalOpen(false);
            await fetchOnlyTiers();
        } catch (error) {
            alert('Failed to save SLA tier');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedTier) return;
        setActionLoading(true);
        try {
            await contractsService.deleteSlaTier(selectedTier.id);
            setIsDeleteModalOpen(false);
            await fetchOnlyTiers();
        } catch (error) {
            alert('Failed to delete SLA tier');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const TIER_FIELDS = [
        { name: 'name', label: 'Tier Name', required: true },
        { name: 'first_response_hours', label: 'First Response (Hours)', type: 'number', required: true },
        { name: 'resolution_hours', label: 'Resolution (Hours)', type: 'number', required: true },
        { name: 'priority', label: 'Priority', type: 'select', options: [
            { value: 'critical', label: 'Critical' },
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' }
        ], default: 'medium' }
    ];

    return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <ShieldCheck className="text-amber-400" size={28} />
                    SLA Tiers
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Define service level agreements and response time targets</p>
            </div>
            <button onClick={() => { setSelectedTier(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                <Plus size={16} /> Add SLA Tier
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
                <div className="col-span-full py-16 text-center text-slate-500">Loading SLA Tiers...</div>
            ) : tiers.length === 0 ? (
                <div className="col-span-full py-16 text-center text-slate-500">No SLA Tiers found</div>
            ) : tiers.map(tier => (
                <div key={tier.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-amber-500/30 transition-colors group relative cursor-pointer">
                    <div className="absolute top-2 right-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => { e.stopPropagation(); setSelectedTier(tier); setIsModalOpen(true); }}
                            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setSelectedTier(tier); setIsDeleteModalOpen(true); }}
                            className="p-1.5 bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between mb-3 mt-4">
                        <h3 className="text-white font-bold text-lg">{tier.name}</h3>
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-bold uppercase">{tier.priority}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-1.5"><Clock size={13} /> First Response</span>
                            <span className="text-white font-semibold">{tier.first_response_hours}h</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-1.5"><AlertCircle size={13} /> Resolution</span>
                            <span className="text-white font-semibold">{tier.resolution_hours}h</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                            <span className="text-slate-500 text-xs">Active Contracts</span>
                            <span className="text-emerald-400 font-bold">{tier.active_contracts}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <GenericModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="SLA Tier"
            fields={TIER_FIELDS}
            initialData={selectedTier}
            onSubmit={handleSave}
            loading={actionLoading}
        />

        <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Delete SLA Tier"
            message={`Are you sure you want to delete ${selectedTier?.name}?`}
            loading={actionLoading}
        />
    </div>
    );
};

export default SlaTiersPage;
