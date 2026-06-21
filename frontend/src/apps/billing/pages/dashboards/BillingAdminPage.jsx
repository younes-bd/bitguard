import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, XCircle, Calendar, RefreshCw, ExternalLink, Pause, Play, Trash2 } from 'lucide-react';
import { billingService } from '../../../../core/api/billingService';

const statusBadge = (status) => {
    const map = {
        active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        trial: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        past_due: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        paused: 'bg-slate-700 text-slate-300 border-slate-600',
        canceled: 'bg-red-500/10 text-red-400 border-red-500/20',
        incomplete: 'bg-slate-700 text-slate-400 border-slate-600',
    };
    return <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${map[status] ?? 'bg-slate-700 text-slate-400'}`}>{status?.replace('_', ' ')}</span>;
};

const BillingAdminPage = () => {
    const [plans, setPlans] = useState([]);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [p, s] = await Promise.all([
                billingService.getPlans().catch(() => []),
                billingService.getSubscription().catch(() => null),
            ]);
            setPlans(p);
            setSubscription(s);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

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

    const handlePause = async () => {
        if (!subscription || !window.confirm('Pause subscription? You will retain access until the end of the period.')) return;
        setActionLoading(true);
        try {
            await billingService.pauseSubscription(subscription.id);
            loadData();
        } catch (e) {
            alert('Failed to pause');
        } finally {
            setActionLoading(false);
        }
    };

    const handleResume = async () => {
        if (!subscription) return;
        setActionLoading(true);
        try {
            await billingService.resumeSubscription(subscription.id);
            loadData();
        } catch (e) {
            alert('Failed to resume');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!subscription || !window.confirm('Cancel subscription at period end? This action is permanent.')) return;
        setActionLoading(true);
        try {
            await billingService.cancelSubscription(subscription.id);
            loadData();
        } catch (e) {
            alert('Failed to cancel');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Billing & Subscriptions</h1>
                <p className="text-slate-400 text-sm mt-1">Manage your enterprise platform subscription and billing history</p>
            </div>

            {/* Current Subscription Card */}
            {subscription ? (
                <div className="glass-panel p-8 rounded-2xl border border-slate-700/50 bg-slate-800/20 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-24 bg-emerald-500/5 blur-3xl rounded-full -mr-12 -mt-12"></div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div className="space-y-3">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Subscription</div>
                            <div className="flex items-center gap-4">
                                <h2 className="text-3xl font-bold text-white">{subscription.plan_name || 'Standard Plan'}</h2>
                                {statusBadge(subscription.status)}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-emerald-500" /> Renews: {new Date(subscription.current_period_end).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1.5"><CreditCard size={14} className="text-blue-500" /> Stripe ID: {subscription.stripe_subscription_id}</span>
                            </div>
                            {subscription.cancel_at_period_end && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                                    <XCircle size={14} />
                                    Subscription will terminate on {new Date(subscription.current_period_end).toLocaleDateString()}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {subscription.status === 'paused' ? (
                                <button onClick={handleResume} disabled={actionLoading} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20">
                                    <Play size={18} /> Resume
                                </button>
                            ) : (
                                !subscription.cancel_at_period_end && (
                                    <>
                                        <button onClick={handlePause} disabled={actionLoading} className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-slate-700 transition-all">
                                            <Pause size={18} /> Pause
                                        </button>
                                        <button onClick={handleCancel} disabled={actionLoading} className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-bold border border-red-500/20 transition-all">
                                            <Trash2 size={18} /> Cancel
                                        </button>
                                    </>
                                )
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass-panel p-8 rounded-2xl border border-dashed border-slate-700 text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <CreditCard size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">No Active Subscription</h2>
                    <p className="text-slate-400 text-sm max-w-md mx-auto">Select a plan below to activate your enterprise dashboard and begin monitoring your infrastructure.</p>
                </div>
            )}

            {/* Plans Grid */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-white">Upgrade Your Experience</h2>
                    <div className="h-px flex-1 bg-slate-800"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map(plan => {
                        const isCurrent = subscription?.plan === plan.id;
                        return (
                            <div key={plan.id} className={`glass-panel p-8 rounded-2xl border transition-all flex flex-col gap-6 relative group
                                ${isCurrent ? 'border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/20' : 'border-slate-800 hover:border-slate-600'}`}>
                                
                                {isCurrent && (
                                    <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase rounded-full shadow-lg shadow-emerald-600/30">
                                        Current Plan
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{plan.name}</h3>
                                    <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">{plan.slug}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-white">${plan.price_monthly}</span>
                                        <span className="text-slate-500 text-sm">/ mo</span>
                                    </div>
                                    <div className="text-xs text-slate-500">Or billed annually at <span className="text-slate-300 font-bold">${plan.price_yearly}</span></div>
                                </div>

                                <div className="space-y-3 flex-1">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Capabilities</div>
                                    <ul className="space-y-2">
                                        {Array.isArray(plan.included_modules) && plan.included_modules.map(m => (
                                            <li key={m} className="flex items-center gap-2 text-sm text-slate-300">
                                                <CheckCircle size={14} className="text-emerald-500" /> {m}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {!isCurrent && (
                                    <div className="flex flex-col gap-2 pt-4 border-t border-slate-800/50">
                                        <button onClick={() => handleSubscribe(plan.id, 'monthly')} disabled={!!subscribing}
                                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50">
                                            {subscribing === plan.id ? 'Redirecting...' : 'Subscribe Monthly'}
                                        </button>
                                        <button onClick={() => handleSubscribe(plan.id, 'yearly')} disabled={!!subscribing}
                                            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold border border-slate-700 transition-all">
                                            Subscribe Yearly
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

