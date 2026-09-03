import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { crmService } from '../../api/crmService';
import { projectsService } from '../../../projects/api/projectsService';
import { signService } from '../../../sign/api/signService';
import { subscriptionsService } from '../../../subscriptions/api/subscriptionsService';
import { usersService } from '../../../users/api/usersService';
import {
    ArrowLeft, Users, Briefcase, MapPin, Mail, Phone,
    Globe, FileText, Ticket, ShoppingCart, Activity, Edit, Trash2, Printer,
    Server, Layout as ProjectIcon, ShieldCheck as ContractIcon, Receipt as InvoiceIcon, Cloud as CloudIcon
} from 'lucide-react';
import ActivityTimeline from '../dashboards/ActivityTimeline';
import ClientModal from '../modals/ClientModal';
import DeleteConfirmationModal from '@/core/components/shared/core/DeleteConfirmationModal';

const ClientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Core state
    const [client, setClient] = useState(null);
    const [orders, setOrders] = useState([]);
    const [interactions, setInteractions] = useState([]);
    const [projects, setProjects] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [tenants, setTenants] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const loadClientData = async () => {
        try {
            const [
                clientData, ordersData, interactionsData,
                projectsData, contractsData, invoicesData, tenantsData
            ] = await Promise.all([
                crmService.getClient(id),
                crmService.getClientOrders(id).catch(() => []),
                crmService.getActivities({ client: id }).catch(() => []),
                projectsService.getProjects({ client: id }).catch(() => []),
                signService.getContracts({ client: id }).catch(() => []),
                subscriptionsService.getInvoices({ client: id }).catch(() => []),
                usersService.getTenants({ client: id }).catch(() => [])
            ]);
            
            setClient(clientData);
            setOrders(Array.isArray(ordersData) ? ordersData : []);
            setInteractions(Array.isArray(interactionsData) ? interactionsData : interactionsData?.results || []);
            setProjects(Array.isArray(projectsData) ? projectsData : projectsData?.results || []);
            setContracts(Array.isArray(contractsData) ? contractsData : contractsData?.results || []);
            setInvoices(Array.isArray(invoicesData) ? invoicesData : invoicesData?.results || []);
            setTenants(Array.isArray(tenantsData) ? tenantsData : tenantsData?.results || []);
        } catch (error) {
            console.error("Failed to load client data", error);
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
            loadClientData();
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update client.");
        }
    };

    const handlePrint = async () => {
        try {
            const { default: reportingService } = await import('@/apps/reporting/api/reportingService');
            const res = await reportingService.generateReport(null, 'crm.Client', id);
            if (res && res.url) {
                const response = await fetch(res.url);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = res.filename || 'statement.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (err) {
            console.error(err);
            import('react-hot-toast').then(({ toast }) => toast.error('Failed to generate PDF'));
        }
    };

    const handleDeleteClient = async () => {
        try {
            await crmService.deleteClient(id);
            navigate('/admin/crm/clients');
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
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === id
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
        >
            <Icon size={16} />
            {label}
        </button>
    );

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate('/admin/crm/clients')}
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
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-600"
                                    title="Print Client Statement"
                                >
                                    <Printer size={18} />
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

            {/* Navigation Tabs - Scrollable on mobile */}
            <div className="overflow-x-auto border-b border-slate-700/50">
                <div className="flex">
                    <TabButton id="overview" label="Overview" icon={FileText} />
                    <TabButton id="workspaces" label={`Workspaces (${tenants.length})`} icon={CloudIcon} />
                    <TabButton id="projects" label={`Projects (${projects.length})`} icon={ProjectIcon} />
                    <TabButton id="contracts" label={`Contracts (${contracts.length})`} icon={ContractIcon} />
                    <TabButton id="invoices" label={`Invoices (${invoices.length})`} icon={InvoiceIcon} />
                    <TabButton id="orders" label="Store Orders" icon={ShoppingCart} />
                    <TabButton id="maintenance" label="Assets" icon={Server} />
                    <TabButton id="timeline" label="Timeline" icon={Activity} />
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="glass-panel p-6 rounded-xl border border-slate-700/50 lg:col-span-2">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                                <Activity size={20} className="text-blue-400" />
                                Recent Activity
                            </h3>
                            <ActivityTimeline
                                clientId={id}
                                interactions={interactions.slice(0, 5)}
                                onActivityAdded={loadClientData}
                            />
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
                                {client.recent_tickets && client.recent_tickets.length > 0 ? client.recent_tickets.map(t => (
                                    <div key={t.id} className="text-white text-sm pb-2 border-b border-white/5 last:border-0">{t.summary}</div>
                                )) : (
                                    <div className="text-slate-500 text-sm">No recent tickets.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* WORKSPACES TAB */}
                {activeTab === 'workspaces' && (
                    <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <CloudIcon size={20} className="text-blue-400" />
                                Cloud Workspaces & Tenants
                            </h3>
                            <button onClick={() => navigate('/admin/users/tenants')} className="text-sm text-blue-400 hover:underline">Manage â†’</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tenants.map(tenant => (
                                <div key={tenant.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:border-blue-500/30 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-lg text-white group-hover:text-blue-400">{tenant.name}</h4>
                                            <p className="text-slate-400 text-sm mt-1">{tenant.domain}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${tenant.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {tenant.is_active ? 'Active' : 'Suspended'}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {tenant.allowed_modules && tenant.allowed_modules.map((mod, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded border border-slate-600">
                                                {mod}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center">
                                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Plan: <span className="text-white">{tenant.subscription_plan}</span></span>
                                        <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">View Console â†’</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {tenants.length === 0 && (
                            <div className="text-center py-12 text-slate-500 border border-dashed border-slate-700 rounded-xl">
                                No active cloud workspaces found for this client.
                            </div>
                        )}
                    </div>
                )}

                {/* PROJECTS TAB */}
                {activeTab === 'projects' && (
                    <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                        <h3 className="text-xl font-bold text-white mb-6">Client Projects</h3>
                        <div className="space-y-4">
                            {projects.map(project => (
                                <div key={project.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:border-blue-500/30 transition-all cursor-pointer" onClick={() => navigate(`/admin/projects/${project.id}`)}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-lg text-white group-hover:text-blue-400">{project.name}</h4>
                                            <p className="text-slate-400 text-sm mt-1">{project.description || 'No description provided.'}</p>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-500/10 text-blue-400">
                                            {project.status}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex gap-4 text-xs text-slate-500 font-mono">
                                        <span>Start: {new Date(project.start_date).toLocaleDateString()}</span>
                                        {project.end_date && <span>Due: {new Date(project.end_date).toLocaleDateString()}</span>}
                                    </div>
                                </div>
                            ))}
                            {projects.length === 0 && (
                                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-700 rounded-xl">
                                    No projects associated with this client.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* CONTRACTS TAB */}
                {activeTab === 'contracts' && (
                    <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Service Contracts</h3>
                            <button onClick={() => navigate('/admin/sign')} className="text-sm text-blue-400 hover:underline">Manage â†’</button>
                        </div>
                        <div className="space-y-4">
                            {contracts.map(contract => (
                                <div key={contract.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-white">{contract.name || contract.title || `Contract #${contract.id}`}</h4>
                                        <div className="text-sm text-slate-400 mt-1">
                                            {new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="px-3 py-1 rounded text-xs font-bold uppercase bg-emerald-500/10 text-emerald-400 block mb-2">
                                            {contract.status || 'Active'}
                                        </span>
                                        <div className="text-white font-bold">${contract.value || contract.amount || '0.00'}</div>
                                    </div>
                                </div>
                            ))}
                            {contracts.length === 0 && (
                                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-700 rounded-xl">
                                    No active contracts found.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* INVOICES TAB */}
                {activeTab === 'invoices' && (
                    <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                        <h3 className="text-xl font-bold text-white mb-6">Billing & Invoices</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-slate-400 border-b border-slate-700/50 text-sm uppercase">
                                        <th className="py-3 px-4 font-bold">Invoice #</th>
                                        <th className="py-3 px-4 font-bold">Date</th>
                                        <th className="py-3 px-4 font-bold">Amount</th>
                                        <th className="py-3 px-4 font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-300">
                                    {invoices.map(inv => (
                                        <tr key={inv.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => navigate(`/admin/billing/invoices/${inv.id}`)}>
                                            <td className="py-3 px-4 text-blue-400 font-mono">{inv.invoice_number || `#${inv.id}`}</td>
                                            <td className="py-3 px-4 text-sm">{new Date(inv.created_at || inv.date).toLocaleDateString()}</td>
                                            <td className="py-3 px-4 font-bold text-white">${inv.amount || inv.total}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {invoices.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-slate-500 italic">No invoices found for this client.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                    <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                        <h3 className="text-xl font-bold text-white mb-6">Store Purchases</h3>
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
                                            <td className="py-3 px-4 font-bold text-white">{order.product_name || 'Software License'}</td>
                                            <td className="py-3 px-4 text-emerald-400 font-mono">${order.amount || order.total}</td>
                                            <td className="py-3 px-4">
                                                <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-emerald-500/10 text-emerald-400">
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-slate-500 italic">No store orders found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ASSETS TAB */}
                {activeTab === 'maintenance' && (
                    <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Server size={20} className="text-blue-400" />
                                Managed Infrastructure
                            </h3>
                            <button 
                                onClick={() => navigate('/admin/maintenance/assets')}
                                className="text-sm text-blue-400 hover:text-blue-300"
                            >
                                Manage in ITAM â†’
                            </button>
                        </div>
                        <div className="p-8 text-center bg-slate-900/40 rounded-lg border border-dashed border-slate-700">
                             <p className="text-slate-400 italic">Integration with Asset Management (ITAM) module to display hardware and licenses.</p>
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

