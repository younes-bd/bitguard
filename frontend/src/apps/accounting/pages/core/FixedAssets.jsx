import React, { useState, useEffect } from 'react';
import { Server, Plus, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { accountingService } from '../../api/accountingService';
import { toast } from 'react-hot-toast';

const FixedAssets = () => {
    const [assets, setAssets] = useState([]);
    const [coaAccounts, setCoaAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        purchase_date: new Date().toISOString().split('T')[0],
        purchase_price: '',
        salvage_value: '0',
        useful_life_years: '5',
        asset_account: '',
        depreciation_expense_account: ''
    });

    const fetchData = async () => {
        try {
            const [assetData, coaData] = await Promise.all([
                accountingService.getFixedAssets(),
                accountingService.getAccounts()
            ]);
            setAssets(Array.isArray(assetData) ? assetData : assetData?.results || []);
            setCoaAccounts(coaData || []);
        } catch (err) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await accountingService.createFixedAsset(formData);
            toast.success("Fixed asset added successfully!");
            setShowModal(false);
            setFormData({
                name: '',
                description: '',
                purchase_date: new Date().toISOString().split('T')[0],
                purchase_price: '',
                salvage_value: '0',
                useful_life_years: '5',
                asset_account: '',
                depreciation_expense_account: ''
            });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add asset");
        } finally {
            setSaving(false);
        }
    };

    const handleRunDepreciation = async () => {
        setRunning(true);
        try {
            const result = await accountingService.runDepreciation();
            toast.success(`Depreciation run complete — ${result?.assets_processed || 0} assets processed`);
            fetchData(); // Refresh data
        } catch (err) {
            toast.error('Failed to run depreciation');
        } finally {
            setRunning(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;

    const getValueColor = (nbv, price) => {
        const pct = price > 0 ? nbv / price : 0;
        if (pct > 0.5) return 'text-emerald-400';
        if (pct > 0.2) return 'text-amber-400';
        return 'text-rose-400';
    };

    const totalCost = assets.reduce((s, a) => s + parseFloat(a.purchase_price || 0), 0);
    const totalNBV = assets.reduce((s, a) => s + parseFloat(a.net_book_value || 0), 0);
    const totalDeprec = assets.reduce((s, a) => s + parseFloat(a.accumulated_depreciation || 0), 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Server className="text-blue-500" />
                        Fixed Assets
                    </h1>
                    <p className="text-sm text-slate-400">Track and depreciate company assets (straight-line method).</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRunDepreciation}
                        disabled={running}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw size={16} className={running ? 'animate-spin' : ''} />
                        {running ? 'Running...' : 'Run Depreciation'}
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors"
                    >
                        <Plus size={16} /> Add Asset
                    </button>
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Total Asset Cost</div>
                    <div className="text-2xl font-black text-white">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <div className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2">Total Depreciated</div>
                    <div className="text-2xl font-black text-white">${totalDeprec.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Net Book Value</div>
                    <div className="text-2xl font-black text-emerald-400">${totalNBV.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
            </div>

            {assets.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
                    <Server size={48} className="mx-auto text-slate-500 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No Fixed Assets Recorded</h3>
                    <p className="text-slate-400">Add your first asset (laptops, servers, furniture) to start tracking depreciation.</p>
                </div>
            ) : (
                <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-slate-900/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-800">
                                <th className="px-6 py-4">Asset Name</th>
                                <th className="px-6 py-4">Purchase Date</th>
                                <th className="px-6 py-4 text-right">Cost</th>
                                <th className="px-6 py-4 text-right">Accum. Depr.</th>
                                <th className="px-6 py-4 text-right">Net Book Value</th>
                                <th className="px-6 py-4 text-center">Life</th>
                                <th className="px-6 py-4">Remaining Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {assets.map(asset => {
                                const nbv = parseFloat(asset.net_book_value || 0);
                                const price = parseFloat(asset.purchase_price || 0);
                                const pct = price > 0 ? Math.min((nbv / price) * 100, 100) : 0;
                                return (
                                    <tr key={asset.id} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white">{asset.name}</div>
                                            <div className="text-xs text-slate-500">{asset.description}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">{asset.purchase_date}</td>
                                        <td className="px-6 py-4 text-right font-mono text-slate-300">${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        <td className="px-6 py-4 text-right font-mono text-rose-400">${parseFloat(asset.accumulated_depreciation || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        <td className={`px-6 py-4 text-right font-mono font-bold ${getValueColor(nbv, price)}`}>
                                            ${nbv.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-400">{asset.useful_life_years}yr</td>
                                        <td className="px-6 py-4 w-36">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${pct > 50 ? 'bg-emerald-500' : pct > 20 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-500">{pct.toFixed(0)}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Fixed Asset Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Record Fixed Asset</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Asset Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. MacBook Pro M3"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Description (Optional)</label>
                                <textarea
                                    rows={2}
                                    placeholder="Asset details, serial number, etc."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Purchase Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={formData.purchase_date}
                                        onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Purchase Price</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.purchase_price}
                                        onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Salvage Value</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        value={formData.salvage_value}
                                        onChange={(e) => setFormData({ ...formData, salvage_value: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Useful Life (Years)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.useful_life_years}
                                        onChange={(e) => setFormData({ ...formData, useful_life_years: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Asset Account (GL)</label>
                                <select
                                    required
                                    value={formData.asset_account}
                                    onChange={(e) => setFormData({ ...formData, asset_account: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none appearance-none"
                                >
                                    <option value="">Select Account...</option>
                                    {coaAccounts.filter(a => a.account_type === 'asset').map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Depreciation Expense Account (GL)</label>
                                <select
                                    required
                                    value={formData.depreciation_expense_account}
                                    onChange={(e) => setFormData({ ...formData, depreciation_expense_account: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none appearance-none"
                                >
                                    <option value="">Select Account...</option>
                                    {coaAccounts.filter(a => a.account_type === 'expense').map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Adding...' : 'Add Asset'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FixedAssets;
