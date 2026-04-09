import React, { useState, useEffect } from 'react';
import { Blocks, Search, Plus, Loader2 } from 'lucide-react';
import client from '../../../core/api/client';

export default function AddOnManagement() {
    const [addons, setAddons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('store/addons/')
            .then(res => setAddons(res.data.results || res.data || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Blocks className="text-orange-400" /> Third-Party Integrations
                </h1>
                <button className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors">
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
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">{addon.name}</h3>
                                    <p className="text-sm text-slate-400 font-mono">{addon.provider}</p>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${addon.is_enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                    {addon.is_enabled ? 'Active' : 'Disabled'}
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-800/50 flex justify-end">
                                <button className="text-sm text-slate-300 hover:text-white transition-colors">Configure API Keys →</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
