import React, { useState, useEffect } from 'react';
import { CreditCard, Layers, Zap, Check, Plus, Edit2, Trash2 } from 'lucide-react';
import billingService from '../../../core/api/billingService';
import GenericModal from '../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../core/components/shared/core/DeleteConfirmationModal';

const PlansList = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchPlans = () => {
            billingService.getPlans()
                .then(d => setPlans(d))
                .catch(e => console.error(e))
                .finally(() => setLoading(false));
        };
        fetchPlans();
    }, []);

    const fetchOnlyPlans = async () => {
        try {
            const data = await billingService.getPlans();
            setPlans(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async (formData) => {
        setActionLoading(true);
        // Ensure features is an array if entered as string
        let payload = { ...formData };
        if (typeof payload.features === 'string') {
            payload.features = payload.features.split(',').map(f => f.trim()).filter(f => f);
        }

        try {
            if (selectedPlan) {
                await billingService.updatePlan(selectedPlan.id, payload);
            } else {
                await billingService.createPlan(payload);
            }
            setIsModalOpen(false);
            await fetchOnlyPlans();
        } catch (error) {
            alert('Failed to save plan');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedPlan) return;
        setActionLoading(true);
        try {
            await billingService.deletePlan(selectedPlan.id);
            setIsDeleteModalOpen(false);
            await fetchOnlyPlans();
        } catch (error) {
            alert('Failed to delete plan');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const PLAN_FIELDS = [
        { name: 'name', label: 'Plan Name', required: true },
        { name: 'price', label: 'Price ($)', type: 'number', step: '0.01', required: true },
        { name: 'interval', label: 'Interval', type: 'select', options: [
            { value: 'month', label: 'Monthly' },
            { value: 'year', label: 'Yearly' }
        ], default: 'month' },
        { name: 'popular', label: 'Most Popular', type: 'checkbox' },
        { name: 'features', label: 'Features (Comma separated)', type: 'textarea' }
    ];

    return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <Layers className="text-emerald-400" size={28} />
                    Subscription Plans
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Manage pricing tiers and subscription offerings</p>
            </div>
            <button onClick={() => { setSelectedPlan(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                <Plus size={16} /> Add Plan
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
                <div className="col-span-full py-16 text-center text-slate-500">Loading Plans...</div>
            ) : plans.length === 0 ? (
                <div className="col-span-full py-16 text-center text-slate-500">No Plans found</div>
            ) : plans.map(plan => (
                <div key={plan.id} className={`bg-slate-900 border rounded-xl p-6 relative transition-colors hover:border-emerald-500/30 ${plan.popular ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'border-slate-800'}`}>
                    {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-emerald-600 text-white text-[10px] font-bold uppercase rounded-full flex items-center gap-1">
                            <Zap size={10} /> Most Popular
                        </div>
                    )}
                    <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-3xl font-bold text-white">${plan.price}</span>
                        <span className="text-slate-400 text-sm">/{plan.interval}</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                        {Array.isArray(plan.features) ? plan.features.map(f => (
                            <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                                <Check size={14} className="text-emerald-400" /> {f}
                            </li>
                        )) : typeof plan.features === 'string' && plan.features.split(',').map(f => (
                            <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                                <Check size={14} className="text-emerald-400" /> {f.trim()}
                            </li>
                        ))}
                    </ul>
                    <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                        <span className="text-slate-500 text-xs">{plan.active_subs || 0} active subscriptions</span>
                        <div className="flex gap-2">
                            <button onClick={() => { setSelectedPlan(plan); setIsModalOpen(true); }} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"><Edit2 size={14} /> Edit</button>
                            <button onClick={() => { setSelectedPlan(plan); setIsDeleteModalOpen(true); }} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"><Trash2 size={14} /> Delete</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <GenericModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Subscription Plan"
            fields={PLAN_FIELDS}
            initialData={selectedPlan ? { ...selectedPlan, features: Array.isArray(selectedPlan.features) ? selectedPlan.features.join(', ') : selectedPlan.features } : null}
            onSubmit={handleSave}
            loading={actionLoading}
        />

        <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Delete Plan"
            message={`Are you sure you want to delete ${selectedPlan?.name}?`}
            loading={actionLoading}
        />
    </div>
    );
};

export default PlansList;
