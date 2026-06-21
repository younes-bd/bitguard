import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Monitor, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import assetService from '../../api/assetService';
import GenericModal from '../../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../../core/components/shared/core/DeleteConfirmationModal';

const TYPE_OPTIONS = ['', 'laptop', 'desktop', 'server', 'network', 'mobile', 'printer', 'software', 'cloud', 'other'];
const STATUS_OPTIONS = ['', 'active', 'spare', 'maintenance', 'retired', 'lost'];

const typeIcons = {
    laptop: 'ðŸ’»', desktop: 'ðŸ–¥ï¸', server: 'ðŸ—„ï¸', network: 'ðŸŒ',
    mobile: 'ðŸ“±', printer: 'ðŸ–¨ï¸', software: 'ðŸ“¦', cloud: 'â˜ï¸', other: 'ðŸ“Œ',
};

const statusBadge = (status) => {
    const map = {
        active: 'bg-emerald-500/10 text-emerald-400', spare: 'bg-blue-500/10 text-blue-400',
        maintenance: 'bg-amber-500/10 text-amber-400', retired: 'bg-slate-700 text-slate-400', lost: 'bg-red-500/10 text-red-400',
    };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>{status?.replace('_', ' ')}</span>;
};

const ASSET_FIELDS = [
    { name: 'name', label: 'Asset Name', required: true },
    { name: 'asset_tag', label: 'Asset Tag', required: true },
    { name: 'asset_type', label: 'Asset Type', type: 'select', options: TYPE_OPTIONS.filter(Boolean).map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) })), required: true },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS.filter(Boolean).map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) })), default: 'spare' },
    { name: 'make', label: 'Make/Manufacturer' },
    { name: 'model', label: 'Model' },
    { name: 'serial_number', label: 'Serial Number' },
    { name: 'purchase_date', label: 'Purchase Date', type: 'date' },
    { name: 'purchase_cost', label: 'Purchase Cost', type: 'number', step: '0.01' },
    { name: 'warranty_expires', label: 'Warranty Expiry', type: 'date' },
    { name: 'location', label: 'Location' },
    { name: 'notes', label: 'Lifecycle Notes', type: 'textarea' }
];

const AssetList = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    
    // CRUD State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchAssets = () => {
        setLoading(true);
        assetService.getAssets({ type: typeFilter || undefined, status: statusFilter || undefined })
            .then(r => { setAssets(r.results ?? r ?? []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchAssets();
    }, [typeFilter, statusFilter]);

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (selectedAsset) {
                await assetService.updateAsset(selectedAsset.id, formData);
            } else {
                await assetService.createAsset(formData);
            }
            setIsModalOpen(false);
            fetchAssets();
        } catch (error) {
            console.error(error);
            alert('Failed to save asset.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedAsset) return;
        setActionLoading(true);
        try {
            await assetService.deleteAsset(selectedAsset.id);
            setIsDeleteModalOpen(false);
            fetchAssets();
        } catch (error) {
            console.error(error);
            alert('Failed to delete asset.');
        } finally {
            setActionLoading(false);
        }
    };

    const filtered = assets.filter(a =>
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.asset_tag?.toLowerCase().includes(search.toLowerCase()) ||
        a.client_name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-8 space-y-6 animate-in fade-in duration-400">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase">All Assets</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{assets.length} assets registered</p>
                </div>
                <button 
                    onClick={() => { setSelectedAsset(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-teal-500/20"
                >
                    <Plus size={16} /> Add Asset
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search by name, tag, client..." value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-sm" />
                </div>
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40">
                    <option value="">All Types</option>
                    {TYPE_OPTIONS.filter(Boolean).map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40">
                    <option value="">All Status</option>
                    {STATUS_OPTIONS.filter(Boolean).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/50">
                            {['Asset', 'Tag', 'Type', 'Client', 'Status', 'Warranty', 'Purchase Date', 'Actions'].map(h => (
                                <th key={h} className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={8} className="py-12 text-center text-slate-500">Loading assets...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={8} className="py-12 text-center text-slate-500">
                                <Monitor size={32} className="mx-auto mb-3 opacity-20" />
                                <p>No assets found</p>
                            </td></tr>
                        ) : filtered.map(a => (
                            <tr key={a.id} className="border-b border-slate-800/50 hover:bg-slate-800/80 transition-colors group">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shadow-inner border border-slate-700/50">
                                            {typeIcons[a.asset_type] ?? 'ðŸ“Œ'}
                                        </div>
                                        <div>
                                            <div className="text-slate-200 font-bold group-hover:text-teal-400 transition-colors">{a.name}</div>
                                            <div className="text-slate-500 text-xs mt-0.5">{[a.make, a.model].filter(Boolean).join(' ') || 'â€”'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-slate-400 font-mono text-xs">{a.asset_tag ?? 'â€”'}</td>
                                <td className="px-5 py-4 text-slate-400 capitalize text-xs font-semibold tracking-wide">{a.asset_type}</td>
                                <td className="px-5 py-4 text-slate-400 text-xs">{a.client_name ?? 'Internal'}</td>
                                <td className="px-5 py-4">{statusBadge(a.status)}</td>
                                <td className="px-5 py-4 text-xs font-medium">
                                    {a.warranty_expires ? (
                                        <span className={a.is_warranty_active ? 'text-emerald-400' : 'text-red-400'}>
                                            {a.warranty_expires}
                                        </span>
                                    ) : <span className="text-slate-600">â€”</span>}
                                </td>
                                <td className="px-5 py-4 text-slate-500 text-xs font-medium">{a.purchase_date ?? 'â€”'}</td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setSelectedAsset(a); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => { setSelectedAsset(a); setIsDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedAsset ? "Edit IT Asset" : "Register New Asset"}
                fields={ASSET_FIELDS}
                initialData={selectedAsset}
                onSubmit={handleSave}
                loading={actionLoading}
                submitText={selectedAsset ? "Save Changes" : "Register Asset"}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Decommission Asset"
                message={`Are you sure you want to permanently delete "${selectedAsset?.name}" (${selectedAsset?.asset_tag})? This action cannot be undone and will remove it from all tracking records.`}
                loading={actionLoading}
            />
        </div>
    );
};

export default AssetList;

