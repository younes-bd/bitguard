import React from 'react';
import { BookOpen } from 'lucide-react';

const Journals = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <BookOpen className="text-emerald-500" />
                Journals
            </h1>
            <div className="glass-panel p-12 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
                <BookOpen size={48} className="text-slate-600 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Accounting Journals</h2>
                <p className="text-slate-400 max-w-md">Configure and review accounting journals (Sales, Purchase, Bank, Cash, Miscellaneous).</p>
            </div>
        </div>
    );
};

export default Journals;
