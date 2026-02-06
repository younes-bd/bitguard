import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Building2,
    MapPin,
    Globe,
    Phone,
    Mail,
    ShieldCheck,
    Server,
    Ticket,
    FileText,
    ShoppingBag,
    MoreVertical,
    Key,
    Package,
    Calendar,
    Search
} from 'lucide-react';
import { storeService } from '../../../shared/core/services/storeService';

const ClientTab = ({ label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${isActive
            ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
    >
        <Icon className="h-4 w-4" />
        {label}
    </button>
);

const ClientOverview = () => (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Contact Info</h3>
            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <MapPin className="h-4 w-4" />
                    <span>123 Innovation Dr, Tech City, CA</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Globe className="h-4 w-4" />
                    <a href="#" className="text-blue-600 hover:underline">techcorp.com</a>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Phone className="h-4 w-4" />
                    <span>+1 (555) 012-3499</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Mail className="h-4 w-4" />
                    <span>admin@techcorp.com</span>
                </div>
            </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Account Status</h3>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm text-slate-500">Plan</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">Enterprise (Annual)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm text-slate-500">Review Date</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">Oct 24, 2024</span>
            </div>
            <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-500">Manager</span>
                <span className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
                    <div className="h-5 w-5 rounded-full bg-slate-200"></div>
                    Alice Smith
                </span>
            </div>
        </div>
    </div>
);

// --- Active Assets Tab (Combined Licenses & Hardware) ---
const AssetsTab = () => {
    const [loading, setLoading] = useState(true);
    const [licenses, setLicenses] = useState([]);
    // Mock hardware since API doesn't separate it distinctly yet, or assume products with type='physical'
    const [hardware, setHardware] = useState([
        { id: 1, name: 'Dell Latitude 5540', serial: '8H29-XJ22', assigned_to: 'John Doe', status: 'Active' },
        { id: 2, name: 'Cisco Meraki MX68', serial: 'Q2KD-99A1', assigned_to: 'Office Main', status: 'Online' },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const licRes = await storeService.getLicenses();
                // Filter only active licenses if needed
                setLicenses(licRes || []);
            } catch (err) {
                console.error("Failed to fetch assets", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading assets...</div>;

    return (
        <div className="space-y-8">
            {/* Digital Assets (Licenses) */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Key className="text-amber-500" size={20} /> Digital Licenses
                </h3>
                {licenses.length === 0 ? (
                    <div className="p-6 bg-slate-900/50 rounded-xl border border-dashed border-slate-800 text-center text-slate-500">
                        No active licenses found.
                    </div>
                ) : (
                    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-950 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-3">License Key</th>
                                    <th className="px-6 py-3">Product</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Expires</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {licenses.map((lic) => (
                                    <tr key={lic.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-mono text-slate-300">{lic.key}</td>
                                        <td className="px-6 py-4 text-white font-medium">{lic.product_name || 'Software License'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${lic.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                                }`}>
                                                {lic.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">Lifetime</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Hardware Assets */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Server className="text-blue-500" size={20} /> Hardware Assets
                </h3>
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3">Device Name</th>
                                <th className="px-6 py-3">Serial Number</th>
                                <th className="px-6 py-3">Assigned To</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {hardware.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                                    <td className="px-6 py-4 font-mono">{item.serial}</td>
                                    <td className="px-6 py-4">{item.assigned_to}</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- Order History Tab ---
const OrdersTab = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await storeService.getOrders();
                setOrders(res || []);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading history...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Purchase History</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="p-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-800 text-center">
                    <ShoppingBag className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-white">No orders yet</h3>
                    <p className="text-slate-500 mt-2">Check out our store to find products for your business.</p>
                </div>
            ) : (
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-blue-400">#{order.id.toString().padStart(6, '0')}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white">
                                        {/* Simple assumption of item naming, adjust based on actual API */}
                                        {order.items?.length || 1} Products
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white">${parseFloat(order.total_amount || 0).toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                            order.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                                                'bg-slate-700 text-slate-300'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-lg">
                                            <FileText size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Placeholder components for other tabs
const PlaceholderTab = ({ title }) => (
    <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
        <p className="text-slate-500">{title} module content goes here</p>
    </div>
);

const ClientProfile = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('Overview');

    const tabs = [
        { id: 'Overview', icon: Building2 },
        { id: 'Assets', icon: Server },
        { id: 'SOC Status', icon: ShieldCheck },
        { id: 'Tickets', icon: Ticket },
        { id: 'Invoices', icon: FileText },
        { id: 'Store Orders', icon: ShoppingBag },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl font-bold text-white shadow-lg">
                        TC
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">TechCorp Solutions</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">ID: {id || 'CL-49292'} • Active since 2022</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                        Message
                    </button>
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Edit Profile
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600">
                        <MoreVertical className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-800">
                <div className="flex gap-2 overflow-x-auto">
                    {tabs.map((tab) => (
                        <ClientTab
                            key={tab.id}
                            label={tab.id}
                            icon={tab.icon}
                            isActive={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="animate-in fade-in duration-300">
                {activeTab === 'Overview' && <ClientOverview />}
                {activeTab === 'Assets' && <AssetsTab />}
                {activeTab === 'SOC Status' && <PlaceholderTab title="SOC Status" />}
                {activeTab === 'Tickets' && <PlaceholderTab title="Support Tickets" />}
                {activeTab === 'Invoices' && <PlaceholderTab title="Invoices & Payments" />}
                {activeTab === 'Store Orders' && <OrdersTab />}
            </div>
        </div>
    );
};

export default ClientProfile;
