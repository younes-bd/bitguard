import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Users, ShieldCheck, ShieldAlert, PieChart, Activity,
    AlertTriangle, Truck, FileText, Megaphone, LifeBuoy,
    TrendingUp, Package, Clock, CheckCircle2, ArrowUpRight,
    RefreshCw, Server, Building2, Zap, DollarSign,
    FolderKanban, Monitor, FolderOpen, CheckSquare, GitBranch, Bell,
    PlusCircle
} from 'lucide-react';
import { dashboardService } from '../api/dashboardService';

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const KpiCard = ({ label, value, sub, icon: Icon, color, to }) => (
    <Link
        to={to || '#'}
        className={`group bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex gap-4 items-start
            hover:border-${color}-500/40 hover:bg-slate-900 transition-all duration-200 no-underline`}
    >
        <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500 flex-shrink-0 mt-0.5
            group-hover:bg-${color}-500/20 transition-colors`}>
            <Icon size={22} />
        </div>
        <div className="min-w-0">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide truncate">{label}</p>
            <p className="text-2xl font-bold text-white mt-0.5 leading-none">{value ?? '—'}</p>
            {sub && <p className="text-slate-500 text-xs mt-1.5 truncate">{sub}</p>}
        </div>
        <ArrowUpRight size={14} className="text-slate-600 group-hover:text-slate-400 ml-auto mt-1 flex-shrink-0 transition-colors" />
    </Link>
);

const ModuleTile = ({ title, path, icon: Icon, color, kpi, kpiLabel, status }) => (
    <Link
        to={path}
        className={`group bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-col gap-3
            hover:border-${color}-500/40 hover:bg-slate-900/80 transition-all duration-200 no-underline`}
    >
        <div className="flex justify-between items-start">
            <div className={`p-2.5 rounded-lg bg-${color}-500/10 text-${color}-500 group-hover:bg-${color}-500/20 transition-colors`}>
                <Icon size={18} />
            </div>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full
                ${status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                    status === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-slate-800 text-slate-500'}`}>
                {status === 'active' ? 'Active' : status === 'warning' ? 'Alert' : 'Idle'}
            </span>
        </div>
        <div>
            <p className="text-white text-sm font-semibold truncate">{title}</p>
            {kpi !== undefined && (
                <p className={`text-xl font-bold mt-0.5 text-${color}-400`}>{kpi}
                    <span className="text-xs text-slate-500 font-normal ml-1">{kpiLabel}</span>
                </p>
            )}
        </div>
    </Link>
);

const ActivityItem = ({ notification }) => {
    const timeAgo = (dateStr) => {
        const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };
    return (
        <div className="flex gap-3 items-start py-3 border-b border-slate-800/60 last:border-0 last:pb-0">
            <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 size={13} className="text-emerald-500" />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-slate-200 leading-snug font-medium truncate">{notification.message}</p>
                <span className="text-[10px] text-slate-500">{timeAgo(notification.created_at)}</span>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

const CommandCenter = () => {
    const [metrics, setMetrics] = useState({});
    const [health, setHealth] = useState({});
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [m, h, a] = await Promise.all([
                dashboardService.getMetrics().catch(() => ({})),
                dashboardService.getSystemHealth().catch(() => ({})),
                dashboardService.getRecentActivity(8).catch(() => []),
            ]);
            setMetrics(m);
            setHealth(h);
            setActivity(Array.isArray(a) ? a : []);
            setLastRefresh(new Date());
        } catch (e) {
            console.error('Command Center fetch error:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
        const timer = setInterval(fetchAll, 60000); // auto-refresh every 60s
        return () => clearInterval(timer);
    }, [fetchAll]);

    // ── KPI Cards (top 6 most important business metrics) ──────────────────
    const kpiCards = [
        {
            label: 'Monthly Revenue',
            value: metrics.store?.monthly_revenue != null
                ? `$${Number(metrics.store.monthly_revenue).toLocaleString()}`
                : '—',
            sub: `$${Number(metrics.store?.lifetime_revenue ?? 0).toLocaleString()} lifetime`,
            icon: DollarSign, color: 'emerald', to: '/admin/erp',
        },
        {
            label: 'Active Clients',
            value: metrics.crm?.active_clients ?? '—',
            sub: `${metrics.crm?.open_deals ?? 0} open deals`,
            icon: Users, color: 'blue', to: '/admin/crm',
        },
        {
            label: 'Security Alerts',
            value: metrics.security?.open_alerts ?? '—',
            sub: `${metrics.security?.open_incidents ?? 0} open incidents`,
            icon: ShieldAlert,
            color: (metrics.security?.open_alerts > 0) ? 'rose' : 'emerald',
            to: '/admin/security',
        },
        {
            label: 'Open Support Tickets',
            value: metrics.support?.open_tickets ?? '—',
            sub: `${metrics.support?.critical_tickets ?? 0} critical`,
            icon: LifeBuoy,
            color: (metrics.support?.critical_tickets > 0) ? 'amber' : 'blue',
            to: '/admin/support',
        },
        {
            label: 'Pending Orders',
            value: metrics.store?.pending_orders ?? '—',
            sub: `${metrics.scm?.low_stock_items ?? 0} low-stock items`,
            icon: Package, color: 'indigo', to: '/admin/store',
        },
        {
            label: 'Active SLA Contracts',
            value: metrics.contracts?.active_contracts ?? '—',
            sub: `${metrics.contracts?.sla_breaches ?? 0} SLA breaches`,
            icon: FileText,
            color: (metrics.contracts?.sla_breaches > 0) ? 'rose' : 'violet',
            to: '/admin/contracts',
        },
    ];

    // ── Module Tiles (all 9 operational modules) ───────────────────────────
    const moduleTiles = [
        {
            title: 'Sales & CRM',
            path: '/admin/crm',
            icon: Users, color: 'blue',
            kpi: metrics.crm?.active_clients,
            kpiLabel: 'clients',
            status: (metrics.crm?.active_clients > 0) ? 'active' : 'idle',
        },
        {
            title: 'Service Catalog',
            path: '/admin/store',
            icon: Package, color: 'indigo',
            kpi: metrics.store?.pending_orders,
            kpiLabel: 'pending orders',
            status: (metrics.store?.pending_orders > 0) ? 'active' : 'idle',
        },
        {
            title: 'Finance & Billing',
            path: '/admin/erp',
            icon: DollarSign, color: 'emerald',
            kpi: metrics.erp?.overdue_invoices,
            kpiLabel: 'overdue invoices',
            status: (metrics.erp?.overdue_invoices > 0) ? 'warning' : 'active',
        },
        {
            title: 'SOC (Security)',
            path: '/admin/security',
            icon: ShieldCheck, color: 'rose',
            kpi: metrics.security?.open_alerts,
            kpiLabel: 'open alerts',
            status: (metrics.security?.open_alerts > 0) ? 'warning' : 'active',
        },
        {
            title: 'Service Desk',
            path: '/admin/support',
            icon: LifeBuoy, color: 'amber',
            kpi: metrics.support?.open_tickets,
            kpiLabel: 'open tickets',
            status: (metrics.support?.open_tickets > 0) ? 'active' : 'idle',
        },
        {
            title: 'Marketing',
            path: '/admin/marketing',
            icon: Megaphone, color: 'purple',
            kpi: metrics.marketing?.active_campaigns,
            kpiLabel: 'campaigns',
            status: (metrics.marketing?.active_campaigns > 0) ? 'active' : 'idle',
        },
        {
            title: 'People & HR',
            path: '/admin/hrm',
            icon: Building2, color: 'pink',
            kpi: metrics.hrm?.headcount,
            kpiLabel: 'employees',
            status: (metrics.hrm?.headcount > 0) ? 'active' : 'idle',
        },
        {
            title: 'Procurement',
            path: '/admin/scm',
            icon: Truck, color: 'orange',
            kpi: metrics.scm?.pending_pos,
            kpiLabel: 'pending POs',
            status: (metrics.scm?.low_stock > 0) ? 'warning' : 'active',
        },
        {
            title: 'Identity & Access',
            path: '/admin/iam',
            icon: ShieldCheck, color: 'violet',
            kpi: undefined,
            kpiLabel: '',
            status: 'active',
        },
        {
            title: 'Contracts & SLAs',
            path: '/admin/contracts',
            icon: FileText, color: 'amber',
            kpi: metrics.contracts?.active_contracts,
            kpiLabel: 'active',
            status: (metrics.contracts?.active_contracts > 0) ? 'active' : 'idle',
        },
        {
            title: 'Project Management',
            path: '/admin/projects',
            icon: FolderKanban, color: 'cyan',
            kpi: metrics.projects?.active_projects,
            kpiLabel: 'active',
            status: (metrics.projects?.active_projects > 0) ? 'active' : 'idle',
        },
        {
            title: 'IT Asset Management',
            path: '/admin/itam',
            icon: Monitor, color: 'teal',
            kpi: metrics.itam?.total_assets,
            kpiLabel: 'assets',
            status: (metrics.itam?.total_assets > 0) ? 'active' : 'idle',
        },
        {
            title: 'Document Vault',
            path: '/admin/documents',
            icon: FolderOpen, color: 'cyan',
            kpi: metrics.documents?.total,
            kpiLabel: 'documents',
            status: (metrics.documents?.total > 0) ? 'active' : 'idle',
        },
        {
            title: 'Approval Center',
            path: '/admin/approvals',
            icon: CheckSquare, color: 'amber',
            kpi: metrics.approvals?.pending,
            kpiLabel: 'pending',
            status: (metrics.approvals?.pending > 0) ? 'warning' : 'active',
        },
        {
            title: 'Change Management',
            path: '/admin/itsm',
            icon: GitBranch, color: 'indigo',
            kpi: metrics.itsm?.open_changes,
            kpiLabel: 'changes',
            status: (metrics.itsm?.open_changes > 0) ? 'active' : 'idle',
        },
    ];

    const dbHealthy = health?.database?.status === 'Healthy';

    const renderNeedsAttention = () => {
        const issues = [];
        if (metrics.security?.open_alerts > 0) issues.push({ text: `${metrics.security.open_alerts} Unresolved Security Alerts`, to: '/admin/security/alerts' });
        if (metrics.contracts?.sla_breaches > 0) issues.push({ text: `${metrics.contracts.sla_breaches} SLA Breaches`, to: '/admin/contracts/sla-breaches' });
        if (metrics.erp?.overdue_invoices > 0) issues.push({ text: `${metrics.erp.overdue_invoices} Overdue Invoices`, to: '/admin/erp/invoices' });
        if (metrics.approvals?.pending > 0) issues.push({ text: `${metrics.approvals.pending} Pending Approvals`, to: '/admin/approvals' });
        if (metrics.scm?.low_stock > 0) issues.push({ text: `${metrics.scm.low_stock} Low Stock Items`, to: '/admin/scm/inventory' });
        if (metrics.itsm?.high_risk > 0) issues.push({ text: `${metrics.itsm.high_risk} High-Risk Changes`, to: '/admin/itsm' });
        
        if (issues.length === 0) return null;
        return (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 mb-8">
                <div className="flex items-center gap-2 text-rose-400 font-bold mb-3">
                    <AlertTriangle size={18} />
                    <h3>Needs Attention</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                    {issues.map((iss, i) => (
                        <Link key={i} to={iss.to} className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-sm font-semibold px-4 py-2 rounded-lg transition-colors border border-rose-500/20">
                            {iss.text}
                        </Link>
                    ))}
                </div>
            </div>
        );
    };

    const QuickActions = () => (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap size={14} className="text-yellow-500" />
                    Quick Actions
                </h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
                <Link to="/admin/crm/onboarding" className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 hover:bg-sky-500/20 hover:text-sky-400 border border-slate-700/50 hover:border-sky-500/30 transition-all text-sm font-medium text-slate-300">
                    <PlusCircle size={16} /> Onboard Client
                </Link>
                <Link to="/admin/support/tickets/create" className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 hover:bg-amber-500/20 hover:text-amber-400 border border-slate-700/50 hover:border-amber-500/30 transition-all text-sm font-medium text-slate-300">
                    <LifeBuoy size={16} /> New Ticket
                </Link>
                <Link to="/admin/contracts/quotes" className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-700/50 hover:border-emerald-500/30 transition-all text-sm font-medium text-slate-300">
                    <FileText size={16} /> Create Quote
                </Link>
                <Link to="/admin/iam/users" className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 hover:bg-purple-500/20 hover:text-purple-400 border border-slate-700/50 hover:border-purple-500/30 transition-all text-sm font-medium text-slate-300">
                    <Users size={16} /> Add User
                </Link>
            </div>
        </div>
    );

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white font-['Oswald'] tracking-wider uppercase">
                        Command Center
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        BitGuard Enterprise — unified operations view
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* DB status pill */}
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2
                        ${dbHealthy ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse
                            ${dbHealthy ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        DB {health?.database?.status ?? 'Unknown'}
                    </span>
                    {/* CPU pill */}
                    {health?.infrastructure?.cpu_percent != null && (
                        <span className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-400 text-xs font-bold">
                            CPU {health.infrastructure.cpu_percent}%
                        </span>
                    )}
                    {/* Refresh button */}
                    <button
                        onClick={fetchAll}
                        disabled={loading}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white
                            transition-colors disabled:opacity-40"
                        title="Refresh"
                    >
                        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* ── Needs Attention Strip ────────────────────────────────────── */}
            {renderNeedsAttention()}

            {/* ── KPI Strip ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {kpiCards.map((card) => (
                    <KpiCard key={card.label} {...card} />
                ))}
            </div>

            {/* ── Module Tiles + Activity Feed ────────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Module Tile Grid (9 modules) */}
                <div className="xl:col-span-2 space-y-4">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Activity size={14} className="text-blue-500" />
                        Module Overview
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {moduleTiles.map((tile) => (
                            <ModuleTile key={tile.title} {...tile} />
                        ))}
                    </div>
                </div>

                {/* Right column: Actions + Health + Activity */}
                <div className="space-y-6">

                    <QuickActions />

                    {/* System Health */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Server size={14} className="text-blue-500" />
                                Infrastructure
                            </h3>
                        </div>
                        <div className="p-5 space-y-3">
                            {[
                                { label: 'Database', value: dbHealthy ? 100 : 0, status: health?.database?.status ?? 'Unknown', color: 'emerald' },
                                { label: 'CPU Usage', value: health?.infrastructure?.cpu_percent ?? 0, status: `${health?.infrastructure?.cpu_percent ?? 0}%`, color: 'blue' },
                                { label: 'Memory', value: health?.infrastructure?.memory_percent ?? 0, status: `${health?.infrastructure?.memory_percent ?? 0}%`, color: 'indigo' },
                            ].map(({ label, value, status, color }) => (
                                <div key={label}>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-slate-400 font-medium">{label}</span>
                                        <span className="text-slate-300">{status}</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-${color}-500 rounded-full transition-all duration-700`}
                                            style={{ width: `${Math.min(value, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Live Activity Feed */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Clock size={14} className="text-slate-500" />
                                Recent Activity
                            </h3>
                            <Link to="/admin/iam/audit" className="text-[11px] text-blue-400 hover:text-blue-300">
                                View all →
                            </Link>
                        </div>
                        <div className="px-5 py-2">
                            {activity.length === 0 ? (
                                <div className="py-8 text-center text-slate-500 text-sm">
                                    {loading ? 'Loading…' : 'No recent activity'}
                                </div>
                            ) : (
                                activity.map((n, i) => <ActivityItem key={n.id ?? i} notification={n} />)
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Footer: last refresh timestamp ─────────────────────────── */}
            {lastRefresh && (
                <p className="text-center text-slate-700 text-xs">
                    Last refreshed {lastRefresh.toLocaleTimeString()} · Auto-refreshes every 60s
                </p>
            )}
        </div>
    );
};

export default CommandCenter;
