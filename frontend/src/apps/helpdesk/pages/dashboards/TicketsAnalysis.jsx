import React from 'react';
import { BarChart3, Download } from 'lucide-react';

const TicketsAnalysis = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <BarChart3 className="text-blue-400" size={28} /> Tickets Analysis
                    </h1>
                    <p className="text-slate-400">Analyze ticket volume, resolution times, and team performance.</p>
                </div>
                <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Download size={20} /> Export Report
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-slate-400 text-sm font-semibold mb-1">Total Tickets</h3>
                    <p className="text-3xl font-bold text-white">0</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-slate-400 text-sm font-semibold mb-1">Avg Resolution Time</h3>
                    <p className="text-3xl font-bold text-white">--</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-slate-400 text-sm font-semibold mb-1">Customer Satisfaction</h3>
                    <p className="text-3xl font-bold text-emerald-400">0%</p>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
                <BarChart3 size={48} className="mx-auto mb-4 text-slate-700" />
                <p className="text-lg">Not enough data to generate analytics.</p>
                <p className="text-sm mt-2">Start closing tickets to see performance metrics here.</p>
            </div>
        </div>
    );
};

export default TicketsAnalysis;
