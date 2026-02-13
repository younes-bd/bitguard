import React, { useEffect, useState } from 'react';
import { Users, UserPlus, DollarSign, Calendar } from 'lucide-react';
import hrmService from '../services/hrmService';

const HrmDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await hrmService.getHrmStats();
                const data = response.data;
                setStats([
                    { label: 'Total Employees', value: data.total_employees, icon: Users, color: 'pink' },
                    { label: 'New Hires (Q3)', value: data.new_hires, icon: UserPlus, color: 'blue' },
                    { label: 'Payroll Run', value: data.payroll_status, icon: DollarSign, color: 'yellow' },
                    { label: 'On Leave', value: data.on_leave, icon: Calendar, color: 'purple' },
                ]);
            } catch (error) {
                console.error("Failed to load HRM stats", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="p-8 text-slate-400">Loading Human Capital Metrics...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight font-['Oswald']">Human Capital</h1>
                <p className="text-slate-400 mt-2">Workforce management, payroll, and recruitment.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:bg-${stat.color}-500/20 transition-colors`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-64 flex items-center justify-center text-slate-500 border-dashed">
                    Workforce Demographics Placeholder
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-64 flex items-center justify-center text-slate-500 border-dashed">
                    Recruitment Pipeline Placeholder
                </div>
            </div>
        </div>
    );
};

export default HrmDashboard;
