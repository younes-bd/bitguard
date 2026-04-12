import React, { useState, useEffect } from 'react';
import { Search, Plus, Globe, Phone, Mail, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import scmService from '../../../core/api/scmService';
import GenericModal from '../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../core/components/shared/core/DeleteConfirmationModal';

const VendorList = () => {
    const [vendors, setVendors] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        scmService.getVendors({ search }).then(d => {
            setVendors(d?.results ?? d ?? []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [search]);

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (selectedVendor) {
                await scmService.updateVendor(selectedVendor.id, formData);
            } else {
                await scmService.createVendor(formData);
            }
            setIsModalOpen(false);
            const data = await scmService.getVendors({ search });
            setVendors(data?.results ?? data ?? []);
        } catch (error) {
            alert('Failed to save vendor');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedVendor) return;
        setActionLoading(true);
        try {
            await scmService.deleteVendor(selectedVendor.id);
            setIsDeleteModalOpen(false);
            const data = await scmService.getVendors({ search });
            setVendors(data?.results ?? data ?? []);
        } catch (error) {
            alert('Failed to delete vendor');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const VENDOR_FIELDS = [
        { name: 'name', label: 'Vendor Name', required: true },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Phone' },
        { name: 'website', label: 'Website' },
        { name: 'category', label: 'Category' },
        { name: 'is_active', label: 'Active Status', type: 'toggle', default: true }
    ];

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Vendors</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{vendors.length} suppliers</p>
                </div>
                <button onClick={() => { setSelectedVendor(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={16} /><span>Add Vendor</span>
                </button>
            </div>
            <div className="relative max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search vendors..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-3 text-center py-16 text-slate-500">Loading vendors...</div>
                ) : vendors.length === 0 ? (
                    <div className="col-span-3 text-center py-16 text-slate-500">No vendors found</div>
                ) : vendors.map(vendor => (
                    <div key={vendor.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-orange-500/30 transition-colors group relative">
                        <div className="absolute top-2 right-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedVendor(vendor); setIsModalOpen(true); }}
                                className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                            >
                                <Edit2 size={14} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedVendor(vendor); setIsDeleteModalOpen(true); }}
                                className="p-1.5 bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <div className="flex items-start justify-between mb-3 mt-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 font-bold text-sm">
                                {(vendor.name?.[0] ?? 'V').toUpperCase()}
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${vendor.is_active !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                {vendor.is_active !== false ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <p className="text-white font-semibold">{vendor.name}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{vendor.category ?? vendor.type ?? 'Supplier'}</p>
                        <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                            {vendor.email && <div className="flex items-center gap-2"><Mail size={11} />{vendor.email}</div>}
                            {vendor.phone && <div className="flex items-center gap-2"><Phone size={11} />{vendor.phone}</div>}
                            {vendor.website && <div className="flex items-center gap-2"><Globe size={11} />{vendor.website}</div>}
                        </div>
                    </div>
                ))}
            </div>

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Vendor"
                fields={VENDOR_FIELDS}
                initialData={selectedVendor}
                onSubmit={handleSave}
                loading={actionLoading}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Vendor"
                message={`Are you sure you want to delete ${selectedVendor?.name}?`}
                loading={actionLoading}
            />
        </div>
    );
};

export default VendorList;
