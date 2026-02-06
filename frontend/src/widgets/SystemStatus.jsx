import React from 'react';
import { Database, Server, RefreshCw, HardDrive } from 'lucide-react';

const SystemStatus = () => {
    return (
        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-white">Platform Health</h3>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            </div>

            <div className="space-y-4">
                {/* API Status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Server className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">API Gateway</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Operational</span>
                </div>

                {/* Queue Length */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <RefreshCw className="h-3 w-3" /> Job Queue
                        </span>
                        <span className="text-slate-900 dark:text-white">124 jobs</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-1.5 rounded-full bg-blue-500" style={{ width: '40%' }}></div>
                    </div>
                </div>

                {/* Storage */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <HardDrive className="h-3 w-3" /> Storage
                        </span>
                        <span className="text-slate-900 dark:text-white">45% used</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: '45%' }}></div>
                    </div>
                </div>

                {/* Error Rate */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                    <span className="text-xs text-slate-500">Error Rate (1h)</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">0.02%</span>
                </div>
            </div>
        </div>
    );
};

export default SystemStatus;
