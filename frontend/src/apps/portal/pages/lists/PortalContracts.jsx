import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PortalContracts() {
    return (
        <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold dark:text-white text-slate-900">Service Contracts</h1>
                    <p className="dark:text-slate-400 text-slate-500">Review your active agreements and SLAs.</p>
                </div>
            </div>

            <div className="dark:bg-slate-900/50 bg-white border dark:border-slate-800 border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center">
                <ShieldCheck className="w-16 h-16 dark:text-slate-700 text-slate-200 mb-4" />
                <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">No active contracts</h3>
                <p className="dark:text-slate-400 text-slate-500 max-w-md">
                    You don't have any active service contracts at the moment.
                </p>
            </div>
        </div>
    );
}
