import React, { useState, useEffect } from 'react';
import { Landmark, ArrowUpRight, ArrowDownRight, RefreshCw, Plus, Building2, CreditCard, CheckCircle2 } from 'lucide-react';
import { accountingService } from '../../api/accountingService';
import { toast } from 'react-hot-toast';

const BankingDashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [coaAccounts, setCoaAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('accounts'); // 'accounts', 'transactions'

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        account_number: '',
        routing_number: '',
        currency: 'USD',
        initial_balance: '0',
        linked_account: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [accs, trans, coa] = await Promise.all([
                    accountingService.getBankAccounts(),
                    accountingService.getBankTransactions(),
                    accountingService.getAccounts()
                ]);
                setAccounts(accs || []);
                setTransactions(trans || []);
                setCoaAccounts(coa || []);
            } catch (err) {
                console.error("Failed to fetch banking data", err);
                toast.error("Failed to load Banking Dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await accountingService.createBankAccount(formData);
            toast.success("Bank account created successfully!");
            setShowModal(false);
            setFormData({
                name: '',
                account_number: '',
                routing_number: '',
                currency: 'USD',
                initial_balance: '0',
                linked_account: ''
            });
            const accs = await accountingService.getBankAccounts();
            setAccounts(accs || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create bank account");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;

    const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.current_balance || 0), 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Landmark className="text-emerald-500" />
                        Banking & Cash Flow
                    </h1>
                    <p className="text-sm text-slate-400">Manage cash positions and reconcile bank transactions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => toast('Bank sync integration coming soon')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors border border-slate-700"
                    >
                        <RefreshCw size={18} />
                        <span>Sync Plaid</span>
                    </button>
                </div>
            </div>

            {/* Total Balance Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-emerald-500/10 to-transparent">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Cash Position</span>
                </div>
                <div className="text-4xl font-black text-white">
                    ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-800">
                <button
                    onClick={() => setActiveTab('accounts')}
                    className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'accounts' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Bank Accounts
                    {activeTab === 'accounts' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('transactions')}
                    className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'transactions' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Recent Transactions
                    {activeTab === 'transactions' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full" />}
                </button>
            </div>

            {/* Content */}
            {activeTab === 'accounts' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.map(acc => (
                        <div key={acc.id} className="glass-panel p-6 rounded-2xl border border-slate-800 group hover:border-emerald-500/30 transition-colors cursor-pointer">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-slate-800 rounded-xl text-slate-400 group-hover:text-emerald-400 transition-colors">
                                        {acc.name.toLowerCase().includes('card') ? <CreditCard size={24} /> : <Building2 size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{acc.name}</h3>
                                        <div className="text-xs text-slate-500 font-mono">
                                            {acc.account_number ? `****${acc.account_number.slice(-4)}` : 'No Acct #'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Current Balance</div>
                                <div className="text-2xl font-black text-white">
                                    {acc.currency === 'USD' ? '$' : acc.currency} {parseFloat(acc.current_balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => setShowModal(true)} className="glass-panel p-6 rounded-2xl border border-dashed border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all flex flex-col items-center justify-center text-slate-500 hover:text-emerald-400 gap-3 min-h-[160px]">
                        <Plus size={32} />
                        <span className="font-bold">Add Account</span>
                    </button>
                </div>
            )}

            {/* Bank Account Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Add Bank Account</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Account Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Chase Operating"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Account #</label>
                                    <input
                                        type="text"
                                        placeholder="Optional"
                                        value={formData.account_number}
                                        onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Routing #</label>
                                    <input
                                        type="text"
                                        placeholder="Optional"
                                        value={formData.routing_number}
                                        onChange={(e) => setFormData({ ...formData, routing_number: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Currency</label>
                                    <select
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none appearance-none"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Initial Balance</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        value={formData.initial_balance}
                                        onChange={(e) => setFormData({ ...formData, initial_balance: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Link to General Ledger Account</label>
                                <select
                                    required
                                    value={formData.linked_account}
                                    onChange={(e) => setFormData({ ...formData, linked_account: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none appearance-none"
                                >
                                    <option value="">Select Account...</option>
                                    {coaAccounts.filter(a => a.account_type === 'asset').map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                                    ))}
                                </select>
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
                                    className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Add Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'transactions' && (
                <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-slate-800">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Account</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Reference</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-center">Reconciled</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {transactions.map(txn => (
                                <tr key={txn.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-400">{txn.date}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-white">{txn.bank_account_name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-300">{txn.description}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-mono text-slate-500">{txn.reference || '—'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${txn.type === 'deposit' ? 'text-emerald-400' : 'text-slate-300'}`}>
                                            {txn.type === 'deposit' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} className="text-rose-400" />}
                                            {txn.type === 'withdrawal' && '-'}${parseFloat(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {txn.is_reconciled ? (
                                            <CheckCircle2 size={16} className="text-emerald-500 mx-auto" />
                                        ) : (
                                            <div className="w-4 h-4 rounded border border-slate-600 mx-auto cursor-pointer hover:border-emerald-500" title="Mark as Reconciled" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                        No bank transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BankingDashboard;
