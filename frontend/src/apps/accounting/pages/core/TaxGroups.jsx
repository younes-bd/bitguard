import React, { useState, useEffect } from 'react';
import { Percent, Plus, Loader } from 'lucide-react';
import { accountingService } from '../../api/accountingService';

const TaxGroups = () => {
    const [taxes, setTaxes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTaxes = async () => {
            try {
                const res = await accountingService.getTaxGroups();
                setTaxes(Array.isArray(res) ? res : res?.results || []);
            } catch (error) {
                console.error("Failed to load taxes", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTaxes();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Percent className="text-blue-500" />
                        Tax Authorities & Groups
                    </h1>
                    <p className="text-slate-400 text-sm">Manage complex tax regimes and combined tax groups.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
                    <Plus size={16}/> New Tax Group
                </button>
            </div>

            <div className="glass-panel border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900/50 border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Group Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Taxes Included</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total Rate</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                                    <Loader className="animate-spin mx-auto mb-2 text-blue-500" size={24} />
                                    Loading Tax Groups...
                                </td>
                            </tr>
                        ) : taxes.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                                    No tax groups found.
                                </td>
                            </tr>
                        ) : (
                            taxes.map(tax => (
                                <tr key={tax.id} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4 font-bold text-white">{tax.name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-300">
                                        {/* Adjusting based on actual tax groups which might contain a list of taxes */}
                                        <span className="px-2 py-1 bg-slate-800 rounded-md text-xs">{tax.description || 'Compound Tax'}</span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-emerald-400 font-bold">{parseFloat(tax.total_rate || tax.rate || 0).toFixed(2)}%</td>
                                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${tax.is_active !== false ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>{tax.is_active !== false ? 'Active' : 'Inactive'}</span></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaxGroups;
