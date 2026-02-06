import React, { useEffect, useState } from 'react';
import { storeService } from '../../../shared/core/services/storeService';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [annual, setAnnual] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await storeService.getPlans();
            setPlans(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (plan) => {
        navigate('/store/checkout', { state: { plan, interval: annual ? 'year' : 'month' } });
    };

    return (
        <div className="py-10">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
                <p className="text-slate-400 max-w-xl mx-auto mb-8">
                    Choose the plan that fits your security needs. No hidden fees.
                </p>

                {/* Toggle */}
                <div className="inline-flex bg-slate-900 p-1 rounded-full border border-slate-800">
                    <button
                        onClick={() => setAnnual(false)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!annual ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setAnnual(true)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${annual ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Yearly <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded ml-1 text-white">Save 20%</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, idx) => {
                    const isPopular = plan.name.toLowerCase().includes('pro');
                    const price = annual ? plan.price_yearly : plan.price_monthly;

                    return (
                        <div
                            key={plan.id}
                            className={`relative rounded-3xl bg-slate-900 border p-8 flex flex-col ${isPopular
                                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-2xl shadow-indigo-500/10 scale-105 z-10'
                                    : 'border-slate-800'
                                }`}
                        >
                            {isPopular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-white">${price}</span>
                                <span className="text-slate-500">/{annual ? 'year' : 'month'}</span>
                            </div>

                            <button
                                onClick={() => handleSelect(plan)}
                                className={`w-full py-3 rounded-xl font-bold mb-8 transition-colors ${isPopular
                                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                                    }`}
                            >
                                Get Started
                            </button>

                            <div className="space-y-4 flex-1">
                                {(plan.included_modules || []).map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                        <div className="mt-0.5 p-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        {feature.replace(/_/g, ' ')} Module
                                    </div>
                                ))}
                                <div className="flex items-start gap-3 text-sm text-slate-300">
                                    <div className="mt-0.5 p-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    24/7 Support
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PricingPage;


