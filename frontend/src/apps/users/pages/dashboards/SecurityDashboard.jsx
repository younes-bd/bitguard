import React, { useState, useEffect } from 'react';
import { 
    Shield, Lock, Unlock, Users, Globe, Smartphone, Monitor, 
    AlertTriangle, ShieldCheck, Activity, Key, LogOut, Loader2
} from 'lucide-react';
import { iamService } from '../../../../core/api/iamService';
import { toast } from 'react-hot-toast';

const SecurityDashboard = () => {
    const [stats, setStats] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSecurityData();
    }, []);

    const fetchSecurityData = async () => {
        try {
            const [statsData, sessionsData] = await Promise.all([
                iamService.getDashboardStats(),
                iamService.getSessions()
            ]);
            setStats(statsData);
            setSessions(sessionsData);
        } catch (error) {
            console.error("Failed to fetch security data", error);
            toast.error("Security metrics unavailable");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-500" /></div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Shield className="text-blue-500" size={32} />
                        Security Operations
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Real-time IAM monitoring and policy enforcement</p>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Users size={20} /></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">IAM Registry</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{stats?.total_users || 0}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{stats?.active_users} Active Accounts</div>
                </div>
                
                <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><ShieldCheck size={20} /></div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">MFA Adoption</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {Math.round((stats?.mfa_adoption / stats?.total_users) * 100) || 0}%
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">{stats?.mfa_adoption} Protected Users</div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-red-500/10 text-red-500"><Lock size={20} /></div>
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Locked</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{stats?.locked_users || 0}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Potential Security Violations</div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><Key size={20} /></div>
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Privileged</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{stats?.admin_count || 0}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Administrator Roles</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Sessions */}
                <div className="lg:col-span-2 glass-panel rounded-2xl border border-slate-700/50 overflow-hidden">
                    <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                        <h3 className="font-bold text-white flex items-center gap-2 uppercase tracking-wider text-sm">
                            <Activity size={18} className="text-emerald-500" />
                            Live Active Sessions
                        </h3>
                        <span className="text-[10px] font-mono text-slate-500">REAL-TIME TELEMETRY</span>
                    </div>
                    <div className="divide-y divide-slate-800">
                        {sessions.map((session, idx) => (
                            <div key={idx} className="p-6 hover:bg-slate-800/30 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all">
                                        {session.type === 'desktop' ? <Monitor size={24} /> : <Smartphone size={24} />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white flex items-center gap-2">
                                            {session.device}
                                            {session.is_current && (
                                                <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[8px] border border-blue-500/20 uppercase tracking-widest font-bold">Current</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                                            <span className="flex items-center gap-1"><Globe size={12} /> {session.ip}</span>
                                            <span className="flex items-center gap-1"><Activity size={12} /> {session.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-white">{session.last_active}</div>
                                    <button className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-2 hover:text-red-400 transition-colors flex items-center gap-1">
                                        <LogOut size={12} /> Revoke
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security Policy Summary */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
                    <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Active Enforcement</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Password Complexity', value: 'High', status: 'compliant' },
                            { label: 'MFA Enforcement', value: 'Enabled', status: 'compliant' },
                            { label: 'Session Timeout', value: '60 Min', status: 'warning' },
                            { label: 'API Key Rotation', value: '90 Days', status: 'compliant' },
                        ].map(item => (
                            <div key={item.label} className="flex items-center justify-between">
                                <span className="text-xs text-slate-400">{item.label}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-white">{item.value}</span>
                                    <div className={`w-2 h-2 rounded-full ${item.status === 'compliant' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                        <div className="flex gap-3 mb-3">
                            <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                            <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-bold tracking-wider">Security Advisory</p>
                        </div>
                        <p className="text-xs text-slate-300">
                            3 accounts have been locked due to failed login attempts in the last 24 hours.
                        </p>
                        <button className="w-full mt-4 py-2 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-slate-800 transition-all">
                            View Security Logs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityDashboard;

