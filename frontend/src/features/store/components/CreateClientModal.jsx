import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { storeService } from '../../../shared/core/services/storeService';

const CreateClientModal = ({ onClose, onSave, loading, initialData = null }) => {
    const defaultState = {
        user_id: '',
        plan_id: '',
        status: 'active'
    };

    const [formData, setFormData] = useState(defaultState);
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        loadPlans();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                user_id: initialData.user_id || initialData.user,
                plan_id: initialData.plan_id || initialData.plan,
                status: initialData.status || 'active'
            });
        }
    }, [initialData]);

    const loadPlans = async () => {
        try {
            const data = await storeService.getPlans();
            setPlans(data || []);
        } catch (err) {
            console.error("Failed to load plans", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-white mb-6">
                    {initialData ? 'Edit Client Subscription' : 'Add New Client'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">User ID</label>
                        <input
                            type="number"
                            name="user_id"
                            required
                            value={formData.user_id}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            placeholder="Enter User ID"
                        />
                        <p className="text-xs text-slate-500 mt-1">Found in Users list. Future: Search by email</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Plan</label>
                        <select
                            name="plan_id"
                            required
                            value={formData.plan_id}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="">Select a Plan</option>
                            {plans.map(plan => (
                                <option key={plan.id} value={plan.id}>{plan.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="active">Active</option>
                            <option value="trial">Trial</option>
                            <option value="past_due">Past Due</option>
                            <option value="canceled">Canceled</option>
                        </select>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-400 hover:text-white mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
                        >
                            <Save size={18} />
                            <span>{loading ? 'Saving...' : (initialData ? 'Update Client' : 'Add Client')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateClientModal;
