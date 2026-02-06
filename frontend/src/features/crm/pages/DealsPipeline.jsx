import React, { useEffect, useState } from 'react';
import { crmService } from '../../../shared/core/services/crmService';
import { Plus, DollarSign, Calendar, MoreVertical, Trash2 } from 'lucide-react';
import DealModal from './DealModal';
import DeleteConfirmationModal from '../../../shared/core/components/DeleteConfirmationModal';

const STAGES = [
    { key: 'new', label: 'New Opportunity', color: 'border-blue-500' },
    { key: 'qualified', label: 'Qualified', color: 'border-indigo-500' },
    { key: 'proposal', label: 'Proposal Sent', color: 'border-purple-500' },
    { key: 'negotiation', label: 'Negotiation', color: 'border-pink-500' },
    { key: 'won', label: 'Closed Won', color: 'border-emerald-500' },
    { key: 'lost', label: 'Closed Lost', color: 'border-slate-500' }
];

const DealsPipeline = () => {
    const [deals, setDeals] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDeal, setEditingDeal] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [dealToDelete, setDealToDelete] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [dealsData, clientsData] = await Promise.all([
                crmService.getDeals(),
                crmService.getClients()
            ]);
            setDeals(Array.isArray(dealsData) ? dealsData : dealsData.results || []);
            setClients(Array.isArray(clientsData) ? clientsData : clientsData.results || []);
        } catch (error) {
            console.error("Failed to load pipeline data", error);
        } finally {
            setLoading(false);
        }
    };

    const getColumnTotal = (stageKey) => {
        return deals
            .filter(d => d.stage === stageKey)
            .reduce((sum, d) => sum + parseFloat(d.value), 0)
            .toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    // CRUD Handlers
    const handleSaveDeal = async (formData) => {
        try {
            if (editingDeal) {
                await crmService.updateDeal(editingDeal.id, formData);
            } else {
                await crmService.createDeal(formData);
            }
            setIsModalOpen(false);
            setEditingDeal(null);
            loadData(); // Refresh
        } catch (error) {
            console.error("Failed to save deal", error);
            alert("Failed to save deal. Please try again.");
        }
    };

    const handleEditClick = (deal) => {
        setEditingDeal(deal);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (e, deal) => {
        e.stopPropagation(); // Prevent opening edit modal
        setDealToDelete(deal);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!dealToDelete) return;
        try {
            await crmService.deleteDeal(dealToDelete.id);
            setDeleteModalOpen(false);
            setDealToDelete(null);
            loadData(); // Refresh
        } catch (error) {
            console.error("Failed to delete deal", error);
            alert("Failed to delete deal.");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6 overflow-x-auto h-[calc(100vh-100px)]">
            <div className="flex justify-between items-center min-w-[1000px]">
                <div>
                    <h1 className="text-3xl font-bold text-white">Sales Pipeline</h1>
                    <p className="text-slate-400">Track and manage your sales opportunities.</p>
                </div>
                <button
                    onClick={() => { setEditingDeal(null); setIsModalOpen(true); }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                >
                    <Plus size={18} />
                    New Deal
                </button>
            </div>

            <div className="flex gap-4 min-w-[1200px] pb-4 h-full">
                {STAGES.map(stage => (
                    <div key={stage.key} className="flex-none w-80 bg-slate-800/50 rounded-xl border border-slate-700/50 flex flex-col h-full">
                        {/* Column Header */}
                        <div className={`p-4 border-b border-slate-700/50 border-t-4 rounded-t-xl ${stage.color} bg-slate-800`}>
                            <h3 className="font-bold text-white text-lg flex justify-between items-center">
                                {stage.label}
                                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                                    {deals.filter(d => d.stage === stage.key).length}
                                </span>
                            </h3>
                            <div className="text-xs text-slate-400 mt-1 font-mono">
                                Total: {getColumnTotal(stage.key)}
                            </div>
                        </div>

                        {/* Cards Container */}
                        <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                            {deals.filter(d => d.stage === stage.key).map(deal => (
                                <div
                                    key={deal.id}
                                    onClick={() => handleEditClick(deal)}
                                    className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 hover:border-blue-500/50 cursor-pointer shadow-sm group transition-all hover:-translate-y-1 relative"
                                >
                                    <div className="flex justify-between items-start mb-2 pr-6">
                                        <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {deal.name}
                                        </h4>

                                        <button
                                            onClick={(e) => handleDeleteClick(e, deal)}
                                            className="absolute top-3 right-3 text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Delete Deal"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="text-xs text-slate-400 mb-3 block">
                                        {deal.client_name || clients.find(c => c.id === deal.client)?.name || 'Unknown Client'}
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-300 border-t border-slate-600/50 pt-3">
                                        <div className="flex items-center gap-1 text-emerald-400 font-bold">
                                            <DollarSign size={12} />
                                            {parseFloat(deal.value).toLocaleString()}
                                        </div>
                                        {deal.expected_close_date && (
                                            <div className="flex items-center gap-1 text-slate-500">
                                                <Calendar size={12} />
                                                <span>{new Date(deal.expected_close_date).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            <DealModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveDeal}
                deal={editingDeal}
                clients={clients}
            />

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Deal"
                message={`Are you sure you want to delete "${dealToDelete?.name}"? This opportunity will be permanently lost.`}
            />
        </div>
    );
};

export default DealsPipeline;


