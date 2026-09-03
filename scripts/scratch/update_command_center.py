import re

file_path = "frontend/src/apps/board/pages/CommandCenter.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update destructuring to include allModules
content = content.replace("const { installedSet, loading: modulesLoading } = useInstalledModules();", "const { installedSet, allModules, loading: modulesLoading } = useInstalledModules();")

# 2. Add KPI logic and Dynamic Pillars logic before `const dbHealthy = ...`
# Let us replace the enterprisePillars array first
enterprise_pillars_pattern = re.compile(r"    // ── Enterprise Pillars \(Module Overview\) ─────────────────────────────.*?    \];", re.DOTALL)
match = enterprise_pillars_pattern.search(content)
if match:
    dynamic_logic = """
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

    const installedModules = allModules.filter(m => m.is_installed);
    const grouped = installedModules.reduce((acc, m) => {
      const cat = m.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(m);
      return acc;
    }, {});

    const CATEGORY_ORDER = [
      "Sales", "Services", "Finance", "Inventory & MRP",
      "Human Resources", "Marketing", "Intelligence",
      "Website", "Productivity", "Administration"
    ];
    const dynamicPillars = CATEGORY_ORDER
      .filter(cat => grouped[cat]?.length > 0)
      .map(cat => ({
        name: cat,
        tiles: grouped[cat].map(m => {
          const kpiData = MODULE_KPIS[m.technical_name] || {};
          return {
            title: m.name,
            techName: m.technical_name,
            path: m.url || `/admin/${m.technical_name}`,
            icon: ICON_MAP[m.icon] || Layers,
            color: CATEGORY_COLORS[cat] || "blue",
            kpi: kpiData.kpi,
            kpiLabel: kpiData.kpiLabel || "",
            status: getStatus(m.technical_name, kpiData.kpi),
          };
        }),
      }));
"""
    content = content.replace(match.group(0), dynamic_logic)

# 3. Fix kpiCards definition
kpi_cards_old = r"    const kpiCards = \[.*?    \];"
kpi_cards_pattern = re.compile(kpi_cards_old, re.DOTALL)
kpi_cards_match = kpi_cards_pattern.search(content)
if kpi_cards_match:
    kpi_cards_new = """    const kpiCards = [
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
    
    const visibleKpis = kpiCards.filter(card => installedSet.has(card.techName));"""
    content = content.replace(kpi_cards_match.group(0), kpi_cards_new)

# 4. Replace kpiCards rendering
content = content.replace("kpiCards.map", "visibleKpis.map")

# Wrap visibleKpis with length check
kpi_grid_pattern = re.compile(r'            \{\/\* ── KPI Strip ──────────────────────────────────────────────── \*\/\}\n            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">\n                \{visibleKpis\.map\(\(kpi, idx\) => \(\n                    <KpiCard key=\{idx\} \{\.\.\.kpi\} \/>\n                \)\)\}\n            <\/div>')

new_kpi_grid = """            {/* ── KPI Strip ──────────────────────────────────────────────── */}
            {visibleKpis.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {visibleKpis.map((kpi, idx) => (
                        <KpiCard key={idx} {...kpi} />
                    ))}
                </div>
            )}"""
content = kpi_grid_pattern.sub(new_kpi_grid, content)

# 5. Replace enterprisePillars rendering
pillars_render_old = """                    {enterprisePillars.map((pillar) => {
                        const visibleTiles = pillar.tiles;
                        if (visibleTiles.length === 0) return null;
                        return (
                        <div key={pillar.name} className="space-y-4">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <pillar.icon size={14} className="text-blue-500" />
                                {pillar.name}
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {pillar.tiles.map((tile) => {
                                const isInstalled = tile.techName === null || (installedSet && installedSet.has(tile.techName));
                                const displayStatus = isInstalled ? tile.status : 'idle';
                                const displayPath = isInstalled ? tile.path : `/admin/apps?highlight=${tile.techName}`;
                                return (
                                    <ModuleTile key={tile.title} {...tile} status={displayStatus} path={displayPath} isInstalled={isInstalled} />
                                );
                                })}
                            </div>
                        </div>
                    );
                    })}"""

pillars_render_new = """                    {dynamicPillars.map((pillar, idx) => (
                        <div key={idx} className="space-y-4">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
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
                    {installedModules.length === 0 && !modulesLoading && (
                        <div className="text-center py-20 col-span-full">
                            <Layers size={40} className="mx-auto mb-3 text-slate-700" />
                            <p className="font-bold text-slate-300">No modules installed yet.</p>
                            <Link to="/admin/apps" className="text-sky-400 text-sm hover:underline mt-2 inline-block">
                                Browse the App Store →
                            </Link>
                        </div>
                    )}"""
content = content.replace(pillars_render_old, pillars_render_new)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
