import React, { useState, useEffect } from 'react';
import { 
    BarChart3, TrendingUp, Users, LifeBuoy, 
    ShieldCheck, DollarSign, Activity, AlertCircle,
    ArrowUpRight, ArrowDownRight, Loader2
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

import boardService from '../../api/boardService';

const ExecutiveSummary = () => {
    const [summary, setSummary] = useState({
        revenue: null, crm: {}, support: {}, security: {}, 
        projects: [], employees: [], mrr: 0
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30days');

    useEffect(() => {
        fetchSummaryData();
    }, [dateRange]);

    const fetchSummaryData = async () => {
        try {
            setLoading(true);
            const params = {};
            
            // Calculate date ranges based on selection
            if (dateRange !== 'all') {
                const toDate = new Date();
                const fromDate = new Date();
                if (dateRange === '7days') fromDate.setDate(toDate.getDate() - 7);
                else if (dateRange === '30days') fromDate.setDate(toDate.getDate() - 30);
                else if (dateRange === '90days') fromDate.setDate(toDate.getDate() - 90);
                
                params.from_date = fromDate.toISOString().split('T')[0];
                params.to_date = toDate.toISOString().split('T')[0];
            }

            const dashRes = await boardService.getMetrics(params);
            const data = dashRes.data || {};
            setSummary({
                revenue: { monthly: data.billing?.monthly_revenue || data.ecommerce?.monthly_revenue || [] },
                crm: { funnel: { win_rate: data.crm?.funnel?.win_rate || 0 }, pipeline_value: data.crm?.pipeline_value || 0 },
                support: { open: data.support?.open_tickets },
                security: { open_alerts: data.security?.open_alerts || data.open_alerts },
                projects: data.projects?.active_projects || 0,
                employees: data.hr?.total_employees || 0,
                recentActivity: data.recent_activity || [],
                mrr: data.billing?.mrr || 0
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
    const totalRev = summary?.revenue?.monthly?.reduce((acc, m) => acc + (m.revenue || 0), 0) || 0;
    const currentMRR = summary?.mrr || summary?.revenue?.monthly?.slice(-1)[0]?.revenue || 0;
    const openTickets = summary?.support?.open || 0;
    const activeProjects = summary?.projects || 0;
    const employeeCount = summary?.employees || 0;

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
                <div className="flex items-center gap-4">
                    <select 
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-4 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500 transition-colors"
                    >
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="90days">Last 90 Days</option>
                        <option value="all">All Time</option>
                    </select>

                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">System Nominal</span>
                    </div>
                </div>
            </div>

            {/* Top KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard 
                    label="Current MRR" 
                    value={`$${currentMRR.toLocaleString()}`} 
                    trend={summary?.revenue?.trend_percent ? `${summary.revenue.trend_percent}%` : null} 
                    trendUp={summary?.revenue?.trend_percent >= 0} 
                    icon={DollarSign} 
                    color="emerald" 
                />
                <KPICard 
                    label="Open Tickets" 
                    value={openTickets.toString()} 
                    trend={summary?.support?.trend_percent ? `${summary.support.trend_percent}%` : null} 
                    trendUp={summary?.support?.trend_percent <= 0} 
                    icon={LifeBuoy} 
                    color="amber" 
                />
                <KPICard 
                    label="Active Projects" 
                    value={activeProjects.toString()} 
                    icon={Activity} 
                    color="blue" 
                />
                <KPICard 
                    label="Total Employees" 
                    value={employeeCount.toString()} 
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
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded">Target: 105%</span>
                    </div>
                    <div className="h-64 flex items-end gap-3 px-2">
                        {summary?.revenue?.monthly ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={summary.revenue.monthly.slice(-12)}>
                                    <XAxis dataKey="month" tickFormatter={(tick) => tick.split(' ')[0]} stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
                                        itemStyle={{ color: '#10b981' }}
                                    />
                                    <Bar dataKey="revenue" name="Total Revenue" stackId="a" fill="#059669" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-slate-500 w-full h-full flex items-center justify-center">No revenue data available</div>
                        )}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group">
                    <BarChart3 className="absolute -right-8 -bottom-8 text-slate-800 opacity-20 group-hover:scale-110 transition-transform duration-700" size={160} />
                    <h4 className="text-white font-bold mb-2">Operations Intelligence</h4>
                    <p className="text-slate-400 text-xs leading-relaxed mb-6">Real-time metrics are synced from all active ERP modules.</p>
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
                {trend && (
                    <div className={`flex items-center gap-1 text-[10px] font-bold ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {trend}
                    </div>
                )}
            </div>
        </div>
    );
};



export default ExecutiveSummary;


