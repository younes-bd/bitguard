import React, { useState } from 'react';
import { ShieldCheck, Search, Clock, AlertCircle } from 'lucide-react';

const MOCK_SLA_TIERS = [
    { id: 1, name: 'Platinum', first_response_hours: 1, resolution_hours: 4, priority: 'critical', active_contracts: 5 },
    { id: 2, name: 'Gold', first_response_hours: 4, resolution_hours: 12, priority: 'high', active_contracts: 12 },
    { id: 3, name: 'Silver', first_response_hours: 8, resolution_hours: 24, priority: 'medium', active_contracts: 28 },
    { id: 4, name: 'Bronze', first_response_hours: 24, resolution_hours: 72, priority: 'low', active_contracts: 15 },
];

const SlaTiersPage = () => (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                <ShieldCheck className="text-amber-400" size={28} />
                SLA Tiers
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Define service level agreements and response time targets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK_SLA_TIERS.map(tier => (
                <div key={tier.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-amber-500/30 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-bold text-lg">{tier.name}</h3>
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-bold uppercase">{tier.priority}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-1.5"><Clock size={13} /> First Response</span>
                            <span className="text-white font-semibold">{tier.first_response_hours}h</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-1.5"><AlertCircle size={13} /> Resolution</span>
                            <span className="text-white font-semibold">{tier.resolution_hours}h</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                            <span className="text-slate-500 text-xs">Active Contracts</span>
                            <span className="text-emerald-400 font-bold">{tier.active_contracts}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default SlaTiersPage;
