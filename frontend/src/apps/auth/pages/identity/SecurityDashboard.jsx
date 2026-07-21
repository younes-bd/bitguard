import React from 'react';
import { Shield, Users, Key, AlertTriangle } from 'lucide-react';

const SecurityDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Identity & Security Dashboard</h1>
                    <p className="text-slate-400 mt-1">Overview of IAM and security metrics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Placeholder Metrics */}
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Users size={20} />
                        </div>
                        <span className="text-sm font-medium text-blue-500">Active</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-100 mb-1">0</h3>
                    <p className="text-sm text-slate-500">Total Users</p>
                </div>
                
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Shield size={20} />
                        </div>
                        <span className="text-sm font-medium text-emerald-500">Secure</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-100 mb-1">0</h3>
                    <p className="text-sm text-slate-500">Roles Defined</p>
                </div>
                
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <Key size={20} />
                        </div>
                        <span className="text-sm font-medium text-slate-400">Total</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-100 mb-1">0</h3>
                    <p className="text-sm text-slate-500">API Keys</p>
                </div>
                
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <AlertTriangle size={20} />
                        </div>
                        <span className="text-sm font-medium text-amber-500">7 Days</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-100 mb-1">0</h3>
                    <p className="text-sm text-slate-500">Security Events</p>
                </div>
            </div>
            
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-8 text-center text-slate-500">
                <Shield size={48} className="mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-slate-300 mb-2">System Secure</h3>
                <p>All security and identity systems are operating normally.</p>
            </div>
        </div>
    );
};

export default SecurityDashboard;
