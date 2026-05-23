import React, { useState, useEffect } from 'react';
import { 
    BarChart3, TrendingUp, Users, LifeBuoy, 
    ShieldCheck, DollarSign, Activity, AlertCircle,
    ArrowUpRight, ArrowDownRight, Loader2
} from 'lucide-react';
import { reportsService } from '../../../core/api/reportsService';

const ExecutiveSummary = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSummaryData();
    }, []);

    const fetchSummaryData = async () => {
        try {
            const [rev, crm, sup, sec, proj, hrm] = await Promise.all([
                reportsService.getRevenueReport().catch(() => ({})),
                reportsService.getCrmReport().catch(() => ({})),
                reportsService.getSupportReport().catch(() => ({})),
                reportsService.getSecurityReport().catch(() => ({})),
                client.get('projects/').catch(() => ({ data: [] })),
                client.get('hrm/employees/').catch(() => ({ data: [] }))
            ]);

            setSummary({
                revenue: rev,
                crm: crm,
                support: sup,
                security: sec,
                projects: proj.data?.results || proj.data || [],
                employees: hrm.data?.results || hrm.data || []
            });
        } catch (error) {
            console.error("Failed to fetch executive summary", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Aggregating Global Intelligence...</p>
            </div>
        );
    }

    // Process derived metrics
    const totalRev = summary?.revenue?.monthly?.reduce((acc, m) => acc + (m.store_revenue || 0) + (m.invoice_collected || 0), 0) || 0;
    const currentMRR = (summary?.revenue?.monthly?.slice(-1)[0]?.store_revenue || 0) + (summary?.revenue?.monthly?.slice(-1)[0]?.invoice_collected || 0);
    const openTickets = summary?.support?.open || 0;
    const activeProjects = summary?.projects?.filter(p => p.status === 'in_progress').length || 0;
    const employeeCount = summary?.employees?.length || 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <BarChart3 className="text-blue-500" size={32} />
                        Executive Intelligence
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Real-time cross-module performance orchestration</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">System Nominal</span>
                </div>
            </div>

            {/* Top KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard 
                    label="Current MRR" 
                    value={`$${currentMRR.toLocaleString()}`} 
                    trend="+12.4%" 
                    trendUp={true} 
                    icon={DollarSign} 
                    color="emerald" 
                />
                <KPICard 
                    label="Open Tickets" 
                    value={openTickets.toString()} 
                    trend="-5.2%" 
                    trendUp={true} 
                    icon={LifeBuoy} 
                    color="amber" 
                />
                <KPICard 
                    label="Active Projects" 
                    value={activeProjects.toString()} 
                    trend="+2" 
                    trendUp={true} 
                    icon={Activity} 
                    color="blue" 
                />
                <KPICard 
                    label="Total Employees" 
                    value={employeeCount.toString()} 
                    trend="+1" 
                    trendUp={true} 
                    icon={Users} 
                    color="rose" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Momentum */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp className="text-emerald-500" size={16} /> Revenue Momentum
                        </h3>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded">FY26 Target: 105%</span>
                        </div>
                    </div>
                    <div className="h-64 flex items-end gap-3 px-2">
                        {summary?.revenue?.monthly?.slice(-12).map((m, i) => {
                            const total = (m.store_revenue || 0) + (m.invoice_collected || 0);
                            const max = Math.max(...summary.revenue.monthly.map(x => (x.store_revenue || 0) + (x.invoice_collected || 0)));
                            const height = (total / max) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                                    <div className="absolute -top-8 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl border border-slate-700">
                                        ${(total/1000).toFixed(1)}k
                                    </div>
                                    <div 
                                        className="w-full bg-gradient-to-t from-emerald-600/20 to-emerald-500/40 rounded-t-lg group-hover:to-emerald-400 transition-all cursor-pointer"
                                        style={{ height: `${height}%` }}
                                    ></div>
                                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter truncate w-full text-center">
                                        {m.month.split(' ')[0]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Operations Pulse */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-3xl border border-slate-800">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-6">
                            <Activity className="text-blue-500" size={16} /> Operations Pulse
                        </h3>
                        <div className="space-y-5">
                            <PulseRow label="Customer Satisfaction" value="98%" color="bg-emerald-500" width="w-[98%]" />
                            <PulseRow label="SLA Response Time" value="14m" color="bg-blue-500" width="w-[85%]" />
                            <PulseRow label="Lead Conversion" value="24%" color="bg-purple-500" width="w-[24%]" />
                            <PulseRow label="Resource Utilization" value="78%" color="bg-amber-500" width="w-[78%]" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group">
                        <BarChart3 className="absolute -right-8 -bottom-8 text-slate-800 opacity-20 group-hover:scale-110 transition-transform duration-700" size={160} />
                        <h4 className="text-white font-bold mb-2">Quarterly Forecast</h4>
                        <p className="text-slate-400 text-xs leading-relaxed mb-6">Based on current pipeline velocity, we project a 15% growth in recurring services by end of Q3.</p>
                        <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 hover:text-blue-300 transition-colors">
                            View Deep Analytics <ArrowUpRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ label, value, trend, trendUp, icon: Icon, color }) => {
    const colors = {
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    };

    return (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative group overflow-hidden hover:border-slate-700 transition-all">
            <div className={`absolute -right-4 -top-4 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500 ${colors[color].split(' ')[0]}`}>
                <Icon size={64} />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
            <div className="flex items-end justify-between">
                <h3 className="text-2xl font-extrabold text-white tracking-tighter">{value}</h3>
                <div className={`flex items-center gap-1 text-[10px] font-bold ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {trend}
                </div>
            </div>
        </div>
    );
};

const PulseRow = ({ label, value, color, width }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
            <span className="text-slate-500">{label}</span>
            <span className="text-white">{value}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${color} ${width} rounded-full`}></div>
        </div>
    </div>
);

export default ExecutiveSummary;
