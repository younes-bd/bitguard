import React, { useState, useEffect } from 'react';
import { crmService } from '../../../../core/api/crmService';
import { DollarSign, Plus, Calendar, User, GripVertical, Trash2 } from 'lucide-react';
import DealModal from '../modals/DealModal';
import DeleteConfirmationModal from '../../../../core/components/shared/core/DeleteConfirmationModal';
import { useNavigate } from 'react-router-dom';

const STAGES = [
    { id: 'prospecting', label: 'Prospecting', color: 'border-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-400' },
    { id: 'proposal', label: 'Proposal', color: 'border-yellow-500', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
    { id: 'negotiation', label: 'Negotiation', color: 'border-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-400' },
    { id: 'won', label: 'Closed Won', color: 'border-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    { id: 'lost', label: 'Closed Lost', color: 'border-red-500', bg: 'bg-red-500/10', text: 'text-red-400' },
];

export default function DealsPipeline() {
    const [deals, setDeals] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDealModalOpen, setIsDealModalOpen] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [dealToDelete, setDealToDelete] = useState(null);
    const navigate = useNavigate();

    const loadData = async () => {
        try {
            const [dealsData, clientsData] = await Promise.all([
                crmService.getDeals(),
                crmService.getClients()
            ]);
            setDeals(Array.isArray(dealsData) ? dealsData : dealsData.results || []);
            setClients(Array.isArray(clientsData) ? clientsData : clientsData.results || []);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDragStart = (e, dealId) => {
        e.dataTransfer.setData('dealId', dealId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, stageId) => {
        e.preventDefault();
        const dealId = e.dataTransfer.getData('dealId');
        
        // Optimistic UI update
        setDeals(deals.map(d => d.id === parseInt(dealId) ? { ...d, stage: stageId } : d));

        try {
            await crmService.updateDeal(dealId, { stage: stageId });
            loadData();
        } catch (error) {
            console.error('Failed to update deal stage', error);
            loadData(); // Revert on failure
        }
    };

    const calculateStageTotal = (stageId) => {
        return deals
            .filter(d => d.stage === stageId)
            .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
    };

    const openDeal = (deal) => {
        setSelectedDeal(deal);
        setIsDealModalOpen(true);
    };

    const handleDeleteClick = (e, deal) => {
        e.stopPropagation();
        setDealToDelete(deal);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!dealToDelete) return;
        try {
            await crmService.deleteDeal(dealToDelete.id);
            setDeleteModalOpen(false);
            setDealToDelete(null);
            loadData();
        } catch (error) {
            console.error("Failed to delete deal", error);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-400">Loading Pipeline...</div>;
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Sales Pipeline</h1>
                    <p className="text-slate-400">Manage opportunities and generate proposals.</p>
                </div>
                <button 
                    onClick={() => openDeal(null)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg hover:shadow-blue-500/20"
                >
                    <Plus size={18} /> New Deal
                </button>
            </div>

            <div className="flex-1 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
                <div className="flex gap-6 min-w-max h-full items-start">
                    {STAGES.map(stage => {
                        const stageDeals = deals.filter(d => d.stage === stage.id);
                        return (
                            <div 
                                key={stage.id} 
                                className="w-80 flex flex-col bg-slate-900/50 rounded-xl border border-slate-800 h-full max-h-[80vh] overflow-hidden"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, stage.id)}
                            >
                                {/* Column Header */}
                                <div className={`p-4 border-b border-slate-800 border-t-4 ${stage.color} rounded-t-xl bg-slate-900`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className={`font-bold ${stage.text}`}>{stage.label}</h3>
                                        <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full font-bold">
                                            {stageDeals.length}
                                        </span>
                                    </div>
                                    <div className="text-white font-mono font-bold text-lg">
                                        ${calculateStageTotal(stage.id).toLocaleString()}
                                    </div>
                                </div>

                                {/* Cards */}
                                <div className="p-3 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
                                    {stageDeals.map(deal => (
                                        <div 
                                            key={deal.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, deal.id)}
                                            onClick={() => openDeal(deal)}
                                            className="bg-slate-800 border border-slate-700 hover:border-blue-500/50 p-4 rounded-lg cursor-grab active:cursor-grabbing hover:shadow-lg hover:shadow-blue-500/10 transition-all group relative"
                                        >
                                            <div className="flex justify-between items-start mb-2 pr-6">
                                                <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                                                    {deal.title}
                                                </h4>
                                                <button
                                                    onClick={(e) => handleDeleteClick(e, deal)}
                                                    className="absolute top-3 right-3 text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            
                                            <div className="text-emerald-400 font-bold font-mono mb-3 flex items-center">
                                                <DollarSign size={14} />
                                                {parseFloat(deal.amount || 0).toLocaleString()}
                                            </div>

                                            <div className="space-y-2 text-xs">
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <User size={14} className="text-slate-500" />
                                                    <span className="truncate">
                                                        {clients.find(c => c.id === deal.client)?.name || `Client #${deal.client}`}
                                                    </span>
                                                </div>
                                                {deal.expected_close_date && (
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Calendar size={14} className="text-slate-500" />
                                                        <span>{new Date(deal.expected_close_date).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {isDealModalOpen && (
                <DealModal 
                    isOpen={isDealModalOpen}
                    onClose={() => setIsDealModalOpen(false)}
                    deal={selectedDeal}
                    onSave={() => {
                        setIsDealModalOpen(false);
                        loadData();
                    }}
                />
            )}

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Deal"
                message={`Are you sure you want to delete "${dealToDelete?.title}"?`}
            />
        </div>
    );
}
