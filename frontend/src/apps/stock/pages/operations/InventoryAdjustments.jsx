import React from 'react';
import { Edit3 } from 'lucide-react';

const InventoryAdjustments = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Edit3 className="text-amber-500" />
                Inventory Adjustments
            </h1>
            <div className="glass-panel p-12 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
                <Edit3 size={48} className="text-slate-600 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Inventory Adjustments Module</h2>
                <p className="text-slate-400 max-w-md">Update stock counts and adjust inventory levels.</p>
            </div>
        </div>
    );
};

export default InventoryAdjustments;
