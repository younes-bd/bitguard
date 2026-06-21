import React, { useState, useEffect } from 'react';
import { Users, CreditCard, Calendar, Briefcase, Loader2, ArrowRight, DollarSign, PieChart, TrendingUp } from 'lucide-react';
import { hrmService } from '../../../../core/api/hrmService';
import { Link } from 'react-router-dom';

export default function HrmDashboard() {
    const [stats, setStats] = useState({ employees: 0, pending_leaves: 0, payroll_total: 0, active_departments: 0 });
    const [currentPeriod, setCurrentPeriod] = useState(null);
    const [activeOpeningsCount, setActiveOpeningsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            hrmService.getDashboardStats(),
            hrmService.getPayrollPeriods(),
            hrmService.getJobPositions()
        ]).then(([data, periodsData, jobsData]) => {
            setStats({
                employees: data?.headcount || 0,
                pending_leaves: data?.pending_leaves || 0,
                payroll_total: data?.total_salary || 0,
                active_departments: data?.departments || 0
            });

            const periodsList = Array.isArray(periodsData) ? periodsData : periodsData?.results || [];
            const openPeriod = periodsList.find(p => !p.is_closed);
            setCurrentPeriod(openPeriod || null);

            const jobsList = Array.isArray(jobsData) ? jobsData : jobsData?.results || [];
            const activeJobs = jobsList.filter(j => j.is_active);
            setActiveOpeningsCount(activeJobs.length);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const cards = [
        { label: 'Total Employees', value: stats.employees, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Pending Leaves', value: stats.pending_leaves, icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Payroll Monthly', value: `$${stats.payroll_total.toLocaleString()}`, icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Departments', value: stats.active_departments, icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    ];

    if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-400" size={32}/></div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <Users className="text-blue-500" /> HRM Dashboard
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-xl ${card.bg}`}>
                                <card.icon className={card.color} size={24} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-slate-400 text-sm font-medium">{card.label}</p>
                            <h2 className="text-2xl font-bold text-white mt-1">{card.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <CreditCard className="text-emerald-400" size={20} /> Payroll Management
                        </h3>
                        <Link to="/hrm/payroll" className="text-emerald-400 text-sm hover:underline flex items-center gap-1 font-bold">
                            Open Payroll <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {currentPeriod ? (
                            <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <div>
                                    <p className="text-white font-bold">Current Period</p>
                                    <p className="text-xs text-slate-400">{currentPeriod.name}</p>
                                </div>
                                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-full">Open</span>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <div>
                                    <p className="text-white font-bold">Current Period</p>
                                    <p className="text-xs text-slate-400">No open period</p>
                                </div>
                                <span className="px-3 py-1 bg-slate-500/10 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">Closed</span>
                            </div>
                        )}
                        <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20">
                            Generate Payroll
                        </button>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <TrendingUp className="text-blue-400" size={20} /> Recruitment
                        </h3>
                        <Link to="/hrm/recruitment" className="text-blue-400 text-sm hover:underline flex items-center gap-1 font-bold">
                            View Board <ArrowRight size={16} />
                        </Link>
                    </div>
                    {activeOpeningsCount > 0 ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <Briefcase size={48} className="text-blue-400 mb-4" />
                            <p className="text-white font-bold text-xl">{activeOpeningsCount} Active Openings</p>
                            <p className="text-slate-400 text-sm mt-1">Review your recruitment pipeline</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 opacity-50">
                            <PieChart size={48} className="text-slate-700 mb-4" />
                            <p className="text-slate-500 font-medium">No active openings</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

