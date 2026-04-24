import React from 'react';
import { ShieldCheck, Users, Key, AlertTriangle, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const IamDashboard = () => {
    // Mock metrics for IAM Dashboard
    const metrics = {
        totalUsers: 142,
        activeRoles: 8,
        activeTenants: 12,
        failedLogins: 3
    };

    const recentActivity = [
        { id: 1, action: "User created", user: "admin@bitguard.com", target: "john.doe@example.com", time: "10 mins ago" },
        { id: 2, action: "Role assigned", user: "admin@bitguard.com", target: "jane.smith@example.com (Manager)", time: "25 mins ago" },
        { id: 3, action: "Failed login", user: "System", target: "unknown IP 192.168.1.45", time: "1 hour ago", alert: true }
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <ShieldCheck size={28} className="text-violet-400" />
                        Identity & Access
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Manage users, roles, and security policies</p>
                </div>
                <Link to="/admin/iam/users" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-semibold transition-colors">
                    Manage Users
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
                    <div className="p-3 bg-violet-500/10 text-violet-400 rounded-lg"><Users size={20} /></div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Users</p>
                        <p className="text-2xl font-bold text-white">{metrics.totalUsers}</p>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg"><Key size={20} /></div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Active Roles</p>
                        <p className="text-2xl font-bold text-white">{metrics.activeRoles}</p>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg"><ShieldCheck size={20} /></div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Active Tenants</p>
                        <p className="text-2xl font-bold text-white">{metrics.activeTenants}</p>
                    </div>
                </div>
                <div className="bg-slate-900 border border-rose-500/30 rounded-xl p-5 flex items-start gap-4 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                    <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg"><AlertTriangle size={20} /></div>
                    <div>
                        <p className="text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">Failed Logins (24h)</p>
                        <p className="text-2xl font-bold text-rose-400">{metrics.failedLogins}</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Activity size={16} className="text-violet-400" /> Recent Audit Logs
                    </h3>
                    <Link to="/admin/iam/audit" className="text-xs font-bold text-violet-400 uppercase hover:text-violet-300">View All</Link>
                </div>
                <div className="divide-y divide-slate-800">
                    {recentActivity.map(log => (
                        <div key={log.id} className="p-4 flex items-start justify-between hover:bg-slate-800/30 transition-colors">
                            <div>
                                <p className={`text-sm font-semibold ${log.alert ? 'text-rose-400' : 'text-slate-200'}`}>{log.action}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    <span className="font-mono text-slate-400">{log.user}</span> → {log.target}
                                </p>
                            </div>
                            <span className="text-xs text-slate-500">{log.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IamDashboard;
