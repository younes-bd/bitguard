import React, { useEffect, useState } from 'react';
import { erpService } from '../../../shared/core/services/erpService';
import {
    Search, Filter, Plus, DollarSign,
    FileText, Check, X, Clock
} from 'lucide-react';

const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);

    // Create Form State
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'other',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        try {
            const data = await erpService.getExpenses();
            setExpenses(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to load expenses", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await erpService.createExpense(formData);
            setShowModal(false);
            setFormData({ description: '', amount: '', category: 'other', date: new Date().toISOString().split('T')[0] });
            loadExpenses(); // Refresh
        } catch (error) {
            alert("Failed to submit expense");
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <Check size={16} className="text-emerald-400" />;
            case 'paid': return <DollarSign size={16} className="text-blue-400" />;
            case 'rejected': return <X size={16} className="text-red-400" />;
            default: return <Clock size={16} className="text-amber-400" />;
        }
    };

    const filteredExpenses = expenses.filter(exp =>
        statusFilter === 'all' || exp.status === statusFilter
    );

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Expenses</h1>
                    <p className="text-slate-400">Track company spending and reimbursements</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20"
                >
                    <Plus size={20} />
                    <span>New Expense</span>
                </button>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                {['all', 'pending', 'approved', 'paid'].map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border capitalize ${statusFilter === status
                                ? 'bg-slate-700 text-white border-slate-600'
                                : 'bg-transparent text-slate-400 border-slate-700 hover:text-white'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="grid gap-4">
                {filteredExpenses.map((exp) => (
                    <div key={exp.id} className="glass-panel p-4 rounded-xl border border-slate-700/50 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
                                <DollarSign size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium">{exp.description}</h3>
                                <div className="text-sm text-slate-400 flex items-center gap-2">
                                    <span className="capitalize">{exp.category}</span>
                                    <span>•</span>
                                    <span>{exp.date}</span>
                                    <span>•</span>
                                    <span className="text-slate-500">by {exp.submitted_by_name || 'User'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="text-lg font-bold text-white">${parseFloat(exp.amount).toFixed(2)}</div>
                                <div className="text-xs flex items-center justify-end gap-1 uppercase tracking-wider font-bold">
                                    {getStatusIcon(exp.status)}
                                    <span className={`
                                        ${exp.status === 'approved' ? 'text-emerald-400' : ''}
                                        ${exp.status === 'pending' ? 'text-amber-400' : ''}
                                        ${exp.status === 'rejected' ? 'text-red-400' : ''}
                                        ${exp.status === 'paid' ? 'text-blue-400' : ''}
                                    `}>{exp.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredExpenses.length === 0 && (
                    <div className="text-center py-12 text-slate-400">No expenses found.</div>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Submit Expense</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                <input
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Amount ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none"
                                >
                                    <option value="travel">Travel</option>
                                    <option value="software">Software</option>
                                    <option value="office">Office</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                                >
                                    Submit Claim
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseList;


