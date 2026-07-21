import React, { useState, useEffect } from 'react';
import { Settings2, Plus, Edit, Trash2 } from 'lucide-react';
import { erpService } from '../../../../core/api/erpService';
import { toast } from 'react-hot-toast';

export default function SalaryRulesList() {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRules();
    }, []);

    const loadRules = async () => {
        try {
            const data = await erpService.get('hrm/salary-rules');
            setRules(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            toast.error("Failed to load salary rules");
        } finally {
            setLoading(false);
        }
    };

    const getCategoryColor = (category) => {
        switch(category) {
            case 'basic': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'allowance': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
            case 'deduction': return 'bg-rose-500/20 text-rose-400 border-rose-500/50';
            case 'gross': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
            case 'net': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Settings2 className="text-purple-500" /> Salary Rules
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Configure computations for allowances and deductions</p>
                </div>
                <button 
                    onClick={() => toast('Create rule coming soon')}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-purple-500/20"
                >
                    <Plus size={18} /> New Rule
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800/50 text-slate-400 font-medium border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Sequence</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Code</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Amount Type</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-8">
                                    <div className="flex justify-center"><div className="w-6 h-6 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div></div>
                                </td>
                            </tr>
                        ) : rules.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-8 text-slate-500">No salary rules configured.</td></tr>
                        ) : rules.sort((a,b) => a.sequence - b.sequence).map(rule => (
                            <tr key={rule.id} className="hover:bg-slate-800/20 transition-colors group">
                                <td className="px-6 py-4 text-slate-500 font-mono">
                                    {rule.sequence}
                                </td>
                                <td className="px-6 py-4 font-bold text-white">
                                    {rule.name}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                        {rule.code}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold border ${getCategoryColor(rule.category)}`}>
                                        {rule.category.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {rule.amount_type.toUpperCase()} 
                                    {rule.amount_type === 'fixed' && ` ($${rule.amount})`}
                                    {rule.amount_type === 'percent' && ` (${rule.amount}%)`}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                                            <Edit size={16} />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
