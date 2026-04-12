import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Building2, UserCheck, Clock, Award, TrendingUp, AlertCircle } from 'lucide-react';
import hrmService from '../../../../core/api/hrmService';

const StatCard = ({ label, value, icon: Icon, color, onClick }) => (
    <div 
        onClick={onClick}
        className={`bg-slate-900 border border-slate-800 rounded-xl p-5 flex gap-4 items-center cursor-pointer hover:border-${color}-500/50 transition-all group`}
    >
        <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition-transform`}><Icon size={22} /></div>
        <div>
            <p className="text-slate-400 text-xs uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-white group-hover:text-white/80 transition-colors">{value ?? '—'}</p>
        </div>
    </div>
);

const HrmDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        hrmService.getStats().then(s => { setStats(s); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const cards = [
        { label: 'Total Employees', value: stats.headcount ?? stats.total_employees ?? 0, icon: Users, color: 'pink', path: '/admin/hrm/employees' },
        { label: 'Departments', value: stats.departments ?? 0, icon: Building2, color: 'blue', path: '/admin/hrm/employees' },
        { label: 'On Leave Today', value: stats.on_leave ?? 0, icon: UserCheck, color: 'amber', path: '/admin/hrm/leaves' },
        { label: 'Pending Leave Requests', value: stats.pending_leaves ?? 0, icon: AlertCircle, color: 'rose', path: '/admin/hrm/leaves' },
        { label: 'Time Entries (This Week)', value: stats.time_entries_week ?? 0, icon: Clock, color: 'indigo', path: '/admin/hrm/time' },
        { label: 'Active Certifications', value: stats.active_certifications ?? 0, icon: Award, color: 'emerald', path: '/admin/hrm/certifications' },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white font-['Oswald'] tracking-wider uppercase">Human Capital Management</h1>
                <p className="text-slate-400 text-sm mt-1">Workforce overview — employees, leave, and certifications</p>
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" /></div>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {cards.map(c => <StatCard key={c.label} {...c} onClick={() => navigate(c.path)} />)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: 'Employee Directory', path: '/admin/hrm/employees', desc: 'View and manage all staff profiles', icon: Users, color: 'pink' },
                            { title: 'Leave Management', path: '/admin/hrm/leaves', desc: 'Approve or reject leave requests', icon: UserCheck, color: 'amber' },
                            { title: 'Time Tracking', path: '/admin/hrm/time', desc: 'Review timesheets and work logs', icon: Clock, color: 'indigo' },
                            { title: 'Certifications', path: '/admin/hrm/certifications', desc: 'Track employee certifications and renewals', icon: Award, color: 'emerald' },
                        ].map(t => (
                            <Link key={t.title} to={t.path}
                                className="flex gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-pink-500/30 transition-colors no-underline group">
                                <div className={`p-3 rounded-xl bg-${t.color}-500/10 text-${t.color}-500 group-hover:bg-${t.color}-500/20 transition-colors flex-shrink-0`}><t.icon size={22} /></div>
                                <div>
                                    <p className="text-white font-semibold">{t.title}</p>
                                    <p className="text-slate-400 text-sm mt-0.5">{t.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default HrmDashboard;
