import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Plus, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { accountingService } from '../../api/accountingService';

const BudgetManagement = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const res = await accountingService.getBudgets();
                setBudgets(Array.isArray(res) ? res : res?.results || []);
            } catch (error) {
                console.error("Failed to load budgets", error);
                toast.error("Failed to load budget data");
            } finally {
                setLoading(false);
            }
        };
        fetchBudgets();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Target className="text-blue-500" />
                        Budget Management
                    </h1>
                    <p className="text-slate-400 text-sm">Define and monitor financial targets across departments and cost centers.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2">
                    <Plus size={16} /> New Budget
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Budget Allocated</div>
                    <div className="text-3xl font-black text-white">$1,250,000</div>
                    <div className="text-emerald-400 text-sm mt-2 flex items-center gap-1 font-medium">
                        <TrendingUp size={14} /> +5.2% vs last year
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Budget Utilized</div>
                    <div className="text-3xl font-black text-white">$450,230</div>
                    <div className="text-blue-400 text-sm mt-2 font-medium">
                        36% of total allocated
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Variance</div>
                    <div className="text-3xl font-black text-emerald-400">+$25,400</div>
                    <div className="text-slate-500 text-sm mt-2 font-medium">
                        Favorable variance
                    </div>
                </div>
            </div>

            <div className="glass-panel border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900/50 border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Department / Project</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Period</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Allocated</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Utilized</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Variance</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                        {budgets.length === 0 ? (
                            <tr className="hover:bg-slate-800/20 transition-colors">
                                <td className="px-6 py-4 font-bold text-white">Engineering Dept Q3</td>
                                <td className="px-6 py-4 text-sm text-slate-300">Q3 2026</td>
                                <td className="px-6 py-4 font-mono text-white font-medium text-right">$450,000</td>
                                <td className="px-6 py-4 font-mono text-slate-300 text-right">$120,500</td>
                                <td className="px-6 py-4 font-mono text-emerald-400 text-right">+$329,500</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold">On Track</span>
                                </td>
                            </tr>
                        ) : (
                            budgets.map(b => {
                                const allocated = Number(b.total_amount) || 0;
                                const utilized = Number(b.utilized_amount) || 0;
                                const variance = allocated - utilized;
                                return (
                                    <tr key={b.id} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white">{b.name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-300">{b.period || 'Annual'}</td>
                                        <td className="px-6 py-4 font-mono text-white font-medium text-right">${allocated.toLocaleString()}</td>
                                        <td className="px-6 py-4 font-mono text-slate-300 text-right">${utilized.toLocaleString()}</td>
                                        <td className={`px-6 py-4 font-mono text-right ${variance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {variance >= 0 ? '+' : '-'}${Math.abs(variance).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${variance >= 0 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                                {variance >= 0 ? 'On Track' : 'Over Budget'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BudgetManagement;
