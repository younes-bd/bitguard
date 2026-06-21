import {
    LayoutDashboard, Users, ShieldCheck, Building2,
    AlertCircle, FileText, ShoppingBag, Server,
    Layers, Database, Key, PieChart,
    Paintbrush, Tags, Box, ShoppingCart, Truck, Activity, Puzzle, RefreshCw, Settings,
    Megaphone, LifeBuoy, Bell, CreditCard, BarChart3, FolderKanban, TrendingUp, BookOpen,
    Monitor, Cpu, Wrench, DollarSign, Tag, Globe, Plus, FolderOpen, CheckSquare, GitBranch,
    Award, Download, Clock, Repeat, Landmark, FileSpreadsheet, Scale, Image, Mail,
    UserPlus, TrendingDown, FileCheck, Terminal, Calendar, Edit3, Share2, MessageSquare, Sparkles, PenTool, Palette, Layout, Send, Video, Smartphone, Zap, Printer, User, Trash2, Grid, Home, Target, Compass, MessageCircle, FileQuestion, Book, PhoneCall, CheckCircle
} from 'lucide-react';

// ─── ERP Apps Grid Definition ──────────────────────────────────────────────────
export const erpApps = [
    { label: 'Sales', icon: ShoppingBag, path: '/admin/sales', permissions: ['view_saleorder'] },
    { label: 'CRM', icon: Users, path: '/admin/crm', permissions: ['view_client'] },
    { label: 'Point of Sale', icon: Monitor, path: '/admin/pos', permissions: ['view_possession'] },
    { label: 'Accounting', icon: PieChart, path: '/admin/accounting', permissions: ['view_invoice'] },
    { label: 'Invoicing', icon: FileText, path: '/admin/invoicing', permissions: ['view_invoice'] },
    { label: 'Expenses', icon: CreditCard, path: '/admin/expenses', permissions: ['view_invoice'] },
    { label: 'Purchase', icon: ShoppingCart, path: '/admin/purchase', permissions: ['view_purchaseorder'] },
    { label: 'Inventory', icon: Box, path: '/admin/inventory', permissions: ['view_inventory'] },
    { label: 'Manufacturing', icon: Wrench, path: '/admin/mrp', permissions: ['view_manufacturingorder'] },
    { label: 'Employees', icon: Building2, path: '/admin/hrm', permissions: ['view_employee'] },
    { label: 'Recruitment', icon: UserPlus, path: '/admin/recruitment', permissions: ['view_employee'] },
    { label: 'Time Off', icon: Clock, path: '/admin/timeoff', permissions: ['view_employee'] },
    { label: 'Fleet', icon: Truck, path: '/admin/fleet', permissions: ['view_vehicle'] },
    { label: 'Project', icon: FolderKanban, path: '/admin/projects', permissions: ['view_internalproject'] },
    { label: 'Timesheets', icon: Clock, path: '/admin/timesheets', permissions: ['view_internalproject'] },
    { label: 'Helpdesk', icon: LifeBuoy, path: '/admin/helpdesk', permissions: ['view_ticket'] },
    { label: 'Documents', icon: FolderOpen, path: '/admin/edms', permissions: ['view_document'] },
    { label: 'Website', icon: Globe, path: '/admin/cms', permissions: ['view_page'] },
    { label: 'eLearning', icon: BookOpen, path: '/admin/elearning', permissions: ['view_page'] },
    { label: 'Email Marketing', icon: Mail, path: '/admin/email-marketing', permissions: ['view_campaign'] },
    { label: 'Discuss', icon: MessageSquare, path: '/admin/discuss', permissions: [] },
    { label: 'Calendar', icon: Calendar, path: '/admin/calendar', permissions: [] },
];

// ─── Main Admin Sidebar (Sections Format) ────────────────────────────────────
// STRICT ODOO 17/18 MATCH: EXACT APP NAMING + MISSING APPS
export const adminSections = [
    {
        title: 'Dashboards',
        items: [
            { label: 'Command Center', icon: LayoutDashboard, path: '/admin' },
            { label: 'Notifications', icon: Bell, path: '/admin/notifications' },
        ]
    },
    {
        title: 'Sales',
        items: [
            { label: 'Sales', icon: ShoppingBag, path: '/admin/sales', permissions: ['view_saleorder'] },
            { label: 'CRM', icon: Users, path: '/admin/crm', permissions: ['view_client'] },
            { label: 'Point of Sale', icon: Monitor, path: '/admin/pos', permissions: ['view_possession'] },
            { label: 'Subscription (Billing)', icon: CreditCard, path: '/admin/billing', permissions: ['view_plan'] },
            { label: 'Contracts & SLA (Sign)', icon: FileText, path: '/admin/contracts', permissions: ['view_servicecontract'] },
            { label: 'Rental', icon: Calendar, path: '/admin/rental', permissions: [] }, // NEW
        ]
    },
    {
        title: 'Services',
        items: [
            { label: 'Project', icon: FolderKanban, path: '/admin/projects', permissions: ['view_internalproject'] },
            { label: 'Timesheets', icon: Clock, path: '/admin/timesheets', permissions: ['view_internalproject'] },
            { label: 'Helpdesk', icon: LifeBuoy, path: '/admin/helpdesk', permissions: ['view_ticket'] },
            { label: 'IT Service Desk (Field Service)', icon: LifeBuoy, path: '/admin/support', permissions: ['view_ticket'] },
            { label: 'Service Catalog (Appointments)', icon: Tag, path: '/admin/services/catalog', permissions: ['view_changerequest'] },
            { label: 'Change Management (Planning)', icon: GitBranch, path: '/admin/services', permissions: ['view_changerequest'] },
        ]
    },
    {
        title: 'Accounting',
        items: [
            { label: 'Accounting', icon: PieChart, path: '/admin/accounting', permissions: ['view_invoice'] },
            { label: 'Invoicing', icon: FileText, path: '/admin/invoicing', permissions: ['view_invoice'] },
            { label: 'Expenses', icon: CreditCard, path: '/admin/expenses', permissions: ['view_invoice'] },
            { label: 'Spreadsheet', icon: FileSpreadsheet, path: '/admin/spreadsheet', permissions: [] }, // NEW
        ]
    },
    {
        title: 'Inventory & MRP',
        items: [
            { label: 'Inventory', icon: Box, path: '/admin/inventory', permissions: ['view_inventory'] },
            { label: 'Manufacturing', icon: Wrench, path: '/admin/mrp', permissions: ['view_manufacturingorder'] },
            { label: 'Purchase', icon: ShoppingCart, path: '/admin/purchase', permissions: ['view_purchaseorder'] },
            { label: 'Maintenance', icon: Monitor, path: '/admin/assets', permissions: ['view_managedendpoint'] },
            { label: 'Quality', icon: ShieldCheck, path: '/admin/quality', permissions: [] }, // NEW
            { label: 'PLM', icon: Layers, path: '/admin/plm', permissions: [] }, // NEW
        ]
    },
    {
        title: 'Human Resources',
        items: [
            { label: 'Employees', icon: Building2, path: '/admin/hrm', permissions: ['view_employee'] },
            { label: 'Recruitment', icon: UserPlus, path: '/admin/recruitment', permissions: ['view_employee'] },
            { label: 'Time Off', icon: Clock, path: '/admin/timeoff', permissions: ['view_employee'] },
            { label: 'Fleet', icon: Truck, path: '/admin/fleet', permissions: ['view_vehicle'] },
            { label: 'Appraisals', icon: Award, path: '/admin/appraisals', permissions: [] }, // NEW
            { label: 'Referrals', icon: Share2, path: '/admin/referrals', permissions: [] }, // NEW
        ]
    },
    {
        title: 'Marketing',
        items: [
            { label: 'Marketing Automation', icon: Megaphone, path: '/admin/marketing', permissions: ['view_campaign'] },
            { label: 'Email Marketing', icon: Mail, path: '/admin/email-marketing', permissions: ['view_campaign'] },
            { label: 'Social Marketing', icon: Share2, path: '/admin/social', permissions: [] }, // NEW
            { label: 'SMS Marketing', icon: Smartphone, path: '/admin/sms', permissions: [] }, // NEW
            { label: 'Events', icon: Calendar, path: '/admin/events', permissions: [] }, // NEW
            { label: 'Surveys', icon: FileQuestion, path: '/admin/surveys', permissions: [] }, // NEW
        ]
    },
    {
        title: 'Website',
        items: [
            { label: 'Website', icon: Globe, path: '/admin/cms', permissions: ['view_page'] },
            { label: 'eCommerce', icon: Tags, path: '/admin/store', permissions: ['view_product'] },
            { label: 'Blog', icon: BookOpen, path: '/admin/blog', permissions: ['view_page'] },
            { label: 'eLearning', icon: Book, path: '/admin/elearning', permissions: ['view_page'] },
            { label: 'Client Portal (Forum)', icon: LayoutDashboard, path: '/admin/portal', permissions: ['view_client'] },
            { label: 'Live Chat', icon: MessageCircle, path: '/admin/livechat', permissions: [] }, // NEW
        ]
    },
    {
        title: 'Productivity',
        items: [
            { label: 'Discuss', icon: MessageSquare, path: '/admin/discuss', permissions: [] },
            { label: 'Calendar', icon: Calendar, path: '/admin/calendar', permissions: [] },
            { label: 'Documents', icon: FolderOpen, path: '/admin/edms', permissions: ['view_document'] },
            { label: 'Approvals', icon: CheckSquare, path: '/admin/approvals', permissions: ['view_approval'] },
            { label: 'Studio', icon: FileText, path: '/admin/reporting', permissions: ['view_report'] },
            { label: 'Knowledge', icon: BookOpen, path: '/admin/knowledge', permissions: [] }, // NEW
            { label: 'WhatsApp', icon: PhoneCall, path: '/admin/whatsapp', permissions: [] }, // NEW
        ]
    },
    {
        title: 'Administration',
        items: [
            { label: 'Enterprise Analytics (Dashboards)', icon: BarChart3, path: '/admin/analytics', permissions: ['view_dashboard'] },
            { label: 'Security Operations Center', icon: ShieldCheck, path: '/admin/security', permissions: ['view_incident'] },
            { label: 'Users & Companies', icon: Key, path: '/admin/iam', permissions: ['view_user'] },
            { label: 'Settings', icon: Server, path: '/admin/system', permissions: ['view_tenant'] },
            { label: 'Apps', icon: Grid, path: '/admin/system/apps', permissions: ['view_tenant'] },
        ]
    },
];

export const adminMenu = adminSections.flatMap(s => [
    { label: s.title, icon: null, path: null },
    ...s.items
]);

// ─── Module Sub-Navigation (The Sidebar for each App) ────────────────────────
export const productMenu = {
    // ── LEGACY RESTORED & ENHANCED ──

    contracts: [
        {
            title: 'Sign',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/contracts' },
                { label: 'Documents', icon: FileText, path: '/admin/contracts/list' },
                { label: 'Templates', icon: ShoppingCart, path: '/admin/contracts/quotes' },
                { label: 'Logs', icon: ShieldCheck, path: '/admin/contracts/sla-tiers' },
                { label: 'Settings', icon: Settings, path: '/admin/contracts/settings' },
            ]
        }
    ],
    billing: [
        {
            title: 'Subscriptions',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/billing' },
                { label: 'Subscriptions', icon: CreditCard, path: '/admin/billing' },
                { label: 'Products', icon: Layers, path: '/admin/billing/plans' },
                { label: 'Customers', icon: Users, path: '/admin/billing/invoices' },
                { label: 'Settings', icon: Settings, path: '/admin/billing/settings' },
            ]
        }
    ],
    analytics: [
        {
            title: 'Dashboards',
            items: [
                { label: 'Overview', icon: PieChart, path: '/admin/analytics/executive-summary' },
                { label: 'Finance', icon: DollarSign, path: '/admin/analytics/finance' },
                { label: 'Sales', icon: Users, path: '/admin/analytics/crm' },
                { label: 'Project', icon: FolderKanban, path: '/admin/analytics/projects' },
                { label: 'Settings', icon: Settings, path: '/admin/analytics/settings' },
            ]
        }
    ],
    system: [
        {
            title: 'Settings',
            items: [
                { label: 'General Settings', icon: LayoutDashboard, path: '/admin/system' },
                { label: 'Integrations', icon: Globe, path: '/admin/system/settings?tab=integrations' },
                { label: 'Database', icon: Database, path: '/admin/system/settings?tab=retention' },
                { label: 'Technical', icon: Terminal, path: '/admin/system/server-logs' },
            ]
        }
    ],
    accounting: [
        {
            title: 'Accounting',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/accounting' },
                { label: 'Customers', icon: FileText, path: '/admin/accounting/invoices' },
                { label: 'Vendors', icon: ShoppingCart, path: '/admin/accounting/vendor-bills' },
                { label: 'Accounting', icon: FileSpreadsheet, path: '/admin/accounting/journal-entries' },
                { label: 'Reporting', icon: Activity, path: '/admin/accounting/reports' },
                { label: 'Configuration', icon: Settings, path: '/admin/accounting/settings' },
            ]
        }
    ],
    purchase: [
        {
            title: 'Purchase',
            items: [
                { label: 'Orders', icon: LayoutDashboard, path: '/admin/purchase' },
                { label: 'Products', icon: Box, path: '/admin/purchase/rfqs' },
                { label: 'Reporting', icon: Activity, path: '/admin/purchase/orders' },
                { label: 'Configuration', icon: Settings, path: '/admin/purchase/vendors' },
            ]
        }
    ],
    inventory: [
        {
            title: 'Inventory',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/inventory' },
                { label: 'Operations', icon: Truck, path: '/admin/inventory/receipts' },
                { label: 'Products', icon: Box, path: '/admin/inventory/products' },
                { label: 'Reporting', icon: Activity, path: '/admin/inventory/reports' },
                { label: 'Configuration', icon: Settings, path: '/admin/inventory/settings' },
            ]
        }
    ],
    hrm: [
        {
            title: 'Employees',
            items: [
                { label: 'Employees', icon: Users, path: '/admin/hrm/employees' },
                { label: 'Contracts', icon: FileText, path: '/admin/hrm/contracts' },
                { label: 'Departments', icon: Layers, path: '/admin/hrm/org-chart' },
                { label: 'Reporting', icon: Activity, path: '/admin/hrm/attendance' },
                { label: 'Configuration', icon: Settings, path: '/admin/hrm/settings' },
            ]
        }
    ],
    projects: [
        {
            title: 'Project',
            items: [
                { label: 'Projects', icon: FolderKanban, path: '/admin/projects/list' },
                { label: 'Tasks', icon: Layout, path: '/admin/projects/kanban' },
                { label: 'Reporting', icon: PieChart, path: '/admin/projects/reports' },
                { label: 'Configuration', icon: Settings, path: '/admin/projects/resources' },
            ]
        }
    ],
    sales: [
        {
            title: 'Sales',
            items: [
                { label: 'Orders', icon: ShoppingBag, path: '/admin/sales/orders' },
                { label: 'To Invoice', icon: FileText, path: '/admin/sales/quotations' },
                { label: 'Products', icon: Box, path: '/admin/sales/products' },
                { label: 'Reporting', icon: Activity, path: '/admin/sales/reports' },
                { label: 'Configuration', icon: Settings, path: '/admin/sales/settings' },
            ]
        }
    ],
    store: [
        {
            title: 'eCommerce',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/store/dashboard' },
                { label: 'Orders', icon: ShoppingCart, path: '/admin/store/orders' },
                { label: 'Products', icon: Box, path: '/admin/store/products' },
                { label: 'eCommerce Categories', icon: Tags, path: '/admin/store/categories' },
                { label: 'Reporting', icon: Activity, path: '/admin/store/tracking' },
                { label: 'Configuration', icon: Settings, path: '/admin/store/settings' },
            ]
        }
    ],
    security: [
        {
            title: 'Security Operations Center',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/security' },
                { label: 'Alerts', icon: AlertCircle, path: '/admin/security/alerts' },
                { label: 'Incidents', icon: ShieldCheck, path: '/admin/security/incidents' },
                { label: 'Assets', icon: Server, path: '/admin/security/assets' },
                { label: 'Compliance', icon: FileText, path: '/admin/security/compliance' },
                { label: 'Logs', icon: PieChart, path: '/admin/security/logs' },
                { label: 'Settings', icon: Settings, path: '/admin/security/settings' },
            ]
        }
    ],
    crm: [
        {
            title: 'CRM',
            items: [
                { label: 'Sales', icon: Activity, path: '/admin/crm/deals' },
                { label: 'Leads', icon: Users, path: '/admin/crm/clients' },
                { label: 'Reporting', icon: Activity, path: '/admin/crm/reports' },
                { label: 'Configuration', icon: Settings, path: '/admin/crm/settings' },
            ]
        }
    ],
    iam: [
        {
            title: 'Users & Companies',
            items: [
                { label: 'Users', icon: Users, path: '/admin/iam/users' },
                { label: 'Companies', icon: Building2, path: '/admin/iam/tenants' },
                { label: 'Groups', icon: Key, path: '/admin/iam/roles' },
            ]
        }
    ],
    support: [
        {
            title: 'Field Service',
            items: [
                { label: 'Tasks', icon: LayoutDashboard, path: '/admin/support' },
                { label: 'Planning', icon: Calendar, path: '/admin/support/tickets' },
                { label: 'Reporting', icon: Activity, path: '/admin/support/sla-live' },
                { label: 'Configuration', icon: Settings, path: '/admin/support/settings' },
            ]
        }
    ],
    marketing: [
        {
            title: 'Marketing Automation',
            items: [
                { label: 'Campaigns', icon: Megaphone, path: '/admin/marketing/campaigns' },
                { label: 'Activities', icon: Activity, path: '/admin/marketing/activities' },
                { label: 'Reporting', icon: BarChart3, path: '/admin/marketing/analytics' },
                { label: 'Configuration', icon: Settings, path: '/admin/marketing/settings' },
            ]
        }
    ],
    cms: [
        {
            title: 'Website',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/cms' },
                { label: 'Pages', icon: FileText, path: '/admin/cms' },
                { label: 'Menus', icon: LayoutDashboard, path: '/admin/cms/landing-pages' },
                { label: 'Configuration', icon: Settings, path: '/admin/cms/settings' },
            ]
        }
    ],
    edms: [
        {
            title: 'Documents',
            items: [
                { label: 'Workspace', icon: FolderOpen, path: '/admin/edms' },
                { label: 'Folders', icon: Building2, path: '/admin/edms/workspaces' },
                { label: 'Tags', icon: Tags, path: '/admin/edms/tags' },
                { label: 'Configuration', icon: Settings, path: '/admin/edms/settings' },
            ]
        }
    ],
    approvals: [
        {
            title: 'Approvals',
            items: [
                { label: 'My Approvals', icon: LayoutDashboard, path: '/admin/approvals' },
                { label: 'Configuration', icon: Settings, path: '/admin/approvals/settings' },
            ]
        }
    ],
    services: [
        {
            title: 'Planning',
            items: [
                { label: 'Schedule', icon: Calendar, path: '/admin/services' },
                { label: 'Reporting', icon: Activity, path: '/admin/services/requests' },
                { label: 'Configuration', icon: Settings, path: '/admin/services/settings' },
            ]
        }
    ],
    assets: [
        {
            title: 'Maintenance',
            items: [
                { label: 'Equipments', icon: Monitor, path: '/admin/assets/assets' },
                { label: 'Maintenance Requests', icon: Wrench, path: '/admin/assets/requests' },
                { label: 'Reporting', icon: Activity, path: '/admin/assets/depreciation' },
                { label: 'Configuration', icon: Settings, path: '/admin/assets/settings' },
            ]
        }
    ],
    reporting: [
        {
            title: 'Studio',
            items: [
                { label: 'Customizations', icon: LayoutDashboard, path: '/admin/reporting' },
                { label: 'Reports', icon: FileText, path: '/admin/reporting/templates' },
                { label: 'Views', icon: Layout, path: '/admin/reporting/generated' },
                { label: 'Automations', icon: Zap, path: '/admin/reporting/settings' },
            ]
        }
    ],

    // ── NEW ODOO APPS ──
    pos: [
        {
            title: 'Point of Sale',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/pos' },
                { label: 'Orders', icon: ShoppingBag, path: '/admin/pos/orders' },
                { label: 'Sessions', icon: Clock, path: '/admin/pos/sessions' },
                { label: 'Payments', icon: CreditCard, path: '/admin/pos/payments' },
                { label: 'Customers', icon: Users, path: '/admin/pos/customers' },
                { label: 'Products', icon: Box, path: '/admin/pos/products' },
                { label: 'Configuration', icon: Settings, path: '/admin/pos/settings' },
            ]
        }
    ],
    timesheets: [
        {
            title: 'Timesheets',
            items: [
                { label: 'My Timesheets', icon: Clock, path: '/admin/timesheets' },
                { label: 'All Timesheets', icon: Users, path: '/admin/timesheets/all' },
                { label: 'Reporting', icon: BarChart3, path: '/admin/timesheets/reports' },
            ]
        }
    ],
    helpdesk: [
        {
            title: 'Helpdesk',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/helpdesk' },
                { label: 'Tickets', icon: LifeBuoy, path: '/admin/helpdesk/tickets' },
                { label: 'SLA Policies', icon: ShieldCheck, path: '/admin/helpdesk/sla' },
                { label: 'Reporting', icon: BarChart3, path: '/admin/helpdesk/reports' },
            ]
        }
    ],
    mrp: [
        {
            title: 'Manufacturing',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/mrp' },
                { label: 'Manufacturing Orders', icon: Wrench, path: '/admin/mrp/orders' },
                { label: 'Work Orders', icon: Settings, path: '/admin/mrp/work-orders' },
                { label: 'Products', icon: Box, path: '/admin/mrp/products' },
                { label: 'Bills of Materials', icon: Layers, path: '/admin/mrp/bom' },
                { label: 'Work Centers', icon: Building2, path: '/admin/mrp/work-centers' },
            ]
        }
    ],
    recruitment: [
        {
            title: 'Recruitment',
            items: [
                { label: 'Job Positions', icon: LayoutDashboard, path: '/admin/recruitment/jobs' },
                { label: 'Applications', icon: FileText, path: '/admin/recruitment/applications' },
                { label: 'Reporting', icon: BarChart3, path: '/admin/recruitment/reports' },
            ]
        }
    ],
    timeoff: [
        {
            title: 'Time Off',
            items: [
                { label: 'My Time Off', icon: Clock, path: '/admin/timeoff' },
                { label: 'Approvals', icon: CheckSquare, path: '/admin/timeoff/approvals' },
                { label: 'Allocations', icon: Layers, path: '/admin/timeoff/allocations' },
                { label: 'Reporting', icon: BarChart3, path: '/admin/timeoff/reports' },
            ]
        }
    ],
    fleet: [
        {
            title: 'Fleet',
            items: [
                { label: 'Vehicles', icon: Truck, path: '/admin/fleet/vehicles' },
                { label: 'Odometer Logs', icon: Clock, path: '/admin/fleet/odometer' },
                { label: 'Contracts', icon: FileText, path: '/admin/fleet/contracts' },
                { label: 'Services', icon: Wrench, path: '/admin/fleet/services' },
                { label: 'Configuration', icon: Settings, path: '/admin/fleet/settings' },
            ]
        }
    ],
    invoicing: [
        {
            title: 'Invoicing',
            items: [
                { label: 'Invoices', icon: FileText, path: '/admin/invoicing/invoices' },
                { label: 'Credit Notes', icon: FileText, path: '/admin/invoicing/credit-notes' },
                { label: 'Payments', icon: DollarSign, path: '/admin/invoicing/payments' },
                { label: 'Customers', icon: Users, path: '/admin/invoicing/customers' },
            ]
        }
    ],
    expenses: [
        {
            title: 'Expenses',
            items: [
                { label: 'My Expenses', icon: CreditCard, path: '/admin/expenses' },
                { label: 'Expense Reports', icon: FileText, path: '/admin/expenses/reports' },
                { label: 'Approvals', icon: CheckSquare, path: '/admin/expenses/approvals' },
            ]
        }
    ],
    
    // Placeholder menus for newly injected modules
    rental: [{ title: 'Rental', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin/rental' }] }],
    spreadsheet: [{ title: 'Spreadsheet', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin/spreadsheet' }] }],
    quality: [{ title: 'Quality', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin/quality' }] }],
    plm: [{ title: 'PLM', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin/plm' }] }],
    appraisals: [{ title: 'Appraisals', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin/appraisals' }] }],
    referrals: [{ title: 'Referrals', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin/referrals' }] }],
    social: [{ title: 'Social Marketing', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin/social' }] }],
    sms: [{ title: 'SMS Marketing', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin/sms' }] }],
    events: [{ title: 'Events', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin/events' }] }],
    surveys: [{ title: 'Surveys', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin/surveys' }] }],
    elearning: [{ title: 'eLearning', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin/elearning' }] }],
    livechat: [{ title: 'Live Chat', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin/livechat' }] }],
    knowledge: [{ title: 'Knowledge', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin/knowledge' }] }],
    whatsapp: [{ title: 'WhatsApp', items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin/whatsapp' }] }],
};
