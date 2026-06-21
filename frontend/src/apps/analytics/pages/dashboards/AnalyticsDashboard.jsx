import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, LifeBuoy, ShieldAlert, BarChart3, Activity, ArrowUpRight, DollarSign } from 'lucide-react';
import { analyticsService } from '../../../../core/api/analyticsService';
import ExecutiveSummary from './ExecutiveSummary';

const COLOR_MAP = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', hoverBorder: 'hover:border-emerald-500/40', textLight: 'text-emerald-400', bgHover: 'group-hover:bg-emerald-500/20' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', hoverBorder: 'hover:border-blue-500/40', textLight: 'text-blue-400', bgHover: 'group-hover:bg-blue-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', hoverBorder: 'hover:border-amber-500/40', textLight: 'text-amber-400', bgHover: 'group-hover:bg-amber-500/20' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-500', hoverBorder: 'hover:border-rose-500/40', textLight: 'text-rose-400', bgHover: 'group-hover:bg-rose-500/20' },
};

const ReportTile = ({ title, desc, path, icon: Icon, color, value }) => {
    const c = COLOR_MAP[color] || COLOR_MAP.blue;
    return (
        <Link to={path}
            className={`group bg-slate-950/50 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4 ${c.hoverBorder} transition-all no-underline backdrop-blur-md`}>
            <div className={`w-12 h-12 rounded-2xl ${c.bg} flex items-center justify-center ${c.text} ${c.bgHover} transition-colors`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-white font-bold text-lg">{title}</p>
                <p className="text-slate-400 text-sm mt-1">{desc}</p>
            </div>
            {value !== undefined && (
                <div className="mt-auto pt-4 border-t border-slate-800/50 flex justify-between items-center">
                    <p className={`text-xl font-extrabold ${c.textLight}`}>{value}</p>
                    <ArrowUpRight className="text-slate-700 group-hover:text-white transition-colors" size={16} />
                </div>
            )}
        </Link>
    );
};

const AnalyticsDashboard = () => {
    const [summary, setSummary] = useState({});

    useEffect(() => {
        // Fetch minimal stats for each report tile
        Promise.all([
            analyticsService.getRevenueReport().catch(() => ({})),
            analyticsService.getCrmReport().catch(() => ({})),
            analyticsService.getSupportReport().catch(() => ({})),
            analyticsService.getSecurityReport().catch(() => ({})),
        ]).then(([revData, crmData, supData, secData]) => {
            setSummary({
                monthlyRevenue: revData?.monthly?.slice(-1)[0]?.store_revenue,
                winRate: crmData?.funnel?.win_rate,
                openTickets: supData?.open,
                openAlerts: secData?.open_alerts,
            });
        });
    }, []);

    const tiles = [
        { title: 'Revenue Analytics', desc: 'Financial health, MRR growth, and collection velocity', path: '/admin/analytics/revenue', icon: TrendingUp, color: 'emerald', value: summary.monthlyRevenue != null ? `$${Number(summary.monthlyRevenue).toLocaleString()}` : undefined },
        { title: 'Finance & P&L', desc: 'Profit, loss, expenses, and A/R aging', path: '/admin/analytics/finance', icon: DollarSign, color: 'emerald' },
        { title: 'Sales Performance', desc: 'Lead-to-deal funnel, win rate, and pipeline health', path: '/admin/analytics/crm', icon: Users, color: 'blue', value: summary.winRate != null ? `${summary.winRate}% win rate` : undefined },
        { title: 'Service Desk Ops', desc: 'Ticket volume, SLA compliance, and support efficiency', path: '/admin/analytics/support', icon: LifeBuoy, color: 'amber', value: summary.openTickets != null ? `${summary.openTickets} open` : undefined },
        { title: 'Security Posture', desc: 'Threat vectors, incident response, and risk mitigation', path: '/admin/analytics/security', icon: ShieldAlert, color: 'rose', value: summary.openAlerts != null ? `${summary.openAlerts} active alerts` : undefined },
        { title: 'People & HR', desc: 'Headcount, certifications, and time utilization', path: '/admin/analytics/hrm', icon: Users, color: 'blue' },
        { title: 'Project Management', desc: 'Active projects, budgets vs actuals', path: '/admin/analytics/projects', icon: Activity, color: 'amber' },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Lead with Executive Intelligence */}
            <ExecutiveSummary />

            {/* Detailed Reporting Sectors */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <Activity size={24} className="text-blue-500" />
                        Detailed Analytic Sectors
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">Deep-dive into specialized business units</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {tiles.map(t => <ReportTile key={t.title} {...t} />)}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;

