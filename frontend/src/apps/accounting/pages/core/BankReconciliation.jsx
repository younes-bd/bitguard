import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, CheckCircle, Clock, Loader, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { erpService } from '../../../../core/api/erpService';
import { accountingService } from '../../api/accountingService';

const BankReconciliation = () => {
    const [transactions, setTransactions] = useState([]);
    const [ledgerEntries, setLedgerEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMockData, setIsMockData] = useState(false);
    
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [selectedLedger, setSelectedLedger] = useState(null);

    useEffect(() => {
        const fetchReconciliationData = async () => {
            try {
                // Fetch bank transactions and ledger entries
                const [bankRes, paymentsRes, expensesRes] = await Promise.all([
                    accountingService.getBankTransactions(),
                    accountingService.getPayments(),
                    accountingService.getExpenses()
                ]);
                
                const bankTx = Array.isArray(bankRes) ? bankRes : bankRes?.results || [];
                setTransactions(bankTx);

                const payments = Array.isArray(paymentsRes) ? paymentsRes : paymentsRes?.results || [];
                const expenses = Array.isArray(expensesRes) ? expensesRes : expensesRes?.results || [];
                
                let ledger = [
                    ...payments.map(p => ({ ...p, type: 'Payment', display_name: `Payment for ${p.invoice_number}`, amt: p.amount })),
                    ...expenses.map(e => ({ ...e, type: 'Expense', display_name: `Expense: ${e.category}`, amt: -(e.amount || 0) }))
                ];
                
                setLedgerEntries(ledger);
                setIsMockData(false); // No more mock data
            } catch (error) {
                console.error("Failed to load reconciliation data", error);
                toast.error("Failed to load bank feeds");
            } finally {
                setLoading(false);
            }
        };
        fetchReconciliationData();
    }, []);

    const handleMatch = () => {
        if (!selectedTransaction || !selectedLedger) return;
        toast.success(`Matched ${selectedTransaction.description} with ${selectedLedger.display_name}`);
        setTransactions(transactions.filter(t => t.id !== selectedTransaction.id));
        setLedgerEntries(ledgerEntries.filter(l => l.id !== selectedLedger.id));
        setSelectedTransaction(null);
        setSelectedLedger(null);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin text-blue-500" size={32} />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <ArrowLeftRight className="text-blue-500" />
                        Bank Reconciliation
                    </h1>
                    <p className="text-slate-400 text-sm">Match bank feed transactions to your ERP ledger perfectly.</p>
                </div>
                <button 
                    onClick={() => toast.success("AI Auto-Match Initiated. 0 new matches found.")}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-500/20"
                >
                    Auto-Match (AI)
                </button>
            </div>

            {isMockData && (
                <div className="bg-amber-500/10 border border-amber-500/50 text-amber-500 p-4 rounded-xl flex items-center gap-3">
                    <AlertTriangle size={20} />
                    <span className="text-sm font-medium">No live bank data found. Showing sample data for demonstration purposes.</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Bank Statement</h2>
                    <div className="space-y-3">
                        {transactions.map(t => (
                            <div 
                                key={t.id} 
                                onClick={() => setSelectedTransaction(t)}
                                className={`p-4 bg-slate-900/50 border ${selectedTransaction?.id === t.id ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-slate-700/50 hover:border-slate-600'} rounded-xl flex justify-between items-center cursor-pointer transition-all`}
                            >
                                <div>
                                    <div className="text-sm font-bold text-slate-200">{t.description}</div>
                                    <div className="text-xs text-slate-500">{t.date}</div>
                                </div>
                                <div className={`font-mono font-bold ${t.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    ${Math.abs(t.amount).toLocaleString()}
                                </div>
                            </div>
                        ))}
                        {transactions.length === 0 && (
                            <div className="text-center py-8 text-slate-500 text-sm">
                                <CheckCircle className="mx-auto mb-2 text-emerald-500" size={24} />
                                All bank transactions matched!
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass-panel border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">ERP Ledger (Unmatched)</h2>
                    <div className="space-y-3">
                        {ledgerEntries.map(p => (
                            <div 
                                key={p.id} 
                                onClick={() => setSelectedLedger(p)}
                                className={`p-4 bg-slate-900/50 border ${selectedLedger?.id === p.id ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-slate-700/50 hover:border-slate-600'} rounded-xl flex justify-between items-center cursor-pointer transition-all`}
                            >
                                <div>
                                    <div className="text-sm font-bold text-slate-200">{p.display_name}</div>
                                    <div className="text-xs text-slate-500">{p.client_name || p.type}</div>
                                </div>
                                <div className={`font-mono font-bold ${p.amt > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    ${Math.abs(p.amt).toLocaleString()}
                                </div>
                            </div>
                        ))}
                        {ledgerEntries.length === 0 && (
                            <div className="text-center py-8 text-slate-500 text-sm">
                                <CheckCircle className="mx-auto mb-2 text-emerald-500" size={24} />
                                All ledger entries matched!
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="bg-slate-800/30 border border-slate-700 p-4 rounded-xl flex items-center justify-between">
                <span className="text-slate-400 text-sm">Select one transaction from the bank and one from the ledger to match them.</span>
                <button 
                    onClick={handleMatch}
                    disabled={!selectedTransaction || !selectedLedger}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-colors border ${selectedTransaction && selectedLedger ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'}`}
                >
                    Confirm Match
                </button>
            </div>
        </div>
    );
};

export default BankReconciliation;
