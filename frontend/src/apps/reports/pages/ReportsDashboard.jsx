import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, LifeBuoy, ShieldAlert, Download, BarChart3 } from 'lucide-react';
import client from '../../../core/api/client';

const ReportTile = ({ title, desc, path, icon: Icon, color, value }) => (
    <Link to={path}
        className={`group bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-${color}-500/40 transition-all no-underline`}>
        <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center text-${color}-500 group-hover:bg-${color}-500/20 transition-colors`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-white font-bold text-lg">{title}</p>
            <p className="text-slate-400 text-sm mt-1">{desc}</p>
        </div>
        {value !== undefined && (
            <p className={`text-2xl font-bold text-${color}-400`}>{value}</p>
        )}
    </Link>
);

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
