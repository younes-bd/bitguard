import React, { useState, useEffect } from 'react';
import { Plus, Package, CheckCircle, Clock, Truck } from 'lucide-react';
import scmService from '../../../core/api/scmService';
import GenericModal from '../../../core/components/shared/forms/GenericModal';

const statusBadge = (status) => {
    const map = {
        draft: 'bg-slate-700 text-slate-300',
        sent: 'bg-blue-500/10 text-blue-400',
        confirmed: 'bg-indigo-500/10 text-indigo-400',
        received: 'bg-emerald-500/10 text-emerald-400',
        cancelled: 'bg-red-500/10 text-red-400',
    };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>{status}</span>;
};

const PurchaseOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchOrders = () => {
        setLoading(true);
        Promise.all([
            scmService.getPurchaseOrders().catch(() => []),
            scmService.getVendors ? scmService.getVendors().catch(() => []) : Promise.resolve([])
        ]).then(([d, vData]) => {
            setOrders(d?.results ?? d ?? []);
            setVendors(vData?.results ?? vData ?? []);
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleReceive = async (id) => {
        await scmService.receivePurchaseOrder(id);
        fetchOrders();
    };

    const handleCreate = async (formData) => {
        setActionLoading(true);
        try {
            await scmService.createPurchaseOrder(formData);
            setIsModalOpen(false);
            fetchOrders();
        } catch (error) {
            alert('Failed to create purchase order');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const PO_FIELDS = [
        { name: 'vendor_id', label: 'Vendor', type: 'select', required: true, options: vendors.map(v => ({ value: v.id, label: v.name })) },
        { name: 'notes', label: 'Notes', type: 'textarea' },
        { name: 'total_amount', label: 'Total Amount ($)', type: 'number', step: '0.01' }
    ];

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Purchase Orders</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{orders.length} orders</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={16} /><span>New PO</span>
                </button>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {['PO #', 'Vendor', 'Items', 'Total', 'Order Date', 'Status', 'Actions'].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="py-16 text-center text-slate-500">Loading purchase orders...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan={7} className="py-16 text-center text-slate-500">No purchase orders yet</td></tr>
                        ) : orders.map(po => (
                            <tr key={po.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                                <td className="px-5 py-4 text-slate-300 font-mono">#{po.id}</td>
                                <td className="px-5 py-4 text-white font-medium">{po.vendor?.name ?? po.vendor ?? '—'}</td>
                                <td className="px-5 py-4 text-slate-400">{po.lines?.length ?? po.item_count ?? '—'} items</td>
                                <td className="px-5 py-4 text-emerald-400 font-semibold">${Number(po.total_amount ?? 0).toFixed(2)}</td>
                                <td className="px-5 py-4 text-slate-400">{po.created_at?.split('T')[0] ?? '—'}</td>
                                <td className="px-5 py-4">{statusBadge(po.status)}</td>
                                <td className="px-5 py-4">
                                    {(po.status === 'confirmed' || po.status === 'sent') && (
                                        <button onClick={() => handleReceive(po.id)}
                                            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                                            <CheckCircle size={13} /> Mark Received
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Purchase Order"
                fields={PO_FIELDS}
                onSubmit={handleCreate}
                loading={actionLoading}
            />
        </div>
    );
};

export default PurchaseOrderList;
