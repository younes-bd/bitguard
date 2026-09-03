import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, Filter, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import { accountingService } from '../../api/accountingService';
import { toast } from 'react-hot-toast';

const ChartOfAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        account_type: 'asset',
        description: ''
    });

    const fetchAccounts = async () => {
            try {
                const data = await accountingService.getAccounts();
                setAccounts(data || []);
            } catch (err) {
                console.error("Failed to fetch accounts", err);
                toast.error("Failed to load Chart of Accounts");
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await accountingService.createAccount(formData);
            toast.success("Account created successfully!");
            setShowModal(false);
            setFormData({ code: '', name: '', account_type: 'asset', description: '' });
            fetchAccounts(); // Refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create account");
        } finally {
            setSaving(false);
        }
    };

    const filteredAccounts = accounts.filter(acc => {
        const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || acc.code.includes(searchTerm);
        const matchesType = filterType === 'all' || acc.account_type === filterType;
        return matchesSearch && matchesType;
    });

    const getTypeColor = (type) => {
        switch (type) {
            case 'asset': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'liability': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            case 'equity': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
            case 'revenue': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'expense': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <BookOpen className="text-blue-500" />
                        Chart of Accounts
                    </h1>
                    <p className="text-sm text-slate-400">Manage your standardized accounting ledger codes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={18} />
                        <span>New Account</span>
                    </button>
                </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search accounts by name or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-white transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="text-slate-500" size={18} />
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-blue-500 outline-none appearance-none"
                    >
                        <option value="all">All Types</option>
                        <option value="asset">Assets</option>
                        <option value="liability">Liabilities</option>
                        <option value="equity">Equity</option>
                        <option value="revenue">Revenue</option>
                        <option value="expense">Expenses</option>
                    </select>
                </div>
            </div>

            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-slate-800">
                            <th className="px-6 py-4">Code</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {filteredAccounts.map((acc) => (
                            <tr key={acc.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="font-mono text-sm font-bold text-white">{acc.code}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-slate-300">{acc.name}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold border ${getTypeColor(acc.account_type)}`}>
                                        {acc.account_type.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {acc.is_active ? (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                                            <CheckCircle2 size={14} /> Active
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                            <AlertTriangle size={14} /> Inactive
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right text-xs text-slate-500 truncate max-w-[200px]">
                                    {acc.description || '—'}
                                </td>
                            </tr>
                        ))}
                        {filteredAccounts.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                    No accounts found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Account Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Create New Account</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Account Code</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. 1000"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Account Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Cash Equivalent"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Account Type</label>
                                <select
                                    value={formData.account_type}
                                    onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none appearance-none"
                                >
                                    <option value="asset">Asset</option>
                                    <option value="liability">Liability</option>
                                    <option value="equity">Equity</option>
                                    <option value="revenue">Revenue</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Description (Optional)</label>
                                <textarea
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
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
                                    {saving ? 'Saving...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChartOfAccounts;
