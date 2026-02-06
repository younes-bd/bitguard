import React from 'react';
import {
    Users,
    DollarSign,
    Ticket,
    ShieldAlert,
    Activity,
    FileText,
    ShoppingBag,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

const KpiCard = ({ title, value, label, trend, trendValue, icon: Icon, color }) => {
    return (
        <div className="relative overflow-hidden rounded-xl bg-slate-800 border border-slate-700 p-4 transition-all hover:border-slate-600">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <h3 className="mt-1 text-2xl font-bold text-white">{value}</h3>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color} bg-opacity-10 dark:bg-opacity-20`}>
                    <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs">
                    {trend === 'up' ? (
                        <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    ) : trend === 'down' ? (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                    ) : null}
                    <span className={trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-slate-500'}>
                        {trendValue}
                    </span>
                    <span className="text-slate-400">vs last month</span>
                </div>
                <span className="text-xs font-medium text-slate-400">{label}</span>
            </div>
        </div>
    );
};

const KpiStrip = () => {
    const kpis = [
        {
            title: 'Active Clients',
            value: '24',
            label: '2 Onboarding',
            trend: 'up',
            trendValue: '+12%',
            icon: Users,
            color: 'bg-blue-500 text-blue-600'
        },
        {
            title: 'Monthly Revenue',
            value: '$124.5k',
            label: '98% of goal',
            trend: 'up',
            trendValue: '+8.4%',
            icon: DollarSign,
            color: 'bg-emerald-500 text-emerald-600'
        },
        {
            title: 'Open Tickets',
            value: '18',
            label: '3 High Priority',
            trend: 'down',
            trendValue: '-5%',
            icon: Ticket,
            color: 'bg-amber-500 text-amber-600'
        },
        {
            title: 'Active Alerts',
            value: '4',
            label: '1 Critical',
            trend: 'up',
            trendValue: '+2',
            icon: ShieldAlert,
            color: 'bg-red-500 text-red-600'
        },
        {
            title: 'Systems Online',
            value: '99.9%',
            label: '4 Maintenance',
            trend: 'down',
            trendValue: '-0.1%',
            icon: Activity,
            color: 'bg-indigo-500 text-indigo-600'
        },
        {
            title: 'Store Orders',
            value: '84',
            label: '12 Today',
            trend: 'up',
            trendValue: '+18%',
            icon: ShoppingBag,
            color: 'bg-purple-500 text-purple-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {kpis.map((kpi, idx) => (
                <KpiCard key={idx} {...kpi} />
            ))}
        </div>
    );
};

export default KpiStrip;
