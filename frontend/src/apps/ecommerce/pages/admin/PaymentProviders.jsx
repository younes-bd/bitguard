import React, { useState, useEffect } from 'react';
import { CreditCard, Save, Loader2, LayoutDashboard, Shield, ShieldAlert, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsService } from '../../../system/api/settingsService';

export default function PaymentProviders() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // We only care about the enabled status here, but we check if keys exist to show connection status
    const [providers, setProviders] = useState({
        stripe: { enabled: false, configured: false },
        paypal: { enabled: false, configured: false }
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await settingsService.getSettings();
            const data = res.data?.results || res.data || [];
            
            const current = { ...providers };
            
            let stripePub = false;
            let stripeSec = false;
            let paypalId = false;
            let paypalSec = false;

            data.forEach(item => {
                if (item.key === 'stripe_enabled') current.stripe.enabled = item.value === 'true';
                if (item.key === 'stripe_publishable_key' && item.value) stripePub = true;
                if (item.key === 'stripe_secret_key' && item.value) stripeSec = true;
                
                if (item.key === 'paypal_enabled') current.paypal.enabled = item.value === 'true';
                if (item.key === 'paypal_client_id' && item.value) paypalId = true;
                if (item.key === 'paypal_secret' && item.value) paypalSec = true;
            });
            
            current.stripe.configured = stripePub && stripeSec;
            current.paypal.configured = paypalId && paypalSec;

            setProviders(current);
        } catch (error) {
            toast.error('Failed to load payment settings');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (provider, enabled) => {
        setSaving(true);
        try {
            const payload = {};
            if (provider === 'stripe') {
                payload.stripe_enabled = enabled ? 'true' : 'false';
            } else if (provider === 'paypal') {
                payload.paypal_enabled = enabled ? 'true' : 'false';
            }
            
            await settingsService.batchUpdateSettings(payload);
            setProviders(p => ({
                ...p,
                [provider]: { ...p[provider], enabled }
            }));
            toast.success(`${provider === 'stripe' ? 'Stripe' : 'PayPal'} is now ${enabled ? 'enabled' : 'disabled'}`);
        } catch (error) {
            toast.error(`Failed to update ${provider} settings`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12 px-4 sm:px-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <LayoutDashboard className="text-sky-400" size={28} /> Payment Providers
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Toggle payment gateways for your eCommerce checkout</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="animate-spin text-sky-500 w-8 h-8" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stripe Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col h-full relative overflow-hidden">
                        {saving && (
                            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                            </div>
                        )}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-[#635BFF]/10 border border-[#635BFF]/20 rounded-xl flex items-center justify-center">
                                    <span className="text-[#635BFF] font-black text-2xl">S</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Stripe</h3>
                                    <p className="text-xs text-slate-400 max-w-[200px]">Credit cards, Apple Pay, Google Pay</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={providers.stripe.enabled} 
                                    onChange={(e) => handleToggle('stripe', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#635BFF]"></div>
                            </label>
                        </div>
                        
                        <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {providers.stripe.configured ? (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        <Shield size={12} /> Connected
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                        <ShieldAlert size={12} /> Not Configured
                                    </span>
                                )}
                            </div>
                            <a href="/admin/settings/payment" className="text-xs font-medium text-slate-400 hover:text-sky-400 flex items-center gap-1 transition-colors">
                                <Key size={14} /> Configure Keys
                            </a>
                        </div>
                    </div>

                    {/* PayPal Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col h-full relative overflow-hidden">
                        {saving && (
                            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                            </div>
                        )}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-[#00457C]/10 border border-[#00457C]/20 rounded-xl flex items-center justify-center">
                                    <span className="text-[#0079C1] font-black text-2xl italic">P</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">PayPal</h3>
                                    <p className="text-xs text-slate-400 max-w-[200px]">PayPal balances, bank accounts</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={providers.paypal.enabled} 
                                    onChange={(e) => handleToggle('paypal', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0079C1]"></div>
                            </label>
                        </div>
                        
                        <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {providers.paypal.configured ? (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        <Shield size={12} /> Connected
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                        <ShieldAlert size={12} /> Not Configured
                                    </span>
                                )}
                            </div>
                            <a href="/admin/settings/payment" className="text-xs font-medium text-slate-400 hover:text-sky-400 flex items-center gap-1 transition-colors">
                                <Key size={14} /> Configure Keys
                            </a>
                        </div>
                    </div>

                    {/* Wire Transfer Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col h-full opacity-60 grayscale relative">
                        <div className="absolute top-2 right-2 bg-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1 rounded">Coming Soon</div>
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                                    <CreditCard className="text-emerald-500" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Wire Transfer</h3>
                                    <p className="text-xs text-slate-400 max-w-[200px]">Manual bank transfers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
