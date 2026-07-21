import React from 'react';
import { ShieldAlert, Download } from 'lucide-react';

const SlaStatusAnalysis = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <ShieldAlert className="text-red-400" size={28} /> SLA Status Analysis
                    </h1>
                    <p className="text-slate-400">Monitor SLA compliance, breaches, and ongoing risks.</p>
                </div>
                <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Download size={20} /> Export Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-slate-400 text-sm font-semibold mb-1">SLA Success Rate</h3>
                    <p className="text-3xl font-bold text-emerald-400">0%</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-slate-400 text-sm font-semibold mb-1">Active Breaches</h3>
                    <p className="text-3xl font-bold text-red-400">0</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-slate-400 text-sm font-semibold mb-1">Tickets at Risk</h3>
                    <p className="text-3xl font-bold text-amber-400">0</p>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
                <ShieldAlert size={48} className="mx-auto mb-4 text-slate-700" />
                <p className="text-lg">No SLA data to display.</p>
                <p className="text-sm mt-2">SLA tracking will activate once policies are assigned to tickets.</p>
            </div>
        </div>
    );
};

export default SlaStatusAnalysis;
