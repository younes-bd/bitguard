import React, { useState, useEffect } from 'react';
import { Shield, Lock, Users, Loader2 } from 'lucide-react';
import client from '../../../../core/api/client';

export default function PermissionsList() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white uppercase flex items-center gap-3">
                <Shield className="text-purple-400" /> Granular Permissions
            </h1>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-800 text-slate-500">
                            <th className="pb-3 text-sm font-medium">Policy Node</th>
                            <th className="pb-3 text-sm font-medium">Description</th>
                            <th className="pb-3 text-sm font-medium">Enforcement Model</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {['StoreAdmin', 'SystemAdmin', 'HelpdeskOperator', 'FinancialControl', 'Employee'].map(r => (
                            <tr key={r}>
                                <td className="py-4 text-white font-medium">{r}_Policy</td>
                                <td className="py-4 text-slate-400 text-sm">Provides access to the {r.toLowerCase()} sub-mesh.</td>
                                <td className="py-4">
                                    <span className="px-2 py-0.5 rounded textxs bg-purple-500/20 text-purple-400 border border-purple-500/20">
                                        RBAC Strict
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
