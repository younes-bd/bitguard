import React from 'react';
import { TrendingUp } from 'lucide-react';

const Forecast = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="text-blue-500" />
                Sales Forecast
            </h1>
            <div className="glass-panel p-12 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
                <TrendingUp size={48} className="text-slate-600 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">No Forecast Data Available</h2>
                <p className="text-slate-400 max-w-md">Sales forecasts will appear here once you have sufficient historical deal data and active pipeline metrics.</p>
            </div>
        </div>
    );
};

export default Forecast;
