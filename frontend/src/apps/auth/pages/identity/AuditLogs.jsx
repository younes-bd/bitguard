import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Loader2 } from 'lucide-react';
import client from '../../../../core/api/client';

export default function AuditLogs() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white uppercase flex items-center gap-3">
                <Activity className="text-emerald-400" /> Security Audit Logs
            </h1>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-800 text-slate-500">
                            <th className="pb-3 text-sm font-medium">Timestamp</th>
                            <th className="pb-3 text-sm font-medium">Event Vector</th>
                            <th className="pb-3 text-sm font-medium">Principal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {[1,2,3,4,5].map(r => (
                            <tr key={r}>
                                <td className="py-4 text-slate-400 text-sm">{new Date().toLocaleString()}</td>
                                <td className="py-4 text-white font-medium">IAM_AUTH_GRANTED</td>
                                <td className="py-4 text-emerald-400 font-mono text-sm">admin@bitguard.tech</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
