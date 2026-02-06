import React from 'react';
import { Shield, AlertTriangle, Activity, CheckCircle, XCircle, Search } from 'lucide-react';

const SecurityOverview = () => {
    return (
        <div className="h-full rounded-xl bg-slate-800 border border-slate-700 p-5">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-indigo-400" />
                    <h3 className="font-semibold text-white">Security Posture</h3>
                </div>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Activity className="h-3 w-3" />
                    Live
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Critical Alerts */}
                <div className="col-span-2 rounded-lg bg-red-50 p-4 border border-red-100 dark:border-red-900/30 dark:bg-red-900/10">
                    <div className="mb-1 flex items-center gap-2 text-red-700 dark:text-red-400">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-semibold">Critical Alerts</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-red-700 dark:text-red-400">2</span>
                        <span className="text-xs text-red-600/80 dark:text-red-400/80">Require attention</span>
                    </div>
                </div>

                {/* Incidents */}
                <div className="rounded-lg bg-slate-700/50 p-4 border border-slate-700">
                    <p className="text-sm font-medium text-slate-400">Active Incidents</p>
                    <p className="mt-1 text-2xl font-bold text-white">1</p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-700">
                        <div className="h-1.5 rounded-full bg-amber-500" style={{ width: '25%' }}></div>
                    </div>
                </div>

                {/* Offline Assets */}
                <div className="rounded-lg bg-slate-700/50 p-4 border border-slate-700">
                    <p className="text-sm font-medium text-slate-400">Offline Assets</p>
                    <p className="mt-1 text-2xl font-bold text-white">3</p>
                    <p className="text-xs text-slate-500">of 142 total</p>
                </div>
            </div>

            {/* Compliance / Scans */}
            <div className="mt-6 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Compliance & Scans</h4>

                <div className="flex items-center justify-between rounded-md border border-slate-700 p-2 bg-slate-700/30">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm text-slate-300">Daily Malware Scan</span>
                    </div>
                    <span className="text-xs text-emerald-400">Passed</span>
                </div>

                <div className="flex items-center justify-between rounded-md border border-slate-100 p-2 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">Patch Compliance</span>
                    </div>
                    <span className="text-xs text-amber-600 dark:text-amber-400">92% (Warning)</span>
                </div>
            </div>

            <div className="mt-4 text-center">
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    View SOC Dashboard &rarr;
                </button>
            </div>
        </div>
    );
};

export default SecurityOverview;
