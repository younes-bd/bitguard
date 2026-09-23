import React from 'react';
import { Activity } from 'lucide-react';

const AttendancePage = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Activity className="text-pink-500" />
                Attendance & Reports
            </h1>
            <div className="glass-panel p-12 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
                <Activity size={48} className="text-slate-600 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Attendance & Reports Module</h2>
                <p className="text-slate-400 max-w-md">Track employee attendance and work hours.</p>
            </div>
        </div>
    );
};

export default AttendancePage;
