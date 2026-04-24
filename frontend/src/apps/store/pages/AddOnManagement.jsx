import React, { useState, useEffect } from 'react';
import { Blocks, Search, Plus, Loader2, Edit2, Trash2 } from 'lucide-react';
import client from '../../../core/api/client';
import GenericModal from '../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../core/components/shared/core/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const ADDON_FIELDS = [
    { name: 'name', label: 'Integration Name', required: true },
    { name: 'provider', label: 'Provider (e.g. Stripe, Mailchimp)', required: true },
    { name: 'is_enabled', label: 'Enabled', type: 'toggle' },
    { name: 'api_key', label: 'API Key', type: 'password' },
    { name: 'description', label: 'Description', type: 'textarea', rows: 2 }
];

export default function AddOnManagement() {
    const [addons, setAddons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchAddons();
    }, []);

    const fetchAddons = async () => {
        setLoading(true);
        try {
            const res = await client.get('store/addons/');
            setAddons(res.data.results || res.data || []);
        } catch (error) {
            console.error("Failed to fetch addons:", error);
            toast.error('Failed to fetch integrations');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (selectedItem) {
                await client.patch(`store/addons/${selectedItem.id}/`, formData);
                toast.success('Integration updated');
            } else {
                await client.post('store/addons/', formData);
                toast.success('Integration added');
            }
            setIsModalOpen(false);
            setSelectedItem(null);
            fetchAddons();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save integration');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await client.delete(`store/addons/${selectedItem.id}/`);
            toast.success('Integration removed');
            setIsDeleteModalOpen(false);
            setSelectedItem(null);
            fetchAddons();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete integration');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Blocks className="text-orange-400" /> Vendor Integrations
                </h1>
                <button 
                    onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> Link Provider
                </button>
            </div>
            
            {loading ? (
                <div className="py-20 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-orange-500" />
                    Scanning installed gateways...
                </div>
            ) : addons.length === 0 ? (
                <div className="py-20 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center">
                    <Blocks size={48} className="mb-4 text-slate-700" />
                    No third-party SaaS integrations configured for this storefront.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {addons.map(addon => (
                        <div key={addon.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-orange-500/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1">{addon.name}</h3>
                                    <p className="text-sm text-slate-400 font-mono flex items-center break-all">{addon.provider}</p>
                                </div>
                                <div className={`px-2 py-1 flex-shrink-0 rounded text-xs font-bold uppercase ${addon.is_enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                    {addon.is_enabled ? 'Active' : 'Disabled'}
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-800/50 flex justify-end gap-3">
                                <button onClick={() => { setSelectedItem(addon); setIsDeleteModalOpen(true); }} className="text-sm text-rose-400/70 hover:text-rose-400 transition-colors flex items-center gap-1"><Trash2 size={14} /></button>
                                <button onClick={() => { setSelectedItem(addon); setIsModalOpen(true); }} className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1"><Edit2 size={14} /> Configure</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedItem(null); }}
                title={selectedItem ? "Configure Integration" : "Link Provider"}
                fields={ADDON_FIELDS}
                initialData={selectedItem}
                onSubmit={handleSave}
                loading={actionLoading}
            />
            
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setSelectedItem(null); }}
                onConfirm={handleDelete}
                loading={actionLoading}
                title="Delete Integration"
                message={`Are you sure you want to delete "${selectedItem?.name}"?`}
            />
        </div>
    );
}
