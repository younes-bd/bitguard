import React from 'react';
import { Calendar, BarChart3 } from 'lucide-react';

const ActivitiesReport = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Calendar className="text-blue-500" />
                Activities Analysis
            </h1>
            <div className="glass-panel p-12 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
                <BarChart3 size={48} className="text-slate-600 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Activity Reporting</h2>
                <p className="text-slate-400 max-w-md">Track team activity levels, meeting outcomes, and communication metrics.</p>
            </div>
        </div>
    );
};

export default ActivitiesReport;
