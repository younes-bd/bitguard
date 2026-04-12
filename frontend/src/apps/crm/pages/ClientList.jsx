import React, { useEffect, useState } from 'react';
import { crmService } from '../../../core/api/crmService';
import { contractsService } from '../../../core/api/contractsService';
import supportService from '../../../core/api/supportService';
import { Users, Search, Filter, Briefcase, MapPin, ExternalLink, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GenericModal from '../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../core/components/shared/core/DeleteConfirmationModal';

const ClientList = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ contracts: 0, tickets: 0 });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [clientsData, contractsData, ticketsData] = await Promise.all([
                    crmService.getClients(),
                    contractsService.getContracts(),
                    supportService.getTickets()
                ]);
                setClients(Array.isArray(clientsData) ? clientsData : clientsData.results || []);
                setStats({
                    contracts: contractsData.count || (Array.isArray(contractsData) ? contractsData.length : 0),
                    tickets: ticketsData.count || (Array.isArray(ticketsData) ? ticketsData.length : 0)
                });
            } catch (error) {
                console.error("Fetch Data Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchOnlyClients = async () => {
        try {
            const data = await crmService.getClients();
            setClients(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (selectedClient) {
                await crmService.updateClient(selectedClient.id, formData);
            }
            setIsEditModalOpen(false);
            await fetchOnlyClients();
        } catch (error) {
            alert('Failed to update client');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedClient) return;
        setActionLoading(true);
        try {
            await crmService.deleteClient(selectedClient.id);
            setIsDeleteModalOpen(false);
            await fetchOnlyClients();
        } catch (error) {
            alert('Failed to delete client');
        } finally {
            setActionLoading(false);
        }
    };

    const CLIENT_FIELDS = [
        { name: 'name', label: 'Company Name', required: true },
        { name: 'industry', label: 'Industry', placeholder: 'e.g. Technology' },
        { name: 'contact_email', label: 'Contact Email', type: 'email', required: true },
        { name: 'address', label: 'Business Address', type: 'textarea' },
        { name: 'status', label: 'Status', type: 'select', options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }
        ], default: 'active' }
    ];

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Users className="text-blue-400" size={32} />
                        Client Management
                    </h1>
                    <p className="text-slate-400">Manage customer relationships and profiles.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/crm/clients/create')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all"
                >
                    Add Client
                </button>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="text-slate-400 text-sm mb-1 uppercase font-bold">Total Clients</div>
                    <div className="text-3xl font-bold text-white">{clients.length}</div>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="text-slate-400 text-sm mb-1 uppercase font-bold">Active Contracts</div>
                    <div className="text-3xl font-bold text-emerald-400">{stats.contracts}</div>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                    <div className="text-slate-400 text-sm mb-1 uppercase font-bold">Pending Tickets</div>
                    <div className="text-3xl font-bold text-yellow-400">{stats.tickets}</div>
                </div>
            </div>

            {/* Client Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {clients.map(client => (
                    <div
                        key={client.id}
                        onClick={() => navigate(`/admin/crm/clients/${client.id}`)}
                        className="glass-panel p-6 rounded-xl border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-800/80 transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                    {client.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{client.name}</h3>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                                        <Briefcase size={12} />
                                        <span>{client.industry || 'Tech'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedClient(client); setIsEditModalOpen(true); }}
                                    className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedClient(client); setIsDeleteModalOpen(true); }}
                                    className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <ExternalLink size={18} className="text-slate-600 group-hover:text-blue-400 transition-colors ml-2" />
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <MapPin size={14} className="text-slate-500" />
                                <span>{client.address && client.address.length > 20 ? client.address.substring(0, 20) + '...' : client.address || 'No Address'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Users size={14} className="text-slate-500" />
                                <span>{client.contact_email}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-700/50 pt-4 mt-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${client.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                {client.status || 'Active'}
                            </span>
                            <span className="text-xs text-slate-500">Joined {new Date(client.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
                {clients.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        No clients found. Start by adding one.
                    </div>
                )}
            </div>

            <GenericModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Client"
                fields={CLIENT_FIELDS}
                initialData={selectedClient}
                onSubmit={handleSave}
                loading={actionLoading}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Client"
                message={`Are you sure you want to delete ${selectedClient?.name}? All associated data will be removed.`}
                loading={actionLoading}
            />
        </div>
    );
};

export default ClientList;
