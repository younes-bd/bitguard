import React, { useEffect, useState } from 'react';
import { erpService } from '../../../shared/core/services/erpService';
import {
    Package, Search, Filter, Monitor, Server, Smartphone, Cpu
} from 'lucide-react';

const AssetList = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAssets();
    }, []);

    const loadAssets = async () => {
        try {
            const data = await erpService.getAssets();
            setAssets(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to load assets", error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'server': return <Server className="text-purple-400" />;
            case 'laptop': return <Monitor className="text-blue-400" />;
            case 'mobile': return <Smartphone className="text-green-400" />;
            default: return <Cpu className="text-slate-400" />;
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Package className="text-purple-400" size={32} />
                        Assets & Inventory
                    </h1>
                    <p className="text-slate-400">Manage hardware and software assets</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map((asset) => (
                    <div key={asset.id} className="glass-panel p-6 rounded-xl border border-slate-700/50 hover:border-purple-500/30 hover:bg-slate-800/80 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-800 rounded-lg group-hover:scale-110 transition-transform">
                                {getIcon(asset.asset_type)}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${asset.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                {asset.status}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                            {asset.name}
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">{asset.serial_number || 'No Serial #'}</p>

                        <div className="space-y-2 text-sm text-slate-400 border-t border-slate-700/50 pt-4">
                            <div className="flex justify-between">
                                <span>Assigned To:</span>
                                <span className="text-white font-medium">{asset.assigned_to_name || 'Unassigned'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Purchase Date:</span>
                                <span>{asset.purchase_date || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Value:</span>
                                <span className="text-emerald-400">${asset.value || '0.00'}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {assets.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                            <Package size={32} />
                        </div>
                        <p className="text-slate-400">No assets found in inventory.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssetList;


