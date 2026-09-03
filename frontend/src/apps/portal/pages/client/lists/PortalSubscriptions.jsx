import React, { useState, useEffect } from 'react';
import { Cloud } from 'lucide-react';
import { ecommerceService } from '../../../../ecommerce/api/ecommerceService';
import toast from 'react-hot-toast';

export default function PortalSubscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const data = await ecommerceService.getSubscriptions();
                const items = data?.data || data?.results || data || [];
                setSubscriptions(Array.isArray(items) ? items : []);
            } catch (error) {
                toast.error('Failed to load subscriptions');
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptions();
    }, []);

    return (
        <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500">
                    <Cloud className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold dark:text-white text-slate-900">SaaS Subscriptions</h1>
                    <p className="dark:text-slate-400 text-slate-500">Manage your active cloud software subscriptions.</p>
                </div>
            </div>

            <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <th className="p-4 font-semibold">Plan Name</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Billing Cycle</th>
                            <th className="p-4 font-semibold">Next Billing Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-slate-500">
                                    <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-2"></div>
                                    Loading subscriptions...
                                </td>
                            </tr>
                        ) : subscriptions.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-slate-500">
                                    <Cloud size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                                    No active subscriptions found.
                                </td>
                            </tr>
                        ) : (
                            subscriptions.map(sub => (
                                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{sub.plan_name || sub.plan?.name || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            sub.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                                            sub.status === 'trialing' ? 'bg-blue-100 text-blue-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                            {sub.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm capitalize">{sub.billing_cycle || sub.plan?.billing_cycle || 'N/A'}</td>
                                    <td className="p-4 text-slate-500 text-sm">{sub.next_billing_date || sub.current_period_end?.split('T')[0] || 'N/A'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

