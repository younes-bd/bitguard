import React, { useEffect, useState } from 'react';
import {
    Users, Shield, Key, TrendingUp, AlertCircle, Clock, CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IdentityDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 154,
        activeRoles: 12,
        securityEvents: 3
    });

    // Mock data for now - will be replaced by API calls
    const [recentActivity, setRecentActivity] = useState([
        { id: 1, user: 'Sarah Connor', action: 'Password Reset', time: '2 mins ago', status: 'success' },
        { id: 2, user: 'John Doe', action: 'Role Assigned: Editor', time: '15 mins ago', status: 'success' },
        { id: 3, user: 'Mike Smith', action: 'Failed Login Attempt', time: '1 hour ago', status: 'warning' },
        { id: 4, user: 'Jane Doe', action: 'New User Created', time: '2 hours ago', status: 'success' },
        { id: 5, user: 'Admin User', action: 'Policy Updated', time: '5 hours ago', status: 'success' },
    ]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Simulate loading
        setLoading(true);
        setTimeout(() => setLoading(false), 800);
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-2">Identity & Access Overview</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-gradient-to-br from-indigo-900/20 to-slate-900/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <TrendingUp size={12} /> +5%
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.totalUsers}</div>
                    <div className="text-sm text-slate-400 font-medium uppercase">Total Users</div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-gradient-to-br from-emerald-900/20 to-slate-900/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400">
                            <Shield size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-500">Active</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.activeRoles}</div>
                    <div className="text-sm text-slate-400 font-medium uppercase">Defined Roles</div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-gradient-to-br from-pink-900/20 to-slate-900/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-pink-500/20 rounded-lg text-pink-400">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.securityEvents}</div>
                    <div className="text-sm text-slate-400 font-medium uppercase">Security Alerts</div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-panel p-6 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock className="text-indigo-400" size={20} />
                        Recent Access Activity
                    </h2>
                    <button
                        onClick={() => navigate('/app/identity/audit-logs')}
                        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        View All
                    </button>
                </div>

                <div className="space-y-4">
                    {recentActivity.map(item => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-slate-800/40 border border-slate-700/30 hover:border-indigo-500/30 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.status === 'warning' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                    {item.status === 'warning' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{item.action}</h3>
                                    <div className="text-xs text-slate-500">User: <span className="text-slate-300">{item.user}</span></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-slate-500 text-xs flex items-center gap-1">
                                    <Clock size={12} />
                                    <span>{item.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IdentityDashboard;
