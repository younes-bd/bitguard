import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard, Users, ShieldCheck, ShieldAlert, PieChart, Activity,
    AlertTriangle, Truck, FileText, Megaphone, LifeBuoy,
    TrendingUp, Package, Clock, CheckCircle2, ArrowUpRight,
    RefreshCw, Server, Building2, Zap, DollarSign,
    FolderKanban, Monitor, FolderOpen, CheckSquare, GitBranch, Bell,
    PlusCircle, Globe, CreditCard, Tag, BarChart3, BookOpen, Key, Layers, Wrench, Share2,
    ShoppingBag, ShoppingCart, Mail, MessageSquare, Calendar, Settings, UserPlus, Box,
    FileSpreadsheet, ShieldCheck as ShieldCheck2, Award, Smartphone, FileQuestion, MessageCircle, Book, PhoneCall, MapPin, Utensils, Leaf, Landmark, UserCheck, Cpu, Bot
} from 'lucide-react';
import { useManifest } from '../hooks/useManifest';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { boardService } from '../api/commandCenterService';
import { ErrorBoundary } from '@/core/components/ErrorBoundary';
import { useAuth } from '@/core/hooks/useAuth';

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const COLOR_MAP = {
    emerald: { borderHover: 'hover:border-emerald-500/40', bg: 'bg-emerald-500/10', text: 'text-emerald-500', bgHover: 'group-hover:bg-emerald-500/20', textLight: 'text-emerald-400' },
    amber: { borderHover: 'hover:border-amber-500/40', bg: 'bg-amber-500/10', text: 'text-amber-500', bgHover: 'group-hover:bg-amber-500/20', textLight: 'text-amber-400' },
    blue: { borderHover: 'hover:border-blue-500/40', bg: 'bg-blue-500/10', text: 'text-blue-500', bgHover: 'group-hover:bg-blue-500/20', textLight: 'text-blue-400' },
    indigo: { borderHover: 'hover:border-indigo-500/40', bg: 'bg-indigo-500/10', text: 'text-indigo-500', bgHover: 'group-hover:bg-indigo-500/20', textLight: 'text-indigo-400' },
    rose: { borderHover: 'hover:border-rose-500/40', bg: 'bg-rose-500/10', text: 'text-rose-500', bgHover: 'group-hover:bg-rose-500/20', textLight: 'text-rose-400' },
    violet: { borderHover: 'hover:border-violet-500/40', bg: 'bg-violet-500/10', text: 'text-violet-500', bgHover: 'group-hover:bg-violet-500/20', textLight: 'text-violet-400' },
    purple: { borderHover: 'hover:border-purple-500/40', bg: 'bg-purple-500/10', text: 'text-purple-500', bgHover: 'group-hover:bg-purple-500/20', textLight: 'text-purple-400' },
    pink: { borderHover: 'hover:border-pink-500/40', bg: 'bg-pink-500/10', text: 'text-pink-500', bgHover: 'group-hover:bg-pink-500/20', textLight: 'text-pink-400' },
    orange: { borderHover: 'hover:border-orange-500/40', bg: 'bg-orange-500/10', text: 'text-orange-500', bgHover: 'group-hover:bg-orange-500/20', textLight: 'text-orange-400' },
    cyan: { borderHover: 'hover:border-cyan-500/40', bg: 'bg-cyan-500/10', text: 'text-cyan-500', bgHover: 'group-hover:bg-cyan-500/20', textLight: 'text-cyan-400' },
    sky: { borderHover: 'hover:border-sky-500/40', bg: 'bg-sky-500/10', text: 'text-sky-500', bgHover: 'group-hover:bg-sky-500/20', textLight: 'text-sky-400' },
    teal: { borderHover: 'hover:border-teal-500/40', bg: 'bg-teal-500/10', text: 'text-teal-500', bgHover: 'group-hover:bg-teal-500/20', textLight: 'text-teal-400' },
    slate: { borderHover: 'hover:border-slate-500/40', bg: 'bg-slate-500/10', text: 'text-slate-500', bgHover: 'group-hover:bg-slate-500/20', textLight: 'text-slate-400' }
};

const KpiCard = ({ label, value, sub, icon: Icon, color, to }) => {
    const c = COLOR_MAP[color] || COLOR_MAP.blue;
    return (
        <Link
            to={to || '#'}
            className={`group bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 flex gap-4 items-start
                ${c.borderHover} hover:bg-slate-800/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 no-underline`}
        >
            <div className={`p-3 rounded-xl ${c.bg} ${c.text} flex-shrink-0 mt-0.5
                ${c.bgHover} transition-colors`}>
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
};

const ModuleTile = ({ title, path, icon: Icon, color, kpi, kpiLabel, status, isInstalled = true }) => {
    const c = COLOR_MAP[color] || COLOR_MAP.blue;
    return (
        <Link
            to={path}
            className={`group ${isInstalled ? 'bg-slate-900/30' : 'bg-slate-900/10 opacity-60'} backdrop-blur-sm border border-slate-700/40 rounded-xl p-4 flex flex-col gap-3 ${isInstalled ? c.borderHover : 'hover:border-slate-600'} ${isInstalled ? 'hover:bg-slate-800/50' : 'hover:bg-slate-800/30'} hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 no-underline`}
        >
            <div className="flex justify-between items-start">
                <div className={`p-2.5 rounded-lg ${c.bg} ${c.text} ${c.bgHover} transition-colors`}>
                    <Icon size={18} />
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full
                    ${status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                        status === 'warning' ? 'bg-amber-500/10 text-amber-400 animate-pulse' :
                            'bg-slate-800 text-slate-500'}`}>
                    {isInstalled ? (status === 'active' ? 'Active' : status === 'warning' ? 'Alert' : 'Idle') : 'Not Installed'}
                </span>
            </div>
            <div>
                <p className="text-white text-sm font-semibold truncate">{title}</p>
                {kpi !== undefined && (
                    <p className={`text-xl font-bold mt-0.5 ${c.textLight}`}>{kpi}
                        <span className="text-xs text-slate-500 font-normal ml-1">{kpiLabel}</span>
                    </p>
                )}
            </div>
        </Link>
    );
};

const ActivityItem = ({ notification }) => {
    const timeAgo = (dateStr) => {
        const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };
    return (
        <div className="flex gap-3 items-start py-3 border-b border-slate-800/60 hover:bg-slate-800/20 transition-colors last:border-0 last:pb-0 px-2 rounded-lg">
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
    const { installedSet, commandCenterSections, loading: modulesLoading } = useManifest();
    const { isAuthenticated } = useAuth();
    const [metrics, setMetrics] = useState({});
    const [health, setHealth] = useState({});
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(null);
    const [dateRange, setDateRange] = useState('30days');

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [m, h, a] = await Promise.all([
                boardService.getMetrics({ range: dateRange }).catch(() => ({})),
                boardService.getSystemHealth().catch(() => ({})),
                boardService.getRecentActivity(8).catch(() => []),
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
    }, [dateRange]);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        fetchAll();
        const timer = setInterval(fetchAll, 60000); // auto-refresh every 60s
        return () => clearInterval(timer);
    }, [fetchAll, isAuthenticated]);

    const kpiCards = [
        {
            label: 'Monthly Revenue',
            value: metrics.ecommerce?.monthly_revenue != null ? `$${Number(metrics.ecommerce.monthly_revenue).toLocaleString()}` : '$0',
            sub: 'Store Performance',
            icon: DollarSign, color: 'emerald', to: '/admin/accounting', techName: 'ecommerce',
        },
        {
            label: 'MRR',
            value: metrics.billing?.mrr != null ? `$${Number(metrics.billing.mrr).toLocaleString()}` : '$0',
            sub: 'Subscriptions',
            icon: Activity, color: 'indigo', to: '/admin/board/mrr', techName: 'subscriptions',
        },
        {
            label: 'Net Profit (MTD)',
            value: metrics.erp?.net_profit_mtd != null ? `$${Number(metrics.erp.net_profit_mtd).toLocaleString()}` : '$0',
            sub: 'Finance & ERP',
            icon: TrendingUp, color: 'emerald', to: '/admin/accounting', techName: 'accounting',
        },
        {
            label: 'Cash on Hand',
            value: metrics.erp?.cash_position != null ? `$${Number(metrics.erp.cash_position).toLocaleString()}` : '$0',
            sub: 'Finance & ERP',
            icon: PieChart, color: 'blue', to: '/admin/accounting', techName: 'accounting',
        },
        {
            label: 'Outstanding A/R',
            value: metrics.erp?.outstanding_ar != null ? `$${Number(metrics.erp.outstanding_ar).toLocaleString()}` : '$0',
            sub: 'Finance & ERP',
            icon: CreditCard, color: 'amber', to: '/admin/accounting/invoices', techName: 'accounting',
        },
        {
            label: 'Active Clients',
            value: metrics.crm?.active_clients ?? '0',
            sub: 'CRM & Sales',
            icon: Users, color: 'blue', to: '/admin/crm/clients', techName: 'crm',
        },
        {
            label: 'Security Alerts',
            value: metrics.security?.open_alerts ?? '0',
            sub: 'Active Threats',
            icon: ShieldAlert,
            color: (metrics.security?.open_alerts > 0) ? 'rose' : 'emerald', 
            to: '/admin/security', techName: 'soc',
        },
        {
            label: 'Open Support Tickets',
            value: metrics.support?.open_tickets ?? '0',
            sub: 'Help Desk',
            icon: LifeBuoy, color: 'amber', to: '/admin/helpdesk/tickets', techName: 'helpdesk',
        },
        {
            label: 'Pending Orders',
            value: metrics.ecommerce?.pending_orders ?? '0',
            sub: 'E-commerce',
            icon: Package, color: 'indigo', to: '/admin/ecommerce/orders', techName: 'ecommerce',
        },
        {
            label: 'Active SLA Contracts',
            value: metrics.contracts?.active_contracts ?? '0',
            sub: 'Service Delivery',
            icon: FileText,
            color: 'violet',
            to: '/admin/sign/list', techName: 'sign',
        },
        {
            label: 'Active Employees',
            value: metrics.hrm?.headcount ?? '0',
            sub: 'People & HR',
            icon: Building2, color: 'pink', to: '/admin/hr/employees', techName: 'hr',
        },
        {
            label: 'Active Projects',
            value: metrics.projects?.active_projects ?? '0',
            sub: 'Delivery',
            icon: FolderKanban, color: 'cyan', to: '/admin/projects', techName: 'projects',
        },
    ];
    
    const visibleKpis = kpiCards.filter(card => installedSet.has(card.techName));


    // Build dynamic pillars from installed modules only
    const ICON_MAP = {
      DollarSign, Users, Monitor, LifeBuoy, PieChart, Box, Wrench, Truck, Package,
      Megaphone, Globe, Calendar, FolderKanban, Clock, ShieldCheck, Settings, Layers, Bot,
      ShoppingBag, Mail, Smartphone, Share2, FileQuestion, MessageSquare, BookOpen,
      PhoneCall, FolderOpen, CheckSquare, FileText, CreditCard, MapPin, Utensils,
      Award, UserPlus, Building2, Activity, BarChart3, Server, Key, Landmark, Leaf,
      Book, MessageCircle, Tag, Cpu
    };

    const MODULE_KPIS = {
      sale:        { kpi: metrics.sales?.orders,            kpiLabel: "orders" },
      crm:         { kpi: metrics.crm?.active_clients,      kpiLabel: "clients" },
      pos:         { kpi: metrics.pos?.sessions,             kpiLabel: "sessions" },
      subscriptions: { kpi: metrics.billing?.active_subs,   kpiLabel: "active subs" },
      accounting:  { kpi: metrics.erp?.overdue_invoices,    kpiLabel: "overdue invoices" },
      hr_expense:  { kpi: metrics.erp?.pending_expenses,    kpiLabel: "to approve" },
      sign:        { kpi: metrics.contracts?.active_contracts, kpiLabel: "active contracts" },
      projects:    { kpi: metrics.projects?.active_projects, kpiLabel: "active projects" },
      timesheets:  { kpi: metrics.projects?.missing_timesheets, kpiLabel: "missing" },
      helpdesk:    { kpi: metrics.support?.open_tickets,    kpiLabel: "open tickets" },
      stock:       { kpi: metrics.stock?.low_stock_items,   kpiLabel: "low stock" },
      mrp:         { kpi: metrics.mrp?.open_orders,         kpiLabel: "open orders" },
      purchase:    { kpi: metrics.purchase?.pending_orders,  kpiLabel: "pending POs" },
      hr:          { kpi: metrics.hrm?.headcount,            kpiLabel: "employees" },
      hr_holidays: { kpi: metrics.hrm?.pending_HrHolidays,  kpiLabel: "to approve" },
      hr_recruitment: { kpi: metrics.hrm?.open_positions,   kpiLabel: "open positions" },
      fleet:       { kpi: metrics.fleet?.vehicles,           kpiLabel: "vehicles" },
      marketing:   { kpi: metrics.marketing?.active_campaigns, kpiLabel: "campaigns" },
      website:     { kpi: metrics.website?.pages,            kpiLabel: "pages" },
      blog:        { kpi: metrics.blog?.posts,               kpiLabel: "posts" },
      documents:   { kpi: metrics.documents?.total,          kpiLabel: "documents" },
      approvals:   { kpi: metrics.approvals?.pending,        kpiLabel: "pending" },
      discuss:     { kpi: metrics.discuss?.unread,           kpiLabel: "unread" },
      calendar:    { kpi: metrics.calendar?.events,          kpiLabel: "today" },
      soc:         { kpi: metrics.security?.open_alerts,     kpiLabel: "alerts" },
    };

    const getStatus = (techName, kpi) => {
      if (techName === "accounting" && metrics.erp?.overdue_invoices > 0) return "warning";
      if (techName === "stock" && metrics.stock?.low_stock_items > 0) return "warning";
      if (techName === "approvals" && metrics.approvals?.pending > 0) return "warning";
      if (techName === "soc" && metrics.security?.open_alerts > 0) return "warning";
      return kpi > 0 ? "active" : "idle";
    };

    const CATEGORY_COLORS = {
      "Sales": "blue", "Services": "amber", "Finance": "emerald",
      "Inventory & MRP": "orange", "Human Resources": "pink",
      "Marketing": "rose", "Intelligence": "indigo", "Website": "sky",
      "Productivity": "violet", "Administration": "slate",
    };

    const dynamicPillars = (commandCenterSections || [])
      .filter(section => section.title !== 'Overview')
      .map(section => ({
        name: section.title,
        tiles: section.items.map(item => {
          const kpiData = MODULE_KPIS[item.techName] || {};
          return {
            title: item.label,
            techName: item.techName,
            path: item.path,
            icon: item.icon || Layers,
            color: CATEGORY_COLORS[section.title] || "blue",
            kpi: kpiData.kpi,
            kpiLabel: kpiData.kpiLabel || "",
            status: getStatus(item.techName, kpiData.kpi),
          };
        }),
      }));


    const dbHealthy = health?.database?.status === 'Healthy';

    const renderNeedsAttention = () => {
        const issues = [];

        if (metrics.security?.open_alerts > 0) issues.push({ text: `${metrics.security.open_alerts} Unresolved Security Alerts`, to: '/admin/security/alerts', actionLabel: 'Review' });
        if (metrics.contracts?.sla_breaches > 0) issues.push({ text: `${metrics.contracts.sla_breaches} SLA Breaches`, to: '/admin/sign/sla-breaches', actionLabel: 'Acknowledge' });
        if (metrics.erp?.overdue_invoices > 0) issues.push({ text: `${metrics.erp.overdue_invoices} Overdue Invoices`, to: '/admin/accounting/invoices', actionLabel: 'Remind' });
        if (metrics.approvals?.pending > 0) issues.push({ text: `${metrics.approvals.pending} Pending Approvals`, to: '/admin/approvals', actionLabel: 'Review' });
        if (metrics.inventory?.low_stock_items > 0) issues.push({ text: `${metrics.inventory.low_stock_items} Low Stock Items`, to: '/admin/stock', actionLabel: 'Order' });
        if (metrics.services?.high_risk > 0) issues.push({ text: `${metrics.services.high_risk} High-Risk Changes`, to: '/admin/helpdesk', actionLabel: 'Approve' });
        if (metrics.hrm?.expiring_certifications > 0)
            issues.push({ text: `${metrics.hrm.expiring_certifications} Certifications Expiring Soon`, to: '/admin/hr/employees', actionLabel: 'Notify' });
        if (metrics.documents?.expiring_soon > 0)
            issues.push({ text: `${metrics.documents.expiring_soon} Documents Expiring This Week`, to: '/admin/documents', actionLabel: 'Renew' });
        if (metrics.assets?.expiring_licenses > 0)
            issues.push({ text: `${metrics.assets.expiring_licenses} Software Licenses Expiring`, to: '/admin/maintenance', actionLabel: 'Renew' });
        
        if (issues.length === 0) return null;
        return (
            <div className="bg-rose-500/10 backdrop-blur-md border border-rose-500/30 rounded-2xl p-5 mb-8 shadow-xl shadow-rose-900/20">
                <div className="flex items-center gap-2 text-rose-400 font-bold mb-3">
                    <AlertTriangle size={18} className="animate-pulse" />
                    <h3>Needs Attention</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                    {issues.map((iss, i) => (
                        <div key={i} className="flex items-stretch bg-rose-500/20 rounded-lg border border-rose-500/20 shadow-sm overflow-hidden group">
                            <Link to={iss.to} className="hover:bg-rose-500/30 text-rose-300 text-sm font-semibold px-4 py-2 transition-colors flex items-center gap-2">
                                {iss.text}
                            </Link>
                            <Link to={iss.to} className="px-3 py-2 text-rose-300 hover:text-white hover:bg-rose-500/50 border-l border-rose-500/30 text-xs font-bold transition-all flex items-center justify-center cursor-pointer">
                                {iss.actionLabel || 'Action'}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const QuickActions = () => (
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden mb-6 shadow-lg">
            <div className="px-5 py-4 border-b border-slate-700/50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap size={14} className="text-yellow-500" />
                    Quick Actions
                </h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
                <Link to="/admin/crm" className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 hover:bg-sky-500/20 hover:text-sky-400 border border-slate-700/50 hover:border-sky-500/30 transition-all duration-300 text-sm font-medium text-slate-300">
                    <PlusCircle size={16} /> Onboard Client
                </Link>
                <Link to="/admin/helpdesk/tickets/create" className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 hover:bg-amber-500/20 hover:text-amber-400 border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 text-sm font-medium text-slate-300">
                    <LifeBuoy size={16} /> New Ticket
                </Link>
                <Link to="/admin/sales/quotations" className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 text-sm font-medium text-slate-300">
                    <FileText size={16} /> Create Quote
                </Link>
                <Link to="/admin/users/users" className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 hover:bg-purple-500/20 hover:text-purple-400 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 text-sm font-medium text-slate-300">
                    <Users size={16} /> Add User
                </Link>
                <Link to="/admin/accounting/invoices/create" className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 hover:bg-blue-500/20 hover:text-blue-400 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 text-sm font-medium text-slate-300">
                    <DollarSign size={16} /> New Invoice
                </Link>
                <Link to="/admin/hr/employees" className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 hover:bg-pink-500/20 hover:text-pink-400 border border-slate-700/50 hover:border-pink-500/30 transition-all duration-300 text-sm font-medium text-slate-300">
                    <Building2 size={16} /> Add Employee
                </Link>
                <Link to="/admin/projects" className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 hover:bg-cyan-500/20 hover:text-cyan-400 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 text-sm font-medium text-slate-300">
                    <FolderKanban size={16} /> New Project
                </Link>
                <Link to="/admin/mrp/orders" className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700/50 hover:border-rose-500/30 transition-all duration-300 text-sm font-medium text-slate-300">
                    <Wrench size={16} /> Mfg Order
                </Link>
            </div>
        </div>
    );

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold border-l-4 border-emerald-500 pl-4 py-1 text-white font-['Oswald'] tracking-wider uppercase drop-shadow-md">
                        Command Center
                    </h1>
                    <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide">
                        BitGuard Enterprise — Unified operations view
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchAll} 
                        disabled={loading}
                        className="p-2 text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
                        title="Refresh Data"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin text-emerald-500" : ""} />
                    </button>
                    {/* DB status pill */}
                    <span className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm
                        ${dbHealthy ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        <span className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.5)]
                            ${dbHealthy ? 'bg-emerald-400 shadow-emerald-400' : 'bg-red-400 shadow-red-400'}`} />
                        DB {health?.database?.status ?? 'Unknown'}
                    </span>
                    {/* CPU pill */}
                    {health?.infrastructure?.cpu_percent != null && (
                        <span className="px-4 py-2 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700/50 text-slate-300 text-xs font-bold">
                            CPU {health.infrastructure.cpu_percent}%
                        </span>
                    )}
                    {/* View Website */}
                    <Link
                        to="/"
                        target="_blank"
                        className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-all text-xs font-bold"
                        title="View Public Website"
                    >
                        <Globe size={15} />
                        <span>View Website</span>
                    </Link>
                    
                    {/* Date Range Picker */}
                    <select 
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2.5 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-lg text-slate-300 text-xs font-bold focus:outline-none focus:border-blue-500/50 transition-colors"
                    >
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="90days">Last 90 Days</option>
                        <option value="thisYear">This Year</option>
                    </select>

                    {/* Refresh button */}
                    <button
                        onClick={fetchAll}
                        disabled={loading}
                        className="p-2.5 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {visibleKpis.map((card) => (
                    <KpiCard key={card.label} {...card} />
                ))}
            </div>

            {/* ── Data Visualizations ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
                {/* MRR Trend Chart */}
                <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 shadow-lg">
                    <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <TrendingUp size={16} className="text-emerald-500" />
                        Monthly Recurring Revenue (MRR) Growth
                    </h3>
                    <div className="h-64">
                        {(metrics.mrr_history && metrics.mrr_history.length > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={metrics.mrr_history}>
                                    <defs>
                                        <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} itemStyle={{ color: '#10b981', fontWeight: 'bold' }} />
                                    <Area type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" name="MRR" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full border border-dashed border-slate-700/50 rounded-xl text-slate-500 text-sm">
                                No MRR history data available.
                            </div>
                        )}
                    </div>
                </div>

                {/* Support Ticket Burndown */}
                <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 shadow-lg">
                    <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <Activity size={16} className="text-blue-500" />
                        7-Day Support Ticket Burndown
                    </h3>
                    <div className="h-64">
                        {(metrics.support_burndown && metrics.support_burndown.length > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={metrics.support_burndown}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
                                    <Bar dataKey="opened" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Opened Tickets" />
                                    <Bar dataKey="resolved" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Resolved Tickets" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full border border-dashed border-slate-700/50 rounded-xl text-slate-500 text-sm">
                                No support burndown data available.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Module Tiles + Activity Feed ────────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Module Tile Grid (Expanded Big Tech Layout) */}
                <div className="xl:col-span-2 space-y-8">
                    {dynamicPillars.map((pillar, idx) => (
                        <div key={idx} className="space-y-4">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                {/* Use a default icon since we don't have category icons in DB yet */}
                                <Layers size={14} className="text-blue-500" />
                                {pillar.name}
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {pillar.tiles.map((tile, tidx) => (
                                    <ModuleTile key={tidx} {...tile} isInstalled={true} />
                                ))}
                            </div>
                        </div>
                    ))}
                    {installedSet.size === 0 && !modulesLoading && (
                        <div className="text-center py-20 col-span-full">
                            <Layers size={40} className="mx-auto mb-3 text-slate-700" />
                            <p className="font-bold text-slate-300">No modules installed yet.</p>
                            <Link to="/admin/apps" className="text-sky-400 text-sm hover:underline mt-2 inline-block">
                                Browse the App Store →
                            </Link>
                        </div>
                    )}
                </div>

                {/* Right column: Actions + Health + Activity */}
                <div className="space-y-6">

                    <QuickActions />

                    {/* System Health */}
                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg">
                        <div className="px-5 py-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/40">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Server size={14} className="text-blue-500" />
                                Infrastructure Telemetry
                            </h3>
                        </div>
                        <div className="p-5 space-y-4">
                            {[
                                { label: 'Database Node', value: dbHealthy ? 100 : 0, status: health?.database?.status ?? 'Unknown', color: 'emerald' },
                                { label: 'Global CPU Load', value: health?.infrastructure?.cpu_percent ?? 0, status: `${health?.infrastructure?.cpu_percent ?? 0}%`, color: 'blue' },
                                { label: 'Active Memory Pool', value: health?.infrastructure?.memory_percent ?? 0, status: `${health?.infrastructure?.memory_percent ?? 0}%`, color: 'indigo' },
                            ].map(({ label, value, status, color }) => (
                                <div key={label}>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-slate-400 font-medium">{label}</span>
                                        <span className="text-slate-300 font-bold">{status}</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
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
                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg">
                        <div className="px-5 py-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/40">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Clock size={14} className="text-slate-500" />
                                Live Security & Ops Feed
                            </h3>
                            <Link to="/admin/users/audit" className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider">
                                View all
                            </Link>
                        </div>
                        <div className="px-4 py-3">
                            {activity.length === 0 ? (
                                <div className="py-8 text-center text-slate-500 text-sm font-medium">
                                    {loading ? 'Initializing telemetry…' : 'No recent activity'}
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
                <p className="text-center text-slate-600 text-xs font-medium tracking-wide">
                    Last refreshed {lastRefresh.toLocaleTimeString()} · Operations control active
                </p>
            )}
        </div>
    );
};

const ProtectedCommandCenter = () => (
    <ErrorBoundary>
        <React.Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Initializing Subsystems...</p>
            </div>
        }>
            <CommandCenter />
        </React.Suspense>
    </ErrorBoundary>
);

export default ProtectedCommandCenter;

