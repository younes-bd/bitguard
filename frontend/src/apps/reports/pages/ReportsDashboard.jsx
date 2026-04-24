import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, LifeBuoy, ShieldAlert, Download, BarChart3 } from 'lucide-react';
import client from '../../../core/api/client';

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
            className={`group bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 ${c.hoverBorder} transition-all no-underline`}>
            <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center ${c.text} ${c.bgHover} transition-colors`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-white font-bold text-lg">{title}</p>
                <p className="text-slate-400 text-sm mt-1">{desc}</p>
            </div>
            {value !== undefined && (
                <p className={`text-2xl font-bold ${c.textLight}`}>{value}</p>
            )}
        </Link>
    );
};

const ReportsDashboard = () => {
    const [summary, setSummary] = useState({});

    useEffect(() => {
        // Fetch minimal stats for each report tile
        Promise.all([
            client.get('reports/revenue/').catch(() => ({ data: { data: {} } })),
            client.get('reports/crm/').catch(() => ({ data: { data: {} } })),
            client.get('reports/support/').catch(() => ({ data: { data: {} } })),
            client.get('reports/security/').catch(() => ({ data: { data: {} } })),
        ]).then(([rev, crm, sup, sec]) => {
            setSummary({
                monthlyRevenue: rev.data?.data?.monthly?.slice(-1)[0]?.store_revenue,
                winRate: crm.data?.data?.funnel?.win_rate,
                openTickets: sup.data?.data?.open,
                openAlerts: sec.data?.data?.open_alerts,
            });
        });
    }, []);

    const tiles = [
        { title: 'Revenue Report', desc: 'Monthly revenue trends and top-performing products', path: '/admin/reports/revenue', icon: TrendingUp, color: 'emerald', value: summary.monthlyRevenue != null ? `$${Number(summary.monthlyRevenue).toLocaleString()}` : undefined },
        { title: 'CRM & Sales', desc: 'Lead-to-deal funnel, win rate, pipeline breakdown', path: '/admin/reports/crm', icon: Users, color: 'blue', value: summary.winRate != null ? `${summary.winRate}% win rate` : undefined },
        { title: 'Support Report', desc: 'Ticket volume, resolution times, priority breakdown', path: '/admin/reports/support', icon: LifeBuoy, color: 'amber', value: summary.openTickets != null ? `${summary.openTickets} open` : undefined },
        { title: 'Security Report', desc: 'Alert severity, incident frequency, threat overview', path: '/admin/reports/security', icon: ShieldAlert, color: 'rose', value: summary.openAlerts != null ? `${summary.openAlerts} active alerts` : undefined },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white font-['Oswald'] tracking-wider uppercase flex items-center gap-3">
                        <BarChart3 size={28} className="text-blue-400" /> Reports
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Cross-module business intelligence</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tiles.map(t => <ReportTile key={t.title} {...t} />)}
            </div>
        </div>
    );
};

export default ReportsDashboard;
