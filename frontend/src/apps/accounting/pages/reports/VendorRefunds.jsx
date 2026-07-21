import React from 'react';
import { RefreshCw } from 'lucide-react';

const VendorRefunds = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <RefreshCw className="text-emerald-500" />
                Vendor Refunds
            </h1>
            <div className="glass-panel p-12 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
                <RefreshCw size={48} className="text-slate-600 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Vendor Refunds Management</h2>
                <p className="text-slate-400 max-w-md">Track refunds and credit notes from vendors.</p>
            </div>
        </div>
    );
};

export default VendorRefunds;
