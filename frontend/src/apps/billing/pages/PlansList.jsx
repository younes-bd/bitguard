import React from 'react';
import { CreditCard, Layers, Zap, Check } from 'lucide-react';

const MOCK_PLANS = [
    { id: 1, name: 'Starter', price: 29, interval: 'month', features: ['5 Users', '10GB Storage', 'Email Support', 'Basic Reports'], active_subs: 42, popular: false },
    { id: 2, name: 'Professional', price: 99, interval: 'month', features: ['25 Users', '100GB Storage', 'Priority Support', 'Advanced Reports', 'API Access'], active_subs: 128, popular: true },
    { id: 3, name: 'Enterprise', price: 299, interval: 'month', features: ['Unlimited Users', '1TB Storage', '24/7 Dedicated Support', 'Custom Reports', 'Full API', 'SSO & SAML'], active_subs: 35, popular: false },
];

const PlansList = () => (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                <Layers className="text-emerald-400" size={28} />
                Subscription Plans
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Manage pricing tiers and subscription offerings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_PLANS.map(plan => (
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
                        {plan.features.map(f => (
                            <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                                <Check size={14} className="text-emerald-400" /> {f}
                            </li>
                        ))}
                    </ul>
                    <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                        <span className="text-slate-500 text-xs">{plan.active_subs} active subscriptions</span>
                        <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors">Edit Plan</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default PlansList;
