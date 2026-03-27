import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, XCircle, Calendar, RefreshCw, ExternalLink } from 'lucide-react';
import billingService from '../../../core/api/billingService';

const statusBadge = (status) => {
    const map = {
        active: 'bg-emerald-500/10 text-emerald-400',
        trial: 'bg-blue-500/10 text-blue-400',
        past_due: 'bg-amber-500/10 text-amber-400',
        canceled: 'bg-slate-700 text-slate-400',
        incomplete: 'bg-slate-700 text-slate-400',
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>{status?.replace('_', ' ')}</span>;
};

const BillingAdminPage = () => {
    const [plans, setPlans] = useState([]);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(null);

    useEffect(() => {
        Promise.all([
            billingService.getPlans().catch(() => []),
            billingService.getSubscription().catch(() => null),
        ]).then(([p, s]) => { setPlans(p); setSubscription(s); setLoading(false); });
    }, []);

    const handleSubscribe = async (planId, interval) => {
        setSubscribing(planId);
        try {
            const { checkout_url } = await billingService.subscribe(planId, interval);
            if (checkout_url) window.location.href = checkout_url;
        } catch (e) {
            alert(e?.response?.data?.error ?? 'Failed to start checkout. Check Stripe configuration.');
        } finally {
            setSubscribing(null);
        }
    };

    const handleCancel = async () => {
        if (!subscription || !window.confirm('Cancel subscription at period end?')) return;
        await billingService.cancelSubscription(subscription.id);
        setSubscription(s => ({ ...s, cancel_at_period_end: true }));
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>;

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Billing & Subscriptions</h1>
                <p className="text-slate-400 text-sm mt-1">Manage your BitGuard Platform subscription</p>
            </div>

            {/* Current Subscription */}
            {subscription && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-2">
                        <p className="text-slate-400 text-xs uppercase tracking-widest">Current Plan</p>
                        <p className="text-2xl font-bold text-white">{subscription.plan?.name ?? '—'}</p>
                        <div className="flex items-center gap-3">{statusBadge(subscription.status)}
                            {subscription.current_period_end && (
                                <span className="text-slate-500 text-xs flex items-center gap-1">
                                    <Calendar size={11} /> Renews {new Date(subscription.current_period_end).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        {subscription.cancel_at_period_end && (
                            <p className="text-amber-400 text-xs">⚠ Cancels at end of billing period</p>
                        )}
                    </div>
                    {!subscription.cancel_at_period_end && subscription.status === 'active' && (
                        <button onClick={handleCancel}
                            className="self-start px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-semibold transition-colors">
                            Cancel Subscription
                        </button>
                    )}
                </div>
            )}

            {/* Plans Grid */}
            <div>
                <h2 className="text-lg font-bold text-white mb-4">Available Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.length === 0 ? (
                        <p className="text-slate-500 col-span-3 text-center py-8">No plans configured yet. Add plans in the Django admin.</p>
                    ) : plans.map(plan => {
                        const isCurrent = subscription?.plan?.id === plan.id;
                        return (
                            <div key={plan.id} className={`bg-slate-900 border rounded-2xl p-6 flex flex-col gap-4 transition-all
                                ${isCurrent ? 'border-blue-500/50 ring-1 ring-blue-500/20' : 'border-slate-800 hover:border-slate-700'}`}>
                                {isCurrent && <div className="text-[10px] font-bold uppercase text-blue-400 tracking-widest">Current Plan</div>}
                                <div>
                                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                    <p className="text-slate-400 text-sm mt-1">{plan.description ?? 'Enterprise plan'}</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-white">${plan.price_monthly}<span className="text-slate-400 text-sm font-normal">/mo</span></p>
                                    <p className="text-slate-500 text-xs mt-0.5">${plan.price_yearly}/yr (save {Math.round((1 - (plan.price_yearly / (plan.price_monthly * 12))) * 100)}%)</p>
                                </div>
                                {plan.included_modules?.length > 0 && (
                                    <ul className="space-y-1.5 text-sm text-slate-300">
                                        {plan.included_modules.map(m => (
                                            <li key={m} className="flex items-center gap-2"><CheckCircle size={13} className="text-emerald-400" />{m}</li>
                                        ))}
                                    </ul>
                                )}
                                {!isCurrent && (
                                    <div className="flex gap-2 mt-auto pt-2">
                                        <button onClick={() => handleSubscribe(plan.id, 'monthly')} disabled={!!subscribing}
                                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40">
                                            {subscribing === plan.id ? 'Redirecting…' : 'Monthly'}
                                        </button>
                                        <button onClick={() => handleSubscribe(plan.id, 'yearly')} disabled={!!subscribing}
                                            className="flex-1 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40">
                                            Yearly
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BillingAdminPage;
