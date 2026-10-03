import React from 'react';
import { Settings, Grid } from 'lucide-react';

export default function PlaceholderPage({ title, module }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mt-6">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                {module === 'settings' ? <Settings size={32} /> : <Grid size={32} />}
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {title || 'Under Construction'}
            </h2>
            <p className="text-slate-500 max-w-md">
                This section is currently being built to provide advanced configuration parity with the core Odoo architecture.
            </p>
        </div>
    );
}
