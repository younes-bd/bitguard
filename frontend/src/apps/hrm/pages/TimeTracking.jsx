import React, { useEffect, useState } from 'react';
import { Clock, Search, Calendar, User, Timer } from 'lucide-react';

const TimeTracking = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Clock className="text-pink-400" size={28} />
                        Time Tracking
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Log and monitor employee time entries across projects</p>
                </div>
                <button className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                    <Timer size={14} /> Log Time
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">This Week</div>
                    <div className="text-3xl font-bold text-white">0h</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">This Month</div>
                    <div className="text-3xl font-bold text-pink-400">0h</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Billable %</div>
                    <div className="text-3xl font-bold text-emerald-400">0%</div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                <Clock size={48} className="mx-auto mb-4 text-slate-700" />
                <h3 className="text-white font-semibold text-lg mb-2">No Time Entries Yet</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">Start logging time entries for employees. Time data is available from the /api/hrm/time-entries/ endpoint.</p>
            </div>
        </div>
    );
};

export default TimeTracking;
