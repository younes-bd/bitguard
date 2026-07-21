import React, { useState, useEffect } from 'react';
import { Image, Search, Plus, Trash2, FileText, Video, Link } from 'lucide-react';
import { marketingService } from '../../../../core/api/marketingService';
import GenericModal from '../../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../../core/components/shared/core/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const AssetList = () => {
    const [assets, setAssets] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [aData, cData] = await Promise.all([
                marketingService.getAssets(),
                marketingService.getCampaigns()
            ]);
            setAssets(Array.isArray(aData) ? aData : aData.results || []);
            setCampaigns(Array.isArray(cData) ? cData : cData.results || []);
        } catch (error) {
            console.error("Failed to fetch assets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            await marketingService.createAsset(formData);
            setIsModalOpen(false);
            fetchData();
            toast.success('Asset created successfully');
        } catch (error) {
            toast.error('Failed to create asset');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedAsset) return;
        setActionLoading(true);
        try {
            await marketingService.deleteAsset(selectedAsset.id);
            setIsDeleteModalOpen(false);
            fetchData();
            toast.success('Asset deleted successfully');
        } catch (error) {
            toast.error('Failed to delete asset');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const ASSET_FIELDS = [
        { name: 'name', label: 'Asset Name', required: true },
        { name: 'type', label: 'Type', type: 'select', required: true, options: [
            { value: 'image', label: 'Image' },
            { value: 'video', label: 'Video' },
            { value: 'document', label: 'Document' }
        ]},
        { name: 'url', label: 'URL', required: true },
        { name: 'campaign_id', label: 'Campaign', type: 'select', options: [
            { value: '', label: 'Select Campaign' },
            ...campaigns.map(c => ({ value: c.id, label: c.name }))
        ]}
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'image': return <Image className="text-blue-400" size={24} />;
            case 'video': return <Video className="text-purple-400" size={24} />;
            default: return <FileText className="text-emerald-400" size={24} />;
        }
    };

    const filtered = assets.filter(a => (a.name || '').toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Image className="text-cyan-500" size={28} />
                        Asset Library
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage marketing creatives and resources</p>
                </div>
                <button onClick={() => { setSelectedAsset(null); setIsModalOpen(true); }} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-600/20 active:scale-95">
                    <Plus size={18} /> Upload Asset
                </button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="text" placeholder="Search assets..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 backdrop-blur-sm transition-all" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-slate-500">Loading assets...</div>
                ) : filtered.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">No assets found</div>
                ) : filtered.map(asset => (
                    <div key={asset.id} className="glass-panel border border-slate-700/50 rounded-2xl p-5 hover:border-cyan-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-800 rounded-xl">
                                {getIcon(asset.type)}
                            </div>
                            <button
                                onClick={() => { setSelectedAsset(asset); setIsDeleteModalOpen(true); }}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <h3 className="text-white font-bold truncate">{asset.name}</h3>
                        <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-bold">{asset.type}</p>
                        
                        <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col gap-2">
                            {asset.campaign_id && (
                                <p className="text-xs text-slate-500 truncate">
                                    Campaign: <span className="text-slate-300">{campaigns.find(c => c.id === asset.campaign_id)?.name || 'Unknown'}</span>
                                </p>
                            )}
                            <a href={asset.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors truncate">
                                <Link size={12} /> {asset.url}
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Upload Asset"
                fields={ASSET_FIELDS}
                onSubmit={handleSave}
                loading={actionLoading}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Asset"
                message={`Are you sure you want to delete ${selectedAsset?.name}?`}
                loading={actionLoading}
            />
        </div>
    );
};

export default AssetList;

