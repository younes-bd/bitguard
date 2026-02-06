import React from 'react';
import { AlertCircle, Clock, Server, Search, Filter } from 'lucide-react';

const SystemLogs = () => {
    // Mock Logs
    const logs = [
        { id: 1, type: 'Error', message: 'Database connection timeout', source: 'PostgreSQL', timestamp: '2 mins ago' },
        { id: 2, type: 'Info', message: 'User login successful (admin@bitguard.com)', source: 'Auth Service', timestamp: '5 mins ago' },
        { id: 3, type: 'Warning', message: 'High memory usage detected', source: 'Worker Node 2', timestamp: '1 hour ago' },
        { id: 4, type: 'Info', message: 'Scheduled backup completed', source: 'Backup Service', timestamp: '3 hours ago' },
        { id: 5, type: 'Error', message: 'Failed payments webhook', source: 'Stripe Integration', timestamp: '5 hours ago' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">System Logs</h1>
                    <p className="text-slate-400">Real-time monitoring and event history.</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-600 transition-colors bg-transparent">
                        <Filter size={18} />
                    </button>
                    <button className="bg-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors border-none cursor-pointer">Export CSV</button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center gap-2">
                <Search size={16} className="text-slate-500 ml-2" />
                <input
                    type="text"
                    placeholder="Search logs..."
                    className="flex-1 bg-transparent border-none text-slate-300 focus:ring-0 text-sm h-8"
                />
            </div>

            {/* Logs List */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-300">Recent Events</h3>
                    <span className="text-xs text-slate-500">Live Updating...</span>
                </div>
                <div className="divide-y divide-slate-800/50">
                    {logs.map(log => (
                        <div key={log.id} className="p-4 hover:bg-slate-800/30 transition-colors flex items-start gap-4">
                            <div className={`mt-1 w-2 h-2 rounded-full 
                                ${log.type === 'Error' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' :
                                    log.type === 'Warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' :
                                        'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]'}`}
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <span className={`text-sm font-mono font-medium 
                                        ${log.type === 'Error' ? 'text-red-400' :
                                            log.type === 'Warning' ? 'text-amber-400' : 'text-blue-400'}`}>
                                        [{log.type.toUpperCase()}]
                                    </span>
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <Clock size={12} /> {log.timestamp}
                                    </span>
                                </div>
                                <p className="text-slate-300 text-sm mt-0.5">{log.message}</p>
                                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                    <Server size={12} />
                                    <span>{log.source}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SystemLogs;
