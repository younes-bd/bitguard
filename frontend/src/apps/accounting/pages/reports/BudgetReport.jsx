import React, { useState, useEffect } from 'react';
import { PieChart, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { erpService } from '../../../../core/api/erpService';
import { toast } from 'react-hot-toast';

const BudgetReport = () => {
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [budgetData, expenseData] = await Promise.all([
                    erpService.getBudgets(),
                    erpService.getExpenses(),
                ]);
                setBudgets(Array.isArray(budgetData) ? budgetData : budgetData?.results || []);
                setExpenses(Array.isArray(expenseData) ? expenseData : expenseData?.results || []);
            } catch (err) {
                toast.error('Failed to load Budget Report');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;

    // Aggregate actual spend per category from expenses
    const actualByCategory = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount || 0);
        return acc;
    }, {});

    const totalAllocated = budgets.reduce((sum, b) => sum + parseFloat(b.allocated_amount || 0), 0);
    const totalSpent = budgets.reduce((sum, b) => {
        return sum + (actualByCategory[b.category] || 0);
    }, 0);

    const getBarClass = (pct) => {
        if (pct >= 100) return 'bg-gradient-to-r from-rose-600 to-rose-400';
        if (pct >= 80) return 'bg-gradient-to-r from-amber-600 to-amber-400';
        return 'bg-gradient-to-r from-emerald-600 to-emerald-400';
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <PieChart className="text-purple-500" />
                    Budget vs Actual
                </h1>
                <p className="text-sm text-slate-400">Compare allocated budgets against real spending per cost center and category.</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Total Allocated</div>
                    <div className="text-2xl font-black text-white">${totalAllocated.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Spent</div>
                    <div className="text-2xl font-black text-white">${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div className={`glass-panel p-6 rounded-2xl border ${totalSpent <= totalAllocated ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}>
                    <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${totalSpent <= totalAllocated ? 'text-emerald-400' : 'text-rose-400'}`}>Remaining</div>
                    <div className={`text-2xl font-black ${totalSpent <= totalAllocated ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ${Math.abs(totalAllocated - totalSpent).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        {totalSpent > totalAllocated && ' OVER'}
                    </div>
                </div>
            </div>

            {budgets.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
                    <PieChart size={48} className="mx-auto text-slate-500 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No Budgets Configured</h3>
                    <p className="text-slate-400">Go to Settings → Cost Centers to add budget lines.</p>
                </div>
            ) : (
                <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-slate-900/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-800">
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-right">Allocated</th>
                                <th className="px-6 py-4 text-right">Spent</th>
                                <th className="px-6 py-4 text-right">Remaining</th>
                                <th className="px-6 py-4">Usage</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {budgets.map(budget => {
                                const actual = actualByCategory[budget.category] || 0;
                                const allocated = parseFloat(budget.allocated_amount);
                                const remaining = allocated - actual;
                                const pct = allocated > 0 ? Math.min((actual / allocated) * 100, 100) : 0;
                                const isOver = actual > allocated;
                                return (
                                    <tr key={budget.id} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-white capitalize">{budget.category.replace('_', ' ')}</span>
                                            <div className="text-xs text-slate-500">{budget.year}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-slate-300">${allocated.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        <td className="px-6 py-4 text-right font-mono text-white">${actual.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        <td className={`px-6 py-4 text-right font-mono font-bold ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
                                            {isOver ? '-' : ''}${Math.abs(remaining).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 w-48">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full transition-all duration-700 ${getBarClass(pct)}`} style={{ width: `${pct}%` }} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-400 w-10 text-right">{pct.toFixed(0)}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {isOver ? (
                                                <span className="flex items-center justify-center gap-1 text-xs font-bold text-rose-400">
                                                    <AlertTriangle size={14} /> Over
                                                </span>
                                            ) : pct >= 80 ? (
                                                <span className="flex items-center justify-center gap-1 text-xs font-bold text-amber-400">
                                                    <TrendingUp size={14} /> Warning
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-400">
                                                    <CheckCircle2 size={14} /> On Track
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BudgetReport;
