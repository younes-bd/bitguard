import React, { useState, useEffect } from 'react';
import { currencyService } from '@/apps/base/api/currencyService';
import { DollarSign, Search, CheckCircle2, XCircle, Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CurrenciesPage() {
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCurrency, setEditingCurrency] = useState(null);
    const [form, setForm] = useState({
        name: '',
        code: '',
        symbol: '',
        is_active: true
    });

    const fetchCurrencies = async () => {
        setLoading(true);
        try {
            const res = await currencyService.getAll();
            setCurrencies(res.data?.results || res.data || []);
        } catch (error) {
            toast.error('Failed to load currencies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrencies();
    }, []);

    const toggleCurrency = async (currency) => {
        try {
            await currencyService.update(currency.id, { is_active: !currency.is_active });
            setCurrencies(currencies.map(c => c.id === currency.id ? { ...c, is_active: !currency.is_active } : c));
            toast.success(`Currency ${!currency.is_active ? 'enabled' : 'disabled'}`);
        } catch (error) {
            toast.error('Failed to toggle currency');
        }
    };

    const deleteCurrency = async (id) => {
        if (!window.confirm("Are you sure you want to delete this currency?")) return;
        try {
            await currencyService.delete(id);
            setCurrencies(currencies.filter(c => c.id !== id));
            toast.success('Currency deleted');
        } catch (error) {
            toast.error('Failed to delete currency');
        }
    };

    const openModal = (currency = null) => {
        if (currency) {
            setEditingCurrency(currency);
            setForm({
                name: currency.name,
                code: currency.code,
                symbol: currency.symbol || '',
                is_active: currency.is_active
            });
        } else {
            setEditingCurrency(null);
            setForm({
                name: '',
                code: '',
                symbol: '',
                is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCurrency) {
                await currencyService.update(editingCurrency.id, form);
            } else {
                await currencyService.create(form);
            }
            setIsModalOpen(false);
            fetchCurrencies();
            toast.success('Currency saved');
        } catch (error) {
            toast.error('Failed to save currency');
        }
    };

    const filteredCurrencies = currencies.filter(c => 
        (c?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (c?.code || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <DollarSign className="text-blue-500" size={28} />
                        Currencies
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Manage global currencies and exchange rates.</p>
                </div>
                <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2">
                    <Plus size={18} /> New Currency
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search currencies..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                                <th className="p-4 font-semibold">Currency Code</th>
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Symbol</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                                        Loading currencies...
                                    </td>
                                </tr>
                            ) : filteredCurrencies.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        No currencies found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCurrencies.map((currency) => (
                                    <tr key={currency.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold text-white">{currency.code}</div>
                                        </td>
                                        <td className="p-4 text-slate-300">
                                            {currency.name}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-mono text-blue-400 bg-blue-500/10 inline-flex items-center justify-center w-8 h-8 rounded-lg">
                                                {currency.symbol || '-'}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => toggleCurrency(currency)}
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${
                                                    currency.is_active 
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                                                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                                                }`}
                                            >
                                                {currency.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                {currency.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openModal(currency)} className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-2 py-1">
                                                    Edit
                                                </button>
                                                <button onClick={() => deleteCurrency(currency.id)} className="text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white">{editingCurrency ? 'Edit Currency' : 'New Currency'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <XCircle size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-1">Currency Name</label>
                                <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. US Dollar" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-1">Currency Code</label>
                                    <input required type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 uppercase" placeholder="e.g. USD" maxLength="3" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-1">Symbol</label>
                                    <input type="text" value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. $" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-5 h-5 accent-blue-500 rounded bg-slate-950 border-slate-700" />
                                <label htmlFor="is_active" className="text-sm font-semibold text-slate-300 cursor-pointer">Active</label>
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
