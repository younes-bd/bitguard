import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Key, AlertTriangle, Activity, Loader2, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usersService } from '../../api/usersService';

const UsersDashboard = () => {
    const [metrics, setMetrics] = useState({
        total_users: 0,
        active_users: 0,
        admin_count: 0,
        staff_count: 0,
        locked_users: 0,
        mfa_adoption: 0
    });
    const [recentLogs, setRecentLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [stats, logs] = await Promise.all([
                    usersService.getDashboardStats(),
                    usersService.getAuditLogs({ limit: 5 })
                ]);
                
                setMetrics(stats);
                setRecentLogs(Array.isArray(logs) ? logs : []);
            } catch (error) {
                console.error("Failed to load IAM data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                <p className="text-slate-500 font-mono animate-pulse">Synchronizing Identity Vault...</p>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 font-['Outfit']">
                        <ShieldCheck size={32} className="text-purple-500" />
                        Identity & Access Control
                    </h1>
                    <p className="text-slate-400 text-sm mt-1 max-w-xl">
                        Centralized management of security principals, role-based access control (RBAC), and global authentication policies.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link to="/admin/users/audit" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-all border border-slate-700">
                        Audit Logs
                    </Link>
                    <Link to="/admin/users/users" className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-600/20">
                        Provision User
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard 
                    label="Total Principals" 
                    value={metrics.total_users} 
                    icon={Users} 
                    color="purple" 
                    subText="Enrolled Identities"
                />
                <MetricCard 
                    label="MFA Adoption" 
                    value={`${metrics.mfa_adoption} / ${metrics.total_users}`} 
                    icon={Key} 
                    color="emerald" 
                    subText="Enhanced Protection"
                />
                <MetricCard 
                    label="Locked Accounts" 
                    value={metrics.locked_users} 
                    icon={AlertTriangle} 
                    color="rose" 
                    subText="Security Interventions"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl">
                        <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                <Activity size={16} className="text-purple-400" /> Real-time Security Events
                            </h3>
                            <Link to="/admin/users/audit" className="text-[10px] font-black text-purple-400 uppercase hover:text-purple-300 tracking-tighter bg-purple-400/10 px-2 py-1 rounded">View All Vectors</Link>
                        </div>
                        <div className="divide-y divide-slate-800/50">
                            {recentLogs.length > 0 ? recentLogs.map(log => (
                                <div key={log.id} className="p-5 flex items-start justify-between hover:bg-slate-800/20 transition-all group">
                                    <div className="flex gap-4">
                                        <div className="mt-1 p-2 bg-slate-800 rounded-lg group-hover:bg-purple-500/10 group-hover:text-purple-400 transition-colors">
                                            <ShieldCheck size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors uppercase tracking-tight">{log.action || log.event_type}</p>
                                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                                <span className="font-mono text-purple-400/80">{log.user_email || 'SYSTEM'}</span> 
                                                <span className="text-slate-700">|</span> 
                                                <span>{log.ip_address}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-600">{new Date(log.timestamp || log.created_at).toLocaleTimeString()}</span>
                                </div>
                            )) : (
                                <div className="p-10 text-center space-y-2">
                                    <ShieldCheck className="mx-auto text-slate-800" size={40} />
                                    <p className="text-slate-500 text-sm">No security events recorded in this cycle.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-purple-900/20 relative overflow-hidden group">
                        <ShieldCheck size={120} className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                        <h4 className="text-xl font-bold mb-2">Security Posture</h4>
                        <p className="text-purple-100 text-sm leading-relaxed mb-6">Your identity infrastructure is currently protected by BitGuard MFA and Tenant Isolation.</p>
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            Nominal Status
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Quick Governance</h4>
                        <div className="space-y-3">
                            {[
                                { label: 'Review Root Access', path: '/admin/iam/roles', icon: ShieldCheck },
                                { label: 'MFA Configuration', path: '/admin/iam/mfa', icon: Key },
                                { label: 'API Key Management', path: '/admin/iam/api-keys', icon: Terminal },
                                { label: 'Active Sessions', path: '/admin/iam/sessions', icon: Activity },
                            ].map(item => (
                                <Link key={item.label} to={item.path} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800 text-sm text-slate-300 hover:text-white transition-all border border-transparent hover:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <item.icon size={16} className="text-slate-500" />
                                        {item.label}
                                    </div>
                                    <ShieldCheck size={14} className="text-slate-600" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ label, value, icon: Icon, color, subText }) => (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500 text-${color}-500`}>
            <Icon size={64} />
        </div>
        <div className="space-y-1">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-extrabold text-white tracking-tighter">{typeof value === 'number' ? value.toLocaleString() : (value ?? '—')}</p>
            <p className="text-[10px] text-slate-600 font-medium italic">{subText}</p>
        </div>
        <div className={`mt-4 w-full h-1 bg-slate-800 rounded-full overflow-hidden`}>
            <div className={`w-2/3 h-full bg-${color}-500`}></div>
        </div>
    </div>
);

export default UsersDashboard;
