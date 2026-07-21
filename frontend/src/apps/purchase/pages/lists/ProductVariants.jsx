import React from 'react';
import { Layers } from 'lucide-react';

const ProductVariants = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Layers className="text-orange-500" />
                Product Variants
            </h1>
            <div className="glass-panel p-12 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
                <Layers size={48} className="text-slate-600 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Product Variants Module</h2>
                <p className="text-slate-400 max-w-md">Manage purchase product variants.</p>
            </div>
        </div>
    );
};

export default ProductVariants;
