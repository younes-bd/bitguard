import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { crmService } from '../../../shared/core/services/crmService';
import {
    ArrowLeft, Users, Briefcase, MapPin, Mail, Phone,
    Globe, FileText, Ticket, ShoppingCart, Activity, Edit, Trash2
} from 'lucide-react';
import ActivityTimeline from './ActivityTimeline';
import ClientModal from './ClientModal';
import DeleteConfirmationModal from '../../../shared/core/components/DeleteConfirmationModal';

const ClientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [orders, setOrders] = useState([]);
    const [interactions, setInteractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // overview, orders, timeline

    // Modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const loadClientData = async () => {
        try {
            const [clientData, ordersData, interactionsData] = await Promise.all([
                crmService.getClient(id),
                crmService.getClientOrders(id),
                crmService.getInteractions({ client: id })
            ]);
            setClient(clientData);
            setOrders(Array.isArray(ordersData) ? ordersData : []);
            setInteractions(Array.isArray(interactionsData) ? interactionsData : interactionsData.results || []);
        } catch (error) {
            console.error("Failed to load client data", error);
            if (error.response && error.response.status === 404) {
                // Handle not found
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClientData();
    }, [id]);

    const handleUpdateClient = async (formData) => {
        try {
            await crmService.updateClient(id, formData);
            setIsEditModalOpen(false);
            loadClientData(); // Refresh
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update client.");
        }
    };

    const handleDeleteClient = async () => {
        try {
            await crmService.deleteClient(id);
            navigate('/crm/clients');
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete client. They may have active orders or contracts.");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!client) return <div className="text-white text-center py-10">Client not found</div>;

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
        >
            <Icon size={16} />
            {label}
        </button>
    );

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate('/crm/clients')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={18} />
                <span>Back to Clients</span>
            </button>

            {/* Header / Profile Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Users size={120} />
                </div>

                <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                        {client.name.substring(0, 2).toUpperCase()}
                    </div>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold text-white">{client.name}</h1>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-600"
                                    title="Edit Client"
                                >
                                    <Edit size={20} />
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                                    title="Delete Client"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
                            <div className="flex items-center gap-2">
                                <Briefcase size={16} className="text-blue-400" />
                                <span>{client.industry || 'Technology'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-emerald-400" />
                                <span>{client.address || 'No Address Logged'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe size={16} className="text-purple-400" />
                                <span>{client.website || 'No Website'}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${client.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                {client.status || 'Active'}
                            </span>
                            <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-blue-500/10 text-blue-400">
                                {client.client_type || 'Company'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                            <Mail size={18} className="text-slate-400" />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 uppercase">Email</div>
                            <div className="text-white hover:text-blue-400 cursor-pointer transition-colors">
                                {client.contact_email || 'N/A'}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                            <Phone size={18} className="text-slate-400" />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 uppercase">Phone</div>
                            <div className="text-white">{client.phone || client.phone_number || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-700/50">
                <TabButton id="overview" label="Overview" icon={FileText} />
                <TabButton id="orders" label="Order History" icon={ShoppingCart} />
                <TabButton id="timeline" label="Timeline" icon={Activity} />
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Active Contracts */}
                        <div className="glass-panel p-6 rounded-xl border border-slate-700/50 lg:col-span-2">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FileText size={20} className="text-indigo-400" />
                                    Contracts & Services
                                </h3>
                                <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
                            </div>

                            <div className="space-y-4">
                                {(client.contracts || []).length > 0 ? (
                                    client.contracts.map(contract => (
                                        <div key={contract.id} className="bg-slate-800/40 rounded-lg p-4 flex justify-between items-center border border-slate-700/30">
                                            <div>
                                                <h4 className="font-bold text-white">{contract.name}</h4>
                                                <p className="text-sm text-slate-500">Expires: {new Date(contract.end_date).toLocaleDateString()}</p>
                                            </div>
                                            <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-emerald-500/10 text-emerald-400">Active</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-slate-500 italic">No active contracts found.</div>
                                )}
                            </div>
                        </div>

                        {/* Recent Tickets */}
                        <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Ticket size={20} className="text-orange-400" />
                                    Recent Tickets
                                </h3>
                            </div>
                            <div className="space-y-4">
                                {client.recent_tickets ? client.recent_tickets.map(t => (
                                    <div key={t.id} className="text-white text-sm pb-2 border-b border-white/5 last:border-0">{t.summary}</div>
                                )) : (
                                    <div className="text-slate-500 text-sm">No recent tickets.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                    <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                        <h3 className="text-xl font-bold text-white mb-6">Historical Orders</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-slate-400 border-b border-slate-700/50 text-sm uppercase">
                                        <th className="py-3 px-4 font-bold">Order #</th>
                                        <th className="py-3 px-4 font-bold">Date</th>
                                        <th className="py-3 px-4 font-bold">Product</th>
                                        <th className="py-3 px-4 font-bold">Amount</th>
                                        <th className="py-3 px-4 font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-300">
                                    {orders.map(order => (
                                        <tr key={order.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                                            <td className="py-3 px-4 text-blue-400 font-mono">#{order.id}</td>
                                            <td className="py-3 px-4 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td className="py-3 px-4 font-bold text-white">{order.product_name}</td>
                                            <td className="py-3 px-4 text-emerald-400 font-mono">${order.amount}</td>
                                            <td className="py-3 px-4">
                                                <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-emerald-500/10 text-emerald-400">
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-slate-500 italic">No orders found for this client.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TIMELINE TAB */}
                {activeTab === 'timeline' && (
                    <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                        <ActivityTimeline
                            clientId={id}
                            interactions={interactions}
                            onActivityAdded={loadClientData}
                        />
                    </div>
                )}
            </div>

            {/* Modals */}
            <ClientModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleUpdateClient}
                client={client}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteClient}
                title="Delete Client"
                message={`Are you sure you want to delete "${client.name}"? This will also remove related deals and logs.`}
            />
        </div>
    );
};

export default ClientDetail;


