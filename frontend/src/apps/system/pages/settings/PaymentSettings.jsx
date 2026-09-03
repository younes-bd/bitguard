import React, { useState, useEffect } from 'react';
import { CreditCard, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsService } from '../../api/settingsService';

export default function PaymentSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [providers, setProviders] = useState({
        stripe: { enabled: false, publishable_key: '', secret_key: '' },
        paypal: { enabled: false, client_id: '', secret: '' }
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await settingsService.getSettings();
            const data = res.data?.results || res.data || [];
            
            const current = { ...providers };
            
            data.forEach(item => {
                if (item.key === 'stripe_enabled') current.stripe.enabled = item.value === 'true';
                if (item.key === 'stripe_publishable_key') current.stripe.publishable_key = item.value;
                if (item.key === 'stripe_secret_key') current.stripe.secret_key = item.value;
                
                if (item.key === 'paypal_enabled') current.paypal.enabled = item.value === 'true';
                if (item.key === 'paypal_client_id') current.paypal.client_id = item.value;
                if (item.key === 'paypal_secret') current.paypal.secret = item.value;
            });
            
            setProviders(current);
        } catch (error) {
            toast.error('Failed to load payment settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                stripe_enabled: providers.stripe.enabled ? 'true' : 'false',
                stripe_publishable_key: providers.stripe.publishable_key,
                stripe_secret_key: providers.stripe.secret_key,
                paypal_enabled: providers.paypal.enabled ? 'true' : 'false',
                paypal_client_id: providers.paypal.client_id,
                paypal_secret: providers.paypal.secret
            };
            
            await settingsService.batchUpdateSettings(payload);
            toast.success('Payment settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-purple-500 w-8 h-8" /></div>;

    return (
        <div className="p-6 max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
                    <CreditCard className="text-purple-500" />
                    Payment Providers
                </h1>
                <p className="text-slate-400">Configure payment gateways for accepting payments.</p>
            </div>

            <div className="space-y-4">
                {/* Stripe */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#635BFF]/20 rounded-lg flex items-center justify-center">
                                <span className="text-[#635BFF] font-bold text-xl">S</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Stripe</h3>
                                <p className="text-sm text-slate-400">Accept credit cards and local payment methods</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={providers.stripe.enabled} onChange={e => setProviders(p => ({...p, stripe: {...p.stripe, enabled: e.target.checked}}))} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#635BFF]"></div>
                        </label>
                    </div>
                    {providers.stripe.enabled && (
                        <div className="space-y-4 pt-4 border-t border-slate-800">
                            <div>
                                <label className="text-sm font-medium text-slate-400">Publishable Key</label>
                                <input
                                    value={providers.stripe.publishable_key}
                                    onChange={e => setProviders(p => ({...p, stripe: {...p.stripe, publishable_key: e.target.value}}))}
                                    className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                                    placeholder="pk_live_..."
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">Secret Key</label>
                                <input
                                    type="password"
                                    value={providers.stripe.secret_key}
                                    onChange={e => setProviders(p => ({...p, stripe: {...p.stripe, secret_key: e.target.value}}))}
                                    className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                                    placeholder="sk_live_..."
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* PayPal */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#00457C]/20 rounded-lg flex items-center justify-center">
                                <span className="text-[#0079C1] font-bold text-xl">P</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">PayPal</h3>
                                <p className="text-sm text-slate-400">Accept payments via PayPal accounts</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={providers.paypal.enabled} onChange={e => setProviders(p => ({...p, paypal: {...p.paypal, enabled: e.target.checked}}))} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0079C1]"></div>
                        </label>
                    </div>
                    {providers.paypal.enabled && (
                        <div className="space-y-4 pt-4 border-t border-slate-800">
                            <div>
                                <label className="text-sm font-medium text-slate-400">Client ID</label>
                                <input
                                    value={providers.paypal.client_id}
                                    onChange={e => setProviders(p => ({...p, paypal: {...p.paypal, client_id: e.target.value}}))}
                                    className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">Secret</label>
                                <input
                                    type="password"
                                    value={providers.paypal.secret}
                                    onChange={e => setProviders(p => ({...p, paypal: {...p.paypal, secret: e.target.value}}))}
                                    className="mt-1 flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Settings
                </button>
            </div>
        </div>
    );
}
