import React, { useState, useEffect } from 'react';
import { storeService } from '../../../shared/core/services/storeService';
import { Users, Mail, Phone, Calendar, MoreHorizontal, X } from 'lucide-react';

import CreateClientModal from '../components/CreateClientModal';

const StoreCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await storeService.getSubscriptions();
            if (data && data.length > 0) {
                setCustomers(data);
            }
        } catch (error) {
            console.error("Failed to load customers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveClient = async (clientData) => {
        setIsCreating(true);
        try {
            const payload = {
                user: clientData.user_id,
                plan: clientData.plan_id,
                status: clientData.status
            };

            if (editingClient) {
                await storeService.updateSubscription(editingClient.id, payload);
            } else {
                await storeService.createSubscription(payload);
            }

            setIsModalOpen(false);
            setEditingClient(null);
            loadCustomers();
        } catch (error) {
            console.error("Failed to save client", error);
            alert("Failed to save client.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleEditClick = (client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (clientId) => {
        if (!window.confirm("Are you sure you want to cancel/delete this subscription?")) return;
        try {
            await storeService.cancelSubscription(clientId);
            loadCustomers();
        } catch (error) {
            console.error("Failed to delete client", error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingClient(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Customers</h1>
                    <p className="text-slate-400">View and manage your client base.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">Export CSV</button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                    >
                        Add Client
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map(customer => (
                    <div key={customer.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                                {customer.name ? customer.name.charAt(0) : 'U'}
                            </div>
                            <div className="flex gap-2">
                                <button className="text-slate-500 hover:text-white" onClick={() => handleEditClick(customer)}>
                                    <MoreHorizontal size={20} />
                                </button>
                                <button className="text-slate-500 hover:text-red-400" onClick={() => handleDeleteClick(customer.id)}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1">{customer.name || `User #${customer.user}`}</h3>
                        <p className="text-sm text-slate-400 mb-4">{customer.company || 'Individual'}</p>

                        <div className="space-y-3 pt-4 border-t border-slate-800">
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <Mail size={16} className="text-slate-500" />
                                <span className="truncate">{customer.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <Calendar size={16} className="text-slate-500" />
                                <span className={customer.status === 'active' ? 'text-emerald-400' : 'text-amber-400'}>
                                    {customer.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <CreateClientModal
                    initialData={editingClient}
                    onClose={handleCloseModal}
                    onSave={handleSaveClient}
                    loading={isCreating}
                />
            )}
        </div>
    );
};

export default StoreCustomers;
