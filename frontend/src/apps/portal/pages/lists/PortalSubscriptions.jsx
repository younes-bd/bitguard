import React from 'react';
import { Cloud } from 'lucide-react';

export default function PortalSubscriptions() {
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

            <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center">
                <Cloud className="w-16 h-16 dark:text-slate-700 text-slate-200 mb-4" />
                <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">No active subscriptions</h3>
                <p className="dark:text-slate-400 text-slate-500 max-w-md">
                    You don't have any active SaaS subscriptions right now.
                </p>
            </div>
        </div>
    );
}
