import React from 'react';
import { Settings, Lock, Fingerprint } from 'lucide-react';

export default function SecuritySettings() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white uppercase flex items-center gap-3">
                <Settings className="text-blue-400" /> Identity Configuration
            </h1>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-2xl">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-800">
                    <div>
                        <h3 className="text-white font-bold flex items-center gap-2"><Lock size={18}/> Enforce MFA Globally</h3>
                        <p className="text-sm text-slate-400 mt-1">Require authenticators across all operational scopes</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition">Enable</button>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-bold flex items-center gap-2"><Fingerprint size={18}/> Password Complexity</h3>
                        <p className="text-sm text-slate-400 mt-1">Rotate constraints and minimum entropies</p>
                    </div>
                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-medium transition">Configure</button>
                </div>
            </div>
        </div>
    );
}
