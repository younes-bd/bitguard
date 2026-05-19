import React, { useState, useEffect } from 'react';
import { TrendingDown, BarChart2 } from 'lucide-react';
import client from '../../../core/api/client';
import toast from 'react-hot-toast';

export default function AssetDepreciation() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('itam/depreciation/')
            .then(r => setAssets(r.data?.results || r.data || []))
            .catch(() => toast.error('Failed to load depreciation data'))
            .finally(() => setLoading(false));
    }, []);

    const totalCost = assets.reduce((s, a) => s + parseFloat(a.purchase_price || 0), 0);
    const totalBookValue = assets.reduce((s, a) => s + parseFloat(a.book_value || 0), 0);
    const totalDepreciation = assets.reduce((s, a) => s + parseFloat(a.accumulated_depreciation || 0), 0);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
            <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading depreciation data...</p>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <TrendingDown className="text-teal-400" size={28} /> Asset Depreciation
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Straight-line depreciation schedule for all capitalised assets</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Asset Cost', value: `$${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: 'text-white' },
                    { label: 'Total Depreciated', value: `$${totalDepreciation.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: 'text-rose-400' },
                    { label: 'Current Book Value', value: `$${totalBookValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: 'text-emerald-400' },
                ].map(s => (
                    <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                        <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {assets.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl text-slate-500">
                    <TrendingDown size={40} className="mx-auto mb-3 text-slate-700" />
                    <p className="font-bold text-slate-400">No Assets With Cost Data</p>
                    <p className="text-sm">Add purchase cost to assets to see depreciation schedules</p>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950/60 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                            <tr>
                                <th className="p-4">Asset</th>
                                <th className="p-4">Asset Tag</th>
                                <th className="p-4">Purchase Date</th>
                                <th className="p-4">Purchase Price</th>
                                <th className="p-4">Annual Depreciation</th>
                                <th className="p-4">Accumulated Depreciation</th>
                                <th className="p-4">Book Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {assets.map(asset => {
                                return (
                                    <tr key={asset.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4">
                                            <p className="text-white font-semibold text-sm">{asset.name}</p>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">{asset.asset_tag || '—'}</td>
                                        <td className="p-4 text-slate-400 text-sm">{asset.purchase_date || '—'}</td>
                                        <td className="p-4 text-white font-bold text-sm">${parseFloat(asset.purchase_price).toLocaleString()}</td>
                                        <td className="p-4 text-amber-400 font-bold text-sm">${parseFloat(asset.annual_depreciation).toLocaleString()}/yr</td>
                                        <td className="p-4 text-rose-400 font-bold text-sm">${parseFloat(asset.accumulated_depreciation).toLocaleString()}</td>
                                        <td className="p-4 text-emerald-400 font-bold text-sm">${parseFloat(asset.book_value).toLocaleString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
