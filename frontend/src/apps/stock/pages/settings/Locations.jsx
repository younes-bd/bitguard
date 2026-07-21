import React from 'react';
import { MapPin } from 'lucide-react';

const Locations = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <MapPin className="text-amber-500" />
                Locations
            </h1>
            <div className="glass-panel p-12 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
                <MapPin size={48} className="text-slate-600 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Locations Module</h2>
                <p className="text-slate-400 max-w-md">Configure specific inventory locations.</p>
            </div>
        </div>
    );
};

export default Locations;
