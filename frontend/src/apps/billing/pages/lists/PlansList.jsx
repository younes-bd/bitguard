import React, { useState, useEffect } from 'react';
import { CreditCard, Layers, Zap, Check, Plus, Edit2, Trash2, Globe } from 'lucide-react';
import { billingService } from '../../../../core/api/billingService';
import GenericModal from '../../../../core/components/shared/forms/GenericModal';
import DeleteConfirmationModal from '../../../../core/components/shared/core/DeleteConfirmationModal';

const PlansList = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const data = await billingService.getPlans();
            setPlans(Array.isArray(data) ? data : data.results || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        setActionLoading(true);
        let payload = { ...formData };
        
        // Handle included_modules if it's a string
        if (typeof payload.included_modules === 'string') {
            payload.included_modules = payload.included_modules.split(',').map(m => m.trim()).filter(m => m);
        }

        try {
            if (selectedPlan) {
                await billingService.updatePlan(selectedPlan.id, payload);
            } else {
                await billingService.createPlan(payload);
            }
            setIsModalOpen(false);
            fetchPlans();
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
            fetchPlans();
        } catch (error) {
            alert('Failed to delete plan');
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const PLAN_FIELDS = [
        { name: 'name', label: 'Plan Name', required: true },
        { name: 'slug', label: 'Slug', required: true },
        { name: 'price_monthly', label: 'Price Monthly ($)', type: 'number', step: '0.01', required: true },
        { name: 'price_yearly', label: 'Price Yearly ($)', type: 'number', step: '0.01', required: true },
        { name: 'stripe_price_id_monthly', label: 'Stripe Price ID (Monthly)', required: true },
        { name: 'stripe_price_id_yearly', label: 'Stripe Price ID (Yearly)', required: true },
        { name: 'included_modules', label: 'Included Modules (Comma separated)', type: 'textarea' },
        { name: 'is_active', label: 'Is Active', type: 'checkbox' }
    ];

    return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                    <Layers className="text-emerald-400" size={28} />
                    Subscription Plans
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">Manage pricing tiers and module access levels</p>
            </div>
            <button onClick={() => { setSelectedPlan(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-emerald-500/20">
                <Plus size={16} /> Add Plan
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
                <div className="col-span-full py-16 text-center text-slate-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    Loading Plans...
                </div>
            ) : plans.length === 0 ? (
                <div className="col-span-full py-16 text-center text-slate-500 border border-dashed border-slate-700 rounded-xl">No Plans found</div>
            ) : plans.map(plan => (
                <div key={plan.id} className={`glass-panel border rounded-xl p-6 relative transition-all hover:border-emerald-500/30 group ${!plan.is_active ? 'opacity-60 grayscale' : 'border-slate-800'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{plan.slug}</span>
                        </div>
                        {!plan.is_active && (
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold rounded uppercase border border-slate-700">Inactive</span>
                        )}
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-white">${plan.price_monthly}</span>
                            <span className="text-slate-500 text-xs">/ month</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-slate-300">${plan.price_yearly}</span>
                            <span className="text-slate-500 text-xs">/ year</span>
                        </div>
                    </div>

                    <div className="space-y-2 mb-6">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Included Modules</div>
                        <div className="flex flex-wrap gap-2">
                            {Array.isArray(plan.included_modules) ? plan.included_modules.map(m => (
                                <span key={m} className="px-2 py-1 bg-slate-800/50 text-slate-300 text-xs rounded border border-slate-700/50 flex items-center gap-1">
                                    <Check size={10} className="text-emerald-400" /> {m}
                                </span>
                            )) : <span className="text-slate-600 text-xs italic">No modules listed</span>}
                        </div>
                    </div>

                    <div className="border-t border-slate-800/50 pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-slate-500 text-[10px] font-medium uppercase tracking-tighter">
                            <Globe size={10} /> Stripe Integrated
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { setSelectedPlan(plan); setIsModalOpen(true); }} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"><Edit2 size={14} /></button>
                            <button onClick={() => { setSelectedPlan(plan); setIsDeleteModalOpen(true); }} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <GenericModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={selectedPlan ? 'Edit Plan' : 'Create New Plan'}
            fields={PLAN_FIELDS}
            initialData={selectedPlan ? { ...selectedPlan, included_modules: Array.isArray(selectedPlan.included_modules) ? selectedPlan.included_modules.join(', ') : selectedPlan.included_modules } : null}
            onSubmit={handleSave}
            loading={actionLoading}
        />

        <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Delete Plan"
            message={`Are you sure you want to delete ${selectedPlan?.name}? This action cannot be undone.`}
            loading={actionLoading}
        />
    </div>
    );
};

export default PlansList;

