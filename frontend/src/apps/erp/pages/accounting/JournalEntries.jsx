import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Plus, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { erpService } from '../../../../core/api/erpService';
import { toast } from 'react-hot-toast';

const JournalEntries = () => {
    const [entries, setEntries] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        reference: '',
        description: '',
        lines: [
            { account: '', debit: '', credit: '', description: '' },
            { account: '', debit: '', credit: '', description: '' }
        ]
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [entriesData, accountsData] = await Promise.all([
                    erpService.getJournalEntries(),
                    erpService.getAccounts()
                ]);
                setEntries(entriesData || []);
                setAccounts(accountsData || []);
            } catch (err) {
                console.error("Failed to fetch data", err);
                toast.error("Failed to load Journal Entries");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const addLine = () => {
        setFormData({
            ...formData,
            lines: [...formData.lines, { account: '', debit: '', credit: '', description: '' }]
        });
    };

    const removeLine = (index) => {
        const newLines = formData.lines.filter((_, i) => i !== index);
        setFormData({ ...formData, lines: newLines });
    };

    const handleLineChange = (index, field, value) => {
        const newLines = [...formData.lines];
        newLines[index][field] = value;
        setFormData({ ...formData, lines: newLines });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation: Debits must equal credits
        const totalDebit = formData.lines.reduce((sum, line) => sum + parseFloat(line.debit || 0), 0);
        const totalCredit = formData.lines.reduce((sum, line) => sum + parseFloat(line.credit || 0), 0);
        
        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            toast.error(`Total Debits (${totalDebit}) must equal Total Credits (${totalCredit})`);
            return;
        }

        // Validation: Every line must have an account
        if (formData.lines.some(line => !line.account)) {
            toast.error("Please select an account for every line.");
            return;
        }

        setSaving(true);
        try {
            await erpService.createJournalEntry(formData);
            toast.success("Journal Entry created successfully!");
            setShowModal(false);
            setFormData({
                date: new Date().toISOString().split('T')[0],
                reference: '',
                description: '',
                lines: [
                    { account: '', debit: '', credit: '', description: '' },
                    { account: '', debit: '', credit: '', description: '' }
                ]
            });
            const data = await erpService.getJournalEntries();
            setEntries(data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create journal entry");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FileSpreadsheet className="text-blue-500" />
                        Journal Entries
                    </h1>
                    <p className="text-sm text-slate-400">View and manage double-entry accounting records.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={18} />
                        <span>Manual Entry</span>
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {entries.map(entry => {
                    const totalDebit = entry.lines.reduce((sum, line) => sum + parseFloat(line.debit || 0), 0);
                    const totalCredit = entry.lines.reduce((sum, line) => sum + parseFloat(line.credit || 0), 0);

                    return (
                        <div key={entry.id} className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                            <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex justify-between items-center">
                                <div>
                                    <h3 className="text-white font-bold flex items-center gap-2">
                                        JE-{entry.id.slice(0, 8)}
                                        {entry.is_posted && <CheckCircle2 size={16} className="text-emerald-500" />}
                                    </h3>
                                    <div className="flex gap-4 text-xs text-slate-400 mt-1">
                                        <span>Date: {entry.date}</span>
                                        {entry.reference && <span>Ref: {entry.reference}</span>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-400">{entry.description || 'No description'}</div>
                                    <button className="text-xs text-blue-400 hover:text-blue-300 font-bold mt-1 flex items-center justify-end gap-1 w-full">
                                        View Details <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-slate-900/30 text-slate-500 text-[10px] uppercase font-bold tracking-[0.1em] border-b border-slate-800">
                                            <th className="px-6 py-2 w-1/3">Account</th>
                                            <th className="px-6 py-2">Description</th>
                                            <th className="px-6 py-2 text-right">Debit</th>
                                            <th className="px-6 py-2 text-right">Credit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/30">
                                        {entry.lines.map(line => (
                                            <tr key={line.id} className="hover:bg-slate-800/10">
                                                <td className="px-6 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-white">{line.account_name}</span>
                                                        <span className="text-xs text-slate-500 font-mono">{line.account_code}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-slate-400">{line.description}</td>
                                                <td className="px-6 py-3 text-right font-mono text-emerald-400">
                                                    {parseFloat(line.debit) > 0 ? parseFloat(line.debit).toLocaleString(undefined, { minimumFractionDigits: 2 }) : ''}
                                                </td>
                                                <td className="px-6 py-3 text-right font-mono text-slate-300">
                                                    {parseFloat(line.credit) > 0 ? parseFloat(line.credit).toLocaleString(undefined, { minimumFractionDigits: 2 }) : ''}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-slate-900/50 border-t border-slate-800 font-bold">
                                        <tr>
                                            <td colSpan="2" className="px-6 py-3 text-right text-slate-400">Totals:</td>
                                            <td className="px-6 py-3 text-right text-emerald-400 border-t-2 border-emerald-500/20">
                                                {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-3 text-right text-slate-300 border-t-2 border-slate-500/20">
                                                {totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    );
                })}

                {entries.length === 0 && (
                    <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
                        <Activity className="mx-auto text-slate-500 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-white mb-2">No Journal Entries</h3>
                        <p className="text-slate-400">Double-entry ledger transactions will appear here.</p>
                    </div>
                )}
            </div>

            {/* Journal Entry Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Create Journal Entry</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Reference (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. INV-1002"
                                        value={formData.reference}
                                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Description</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Reason for entry"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="border border-slate-800 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-900 border-b border-slate-800">
                                        <tr>
                                            <th className="p-3 text-slate-400">Account</th>
                                            <th className="p-3 text-slate-400">Description</th>
                                            <th className="p-3 text-slate-400 text-right w-32">Debit</th>
                                            <th className="p-3 text-slate-400 text-right w-32">Credit</th>
                                            <th className="p-3 text-slate-400 w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {formData.lines.map((line, index) => (
                                            <tr key={index}>
                                                <td className="p-2">
                                                    <select
                                                        required
                                                        value={line.account}
                                                        onChange={(e) => handleLineChange(index, 'account', e.target.value)}
                                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none appearance-none"
                                                    >
                                                        <option value="">Select Account...</option>
                                                        {accounts.map(acc => (
                                                            <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Line description"
                                                        value={line.description}
                                                        onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="0.00"
                                                        value={line.debit}
                                                        onChange={(e) => {
                                                            handleLineChange(index, 'debit', e.target.value);
                                                            if (e.target.value) handleLineChange(index, 'credit', '');
                                                        }}
                                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none text-right"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="0.00"
                                                        value={line.credit}
                                                        onChange={(e) => {
                                                            handleLineChange(index, 'credit', e.target.value);
                                                            if (e.target.value) handleLineChange(index, 'debit', '');
                                                        }}
                                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none text-right"
                                                    />
                                                </td>
                                                <td className="p-2 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLine(index)}
                                                        disabled={formData.lines.length <= 2}
                                                        className="text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:hover:text-slate-500"
                                                    >
                                                        ×
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={addLine}
                                        className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Plus size={14} /> Add Line
                                    </button>
                                    <div className="flex gap-6 text-sm font-bold">
                                        <div className="text-slate-400">
                                            Total Debit: <span className="text-emerald-400">{formData.lines.reduce((s, l) => s + parseFloat(l.debit || 0), 0).toFixed(2)}</span>
                                        </div>
                                        <div className="text-slate-400">
                                            Total Credit: <span className="text-slate-300">{formData.lines.reduce((s, l) => s + parseFloat(l.credit || 0), 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
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
                                    disabled={saving || Math.abs(formData.lines.reduce((s, l) => s + parseFloat(l.debit || 0), 0) - formData.lines.reduce((s, l) => s + parseFloat(l.credit || 0), 0)) > 0.01}
                                    className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Posting...' : 'Post Journal Entry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JournalEntries;
