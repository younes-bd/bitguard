import React from 'react';
import { Trash2 } from 'lucide-react';

const Scrap = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Trash2 className="text-amber-500" />
                Scrap
            </h1>
            <div className="glass-panel p-12 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
                <Trash2 size={48} className="text-slate-600 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Scrap Module</h2>
                <p className="text-slate-400 max-w-md">Record scrapped materials and products.</p>
            </div>
        </div>
    );
};

export default Scrap;
