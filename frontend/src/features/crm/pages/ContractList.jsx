import React, { useEffect, useState } from 'react';
import { crmService } from '../../../shared/core/services/crmService';
import {
    FileText, Search, Filter, Calendar, DollarSign, CheckCircle, AlertTriangle, Plus, Edit, Trash2
} from 'lucide-react';
import ContractModal from './ContractModal';
import DeleteConfirmationModal from '../../../shared/core/components/DeleteConfirmationModal';

const ContractList = () => {
    const [contracts, setContracts] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContract, setEditingContract] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [contractToDelete, setContractToDelete] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [contractsData, clientsData] = await Promise.all([
                crmService.getContracts(),
                crmService.getClients()
            ]);
            setContracts(Array.isArray(contractsData) ? contractsData : contractsData.results || []);
            setClients(Array.isArray(clientsData) ? clientsData : clientsData.results || []);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'expired': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    // CRUD Handlers
    const handleSaveContract = async (formData) => {
        try {
            if (editingContract) {
                await crmService.updateContract(editingContract.id, formData);
            } else {
                await crmService.createContract(formData);
            }
            setIsModalOpen(false);
            setEditingContract(null);
            loadData();
        } catch (error) {
            console.error("Failed to save contract", error);
            alert("Failed to save contract.");
        }
    };

    const handleDeleteClick = (contract) => {
        setContractToDelete(contract);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!contractToDelete) return;
        try {
            await crmService.deleteContract(contractToDelete.id);
            setDeleteModalOpen(false);
            setContractToDelete(null);
            loadData();
        } catch (error) {
            console.error("Failed to delete contract", error);
            alert("Failed to delete contract.");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <FileText className="text-indigo-400" size={32} />
                        Contracts & Subscriptions
                    </h1>
                    <p className="text-slate-400">Manage client service agreements and renewals.</p>
                </div>
                <button
                    onClick={() => { setEditingContract(null); setIsModalOpen(true); }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                    <Plus size={18} />
                    New Contract
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {contracts.map(contract => (
                    <div key={contract.id} className="glass-panel p-6 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all group relative">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                    {contract.name || contract.title || 'Service Agreement'}
                                </h3>
                                <div className="text-slate-400 text-sm">
                                    {contract.client_name || clients.find(c => c.id === contract.client)?.name || 'Unknown Client'}
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${getStatusColor(contract.status)}`}>
                                {contract.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase">Start Date</div>
                                    <div className="text-white text-sm">{contract.start_date}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase">End Date</div>
                                    <div className="text-white text-sm">{contract.end_date || 'Ongoing'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                                <DollarSign size={20} />
                                <span>{contract.value ? parseFloat(contract.value).toLocaleString() : '0.00'}</span>
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => { setEditingContract(contract); setIsModalOpen(true); }}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(contract)}
                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {contracts.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                            <FileText size={32} />
                        </div>
                        <p className="text-slate-400">No active contracts.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ContractModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveContract}
                contract={editingContract}
                clients={clients}
            />

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Contract"
                message={`Are you sure you want to delete "${contractToDelete?.name}"?`}
            />
        </div>
    );
};

export default ContractList;


