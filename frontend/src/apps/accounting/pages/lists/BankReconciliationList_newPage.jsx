import React, { useState, useEffect } from 'react';
import { Link2, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { accountingService } from '../../api/accountingService';
import toast from 'react-hot-toast';

const BankReconciliationList = () => {
    const [reconciliations, setReconciliations] = useState([]);
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        journal: '', date: new Date().toISOString().split('T')[0], 
        statement_balance: 0, system_balance: 0, difference: 0, 
        is_reconciled: false, notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [reconData, journalData] = await Promise.all([
                accountingService.getBankReconciliations(),
                accountingService.getAccountJournals()
            ]);
            setReconciliations(reconData?.results || reconData || []);
            setJournals(journalData?.results || journalData || []);
        } catch (err) {
            toast.error("Failed to load reconciliation data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Auto calculate difference
    useEffect(() => {
        const diff = parseFloat(formData.statement_balance || 0) - parseFloat(formData.system_balance || 0);
        setFormData(prev => ({ ...prev, difference: diff.toFixed(2) }));
    }, [formData.statement_balance, formData.system_balance]);

    const handleSave = async () => {
        try {
            const payload = { 
                ...formData, 
                journal: formData.journal || null 
            };
            
            if (formData.id) {
                await accountingService.updateBankReconciliation(formData.id, payload);
                toast.success("Reconciliation updated");
            } else {
                await accountingService.createBankReconciliation(payload);
                toast.success("Reconciliation created");
            }
            setIsEditing(false);
            fetchData();
        } catch (err) {
            toast.error("Failed to save reconciliation");
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Link2 className="text-emerald-400" size={28} />
                        Bank Reconciliations
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Match bank statements with system ledgers</p>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => { 
                            setFormData({
                                journal: journals.length > 0 ? journals[0].id : '', 
                                date: new Date().toISOString().split('T')[0], 
                                statement_balance: 0, 
                                system_balance: 0, 
                                difference: 0, 
                                is_reconciled: false, 
                                notes: ''
                            }); 
                            setIsEditing(true); 
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} /> Add Reconciliation
                    </button>
                )}
            </div>

            {isEditing && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <h3 className="text-white font-medium mb-4">{formData.id ? 'Edit Reconciliation' : 'New Reconciliation'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Journal</label>
                            <select value={formData.journal || ''} onChange={e => setFormData({...formData, journal: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm">
                                <option value="">Select Journal...</option>
                                {journals.map(j => (
                                    <option key={j.id} value={j.id}>{j.name} ({j.code})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Date</label>
                            <input type="date" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                        <div className="flex items-center mt-6">
                            <label className="flex items-center cursor-pointer">
                                <input type="checkbox" checked={formData.is_reconciled} onChange={e => setFormData({...formData, is_reconciled: e.target.checked})} className="hidden" />
                                <div className={`w-5 h-5 rounded border flex items-center justify-center mr-2 ${formData.is_reconciled ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                                    {formData.is_reconciled && <CheckCircle2 size={14} className="text-white" />}
                                </div>
                                <span className="text-sm text-slate-200">Is Reconciled?</span>
                            </label>
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Statement Balance</label>
                            <input type="number" step="0.01" value={formData.statement_balance} onChange={e => setFormData({...formData, statement_balance: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">System Balance</label>
                            <input type="number" step="0.01" value={formData.system_balance} onChange={e => setFormData({...formData, system_balance: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Difference</label>
                            <input type="number" readOnly value={formData.difference} className={`w-full bg-slate-950/50 border border-slate-800 px-3 py-2 rounded-lg text-sm font-medium ${parseFloat(formData.difference) !== 0 ? 'text-rose-400' : 'text-emerald-400'}`} />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-slate-400 text-xs mb-1">Notes</label>
                            <input type="text" value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm" placeholder="Any discrepancies or notes..." />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-3 justify-end">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-500">Save</button>
                    </div>
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Journal</th>
                            <th className="p-4 font-medium">Statement Bal.</th>
                            <th className="p-4 font-medium">System Bal.</th>
                            <th className="p-4 font-medium">Difference</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {loading ? (
                            <tr><td colSpan="7" className="p-4 text-center text-slate-500">Loading reconciliations...</td></tr>
                        ) : reconciliations.map(item => (
                            <tr key={item.id} className="hover:bg-slate-800/30">
                                <td className="p-4 text-sm font-medium text-white">{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                                <td className="p-4 text-sm text-slate-400">{item.journal_name || item.journal || '-'}</td>
                                <td className="p-4 text-sm text-slate-400">${parseFloat(item.statement_balance || 0).toFixed(2)}</td>
                                <td className="p-4 text-sm text-slate-400">${parseFloat(item.system_balance || 0).toFixed(2)}</td>
                                <td className="p-4 text-sm">
                                    <span className={parseFloat(item.difference || 0) !== 0 ? 'text-rose-400 font-medium' : 'text-emerald-400 font-medium'}>
                                        ${parseFloat(item.difference || 0).toFixed(2)}
                                    </span>
                                </td>
                                <td className="p-4 text-sm">
                                    <span className={`text-xs px-2 py-1 rounded-full ${item.is_reconciled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                        {item.is_reconciled ? 'Reconciled' : 'Pending'}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-3 justify-end">
                                    <button onClick={() => { setFormData(item); setIsEditing(true); }} className="text-slate-400 hover:text-white"><Edit2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {!loading && reconciliations.length === 0 && (
                            <tr><td colSpan="7" className="p-8 text-center text-slate-500">No bank reconciliations found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BankReconciliationList;
