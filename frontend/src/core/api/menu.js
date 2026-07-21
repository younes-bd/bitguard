import {
    LayoutDashboard, Users, ShieldCheck, Building2,
    AlertCircle, FileText, ShoppingBag, Server,
    Layers, Database, Key, PieChart,
    Paintbrush, Tags, Box, ShoppingCart, Truck, Activity, Puzzle, RefreshCw, Settings,
    Megaphone, LifeBuoy, Bell, CreditCard, BarChart3, FolderKanban, TrendingUp, BookOpen,
    Monitor, Cpu, Wrench, DollarSign, Tag, Globe, Plus, FolderOpen, CheckSquare, GitBranch,
    Award, Download, Clock, Repeat, Landmark, FileSpreadsheet, Scale, Image, Mail,
    UserPlus, TrendingDown, FileCheck, Terminal, Calendar, Edit3, Share2, MessageSquare, Sparkles, PenTool, Palette, Layout, Send, Video, Smartphone, Zap, Printer, User, Trash2, Grid, Home, Target, Compass, MessageCircle, FileQuestion, Book, PhoneCall, CheckCircle, MapPin, Utensils, Leaf, UserCheck, Star, Upload, AtSign
} from 'lucide-react';

// ─── ERP Apps Grid Definition ──────────────────────────────────────────────────
export const erpApps = [
    { label: 'Sale', icon: ShoppingBag, path: '/admin/sales', permissions: ['view_saleorder'] },
    { label: 'CRM', icon: Users, path: '/admin/crm', permissions: ['view_client'] },
    { label: 'Point of Sale', icon: Monitor, path: '/admin/pos', permissions: ['view_possession'] },
    { label: 'Restaurant', icon: Utensils, path: '/admin/pos', permissions: ['view_possession'] },
    { label: 'Accounting', icon: PieChart, path: '/admin/accounting', permissions: ['view_invoice'] },
    { label: 'Invoicing', icon: FileText, path: '/admin/invoicing', permissions: ['view_invoice'] },
    { label: 'Expenses', icon: CreditCard, path: '/admin/expenses', permissions: ['view_invoice'] },
    { label: 'Purchase', icon: ShoppingCart, path: '/admin/purchase', permissions: ['view_purchaseorder'] },
    { label: 'Inventory', icon: Box, path: '/admin/stock', permissions: ['view_inventory'] },
    { label: 'Manufacturing', icon: Wrench, path: '/admin/mrp', permissions: ['view_manufacturingorder'] },
    { label: 'Employees', icon: Building2, path: '/admin/hr', permissions: ['view_employee'] },
    { label: 'Recruitment', icon: UserPlus, path: '/admin/recruitment', permissions: ['view_employee'] },
    { label: 'Time Off', icon: Clock, path: '/admin/hr_holidays', permissions: ['view_employee'] },
    { label: 'Fleet', icon: Truck, path: '/admin/fleet', permissions: ['view_vehicle'] },
    { label: 'Project', icon: FolderKanban, path: '/admin/projects', permissions: ['view_internalproject'] },
    { label: 'Timesheets', icon: Clock, path: '/admin/timesheets', permissions: ['view_internalproject'] },
    { label: 'Helpdesk', icon: LifeBuoy, path: '/admin/helpdesk', permissions: ['view_ticket'] },
    { label: 'Documents', icon: FolderOpen, path: '/admin/documents', permissions: ['view_document'] },
    { label: 'Website', icon: Globe, path: '/admin/website/dashboard', permissions: ['view_page'] },
    { label: 'eLearning', icon: BookOpen, path: '/admin/elearning', permissions: ['view_page'] },
    { label: 'Mass Mailing', icon: Mail, path: '/admin/mass_mailing', permissions: ['view_campaign'] },
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
        title: 'Sale',
        items: [
            { label: 'Sale', icon: ShoppingBag, path: '/admin/sales', permissions: ['view_saleorder'] },
            { label: 'CRM', icon: Users, path: '/admin/crm', permissions: ['view_client'] },
            { label: 'Point of Sale', icon: Monitor, path: '/admin/pos', permissions: ['view_possession'] },
            { label: 'Restaurant', icon: Utensils, path: '/admin/pos', permissions: ['view_possession'] },
            { label: 'Subscription (Billing)', icon: CreditCard, path: '/admin/billing', permissions: ['view_plan'] },
            { label: 'Rental', icon: Calendar, path: '/admin/rental', permissions: [] }, // NEW
        ]
    },
    {
        title: 'Services',
        items: [
            { label: 'Project', icon: FolderKanban, path: '/admin/projects', permissions: ['view_internalproject'] },
            { label: 'Timesheets', icon: Clock, path: '/admin/timesheets', permissions: ['view_internalproject'] },
            { label: 'Helpdesk', icon: LifeBuoy, path: '/admin/helpdesk', permissions: ['view_ticket'] },
            { label: 'Field Service', icon: MapPin, path: '/admin/field-service', permissions: [] },
            { label: 'Appointments', icon: Calendar, path: '/admin/appointments', permissions: [] },
            { label: 'Planning', icon: GitBranch, path: '/admin/planning', permissions: [] },
        ]
    },
    {
        title: 'Finance',
        items: [
            { label: 'Accounting', icon: PieChart, path: '/admin/accounting', permissions: ['view_invoice'] },
            { label: 'Invoicing', icon: FileText, path: '/admin/invoicing', permissions: ['view_invoice'] },
            { label: 'Expenses', icon: CreditCard, path: '/admin/expenses', permissions: ['view_invoice'] },
            { label: 'Contracts & SLA (Sign)', icon: FileText, path: '/admin/contracts', permissions: ['view_servicecontract'] },
            { label: 'ESG & Sustainability', icon: Leaf, path: '/admin/esg', permissions: [] }, // NEW
            { label: 'Equity', icon: Landmark, path: '/admin/equity', permissions: [] }, // NEW
        ]
    },
    {
        title: 'Inventory & MRP',
        items: [
            { label: 'Inventory', icon: Box, path: '/admin/stock', permissions: ['view_inventory'] },
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
            { label: 'Employees', icon: Building2, path: '/admin/hr', permissions: ['view_employee'] },
            { label: 'Attendances', icon: UserCheck, path: '/admin/hr_attendance', permissions: [] }, // NEW
            { label: 'Recruitment', icon: UserPlus, path: '/admin/recruitment', permissions: ['view_employee'] },
            { label: 'Time Off', icon: Clock, path: '/admin/hr_holidays', permissions: ['view_employee'] },
            { label: 'Fleet', icon: Truck, path: '/admin/fleet', permissions: ['view_vehicle'] },
            { label: 'Payroll', icon: DollarSign, path: '/admin/payroll', permissions: [] }, // NEW
            { label: 'Appraisals', icon: Award, path: '/admin/appraisals', permissions: [] }, // NEW
            { label: 'Referrals', icon: Share2, path: '/admin/referrals', permissions: [] }, // NEW
        ]
    },
    {
        title: 'Marketing',
        items: [
            { label: 'Marketing Automation', icon: Megaphone, path: '/admin/marketing', permissions: ['view_campaign'] },
            { label: 'Mass Mailing', icon: Mail, path: '/admin/mass_mailing', permissions: ['view_campaign'] },
            { label: 'Social Marketing', icon: Share2, path: '/admin/social', permissions: [] }, // NEW
            { label: 'SMS Marketing', icon: Smartphone, path: '/admin/sms', permissions: [] }, // NEW
            { label: 'Events', icon: Calendar, path: '/admin/events', permissions: [] }, // NEW
            { label: 'Surveys', icon: FileQuestion, path: '/admin/surveys', permissions: [] }, // NEW
        ]
    },
    {
        title: 'Website',
        items: [
            { label: 'Website', icon: Globe, path: '/admin/website/dashboard', permissions: ['view_page'] },
            { label: 'eCommerce', icon: Tags, path: '/admin/ecommerce', permissions: ['view_product'] },
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
            { label: 'Documents', icon: FolderOpen, path: '/admin/documents', permissions: ['view_document'] },
            { label: 'Approvals', icon: CheckSquare, path: '/admin/approvals', permissions: ['view_approval'] },
            { label: 'Studio', icon: FileText, path: '/admin/reporting', permissions: ['view_report'] },
            { label: 'Knowledge', icon: BookOpen, path: '/admin/knowledge', permissions: [] }, // NEW
            { label: 'WhatsApp', icon: PhoneCall, path: '/admin/whatsapp', permissions: [] }, // NEW
        ]
    },
    {
        title: 'Administration',
        items: [
            { label: 'Dashboards', icon: BarChart3, path: '/admin/dashboards', permissions: ['view_dashboard'] },
            { label: 'Security Operations Center', icon: ShieldCheck, path: '/admin/security', permissions: ['view_incident'] },
            { label: 'Settings', icon: Server, path: '/admin/settings', permissions: ['view_tenant'] },
            { label: 'Apps', icon: Grid, path: '/admin/apps', permissions: ['view_tenant'] },
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
            title: 'Dashboard',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/contracts' },
            ]
        },
        {
            title: 'Signature Requests',
            items: [
                { label: 'Signature Requests', icon: FileText, path: '/admin/contracts/requests' },
            ]
        },
        {
            title: 'Documents',
            items: [
                { label: 'Documents', icon: FolderOpen, path: '/admin/contracts/documents' },
            ]
        },
        {
            title: 'Templates',
            items: [
                { label: 'Templates', icon: Layers, path: '/admin/contracts/templates' },
            ]
        },
        {
            title: 'Contacts',
            items: [
                { label: 'Contacts', icon: Users, path: '/admin/contracts/contacts' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/contracts/settings' },
                { label: 'Roles', icon: ShieldCheck, path: '/admin/contracts/roles' },
            ]
        }
    ],
    billing: [
        {
            title: 'Subscriptions',
            items: [
                { label: 'Subscriptions', icon: CreditCard, path: '/admin/billing' },
                { label: 'Subscriptions to Invoice', icon: FileText, path: '/admin/billing/to-invoice' },
                { label: 'Customers', icon: Users, path: '/admin/billing/customers' },
            ]
        },
        {
            title: 'Products',
            items: [
                { label: 'Products', icon: Box, path: '/admin/billing/products' },
                { label: 'Subscription Templates', icon: Layers, path: '/admin/billing/plans' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Subscriptions', icon: BarChart3, path: '/admin/billing/reports' },
                { label: 'Retention', icon: Activity, path: '/admin/billing/retention' },
                { label: 'Revenue KPIs', icon: PieChart, path: '/admin/billing/kpis' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/billing/settings' },
                { label: 'Subscription Templates', icon: Layers, path: '/admin/billing/plans' },
                { label: 'Close Reasons', icon: AlertCircle, path: '/admin/billing/close-reasons' },
                { label: 'Alerts', icon: Bell, path: '/admin/billing/alerts' },
            ]
        }
    ],
    dashboards: [
        {
            title: 'Dashboards',
            items: [
                { label: 'Overview', icon: PieChart, path: '/admin/dashboards' },
                { label: 'Executive Summary', icon: LayoutDashboard, path: '/admin/dashboards/executive' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Revenue Analytics', icon: DollarSign, path: '/admin/dashboards/revenue' },
                { label: 'Finance & P&L', icon: DollarSign, path: '/admin/dashboards/finance' },
                { label: 'Sales Performance', icon: Users, path: '/admin/dashboards/crm' },
                { label: 'Service Desk', icon: LifeBuoy, path: '/admin/dashboards/support' },
                { label: 'Security Posture', icon: ShieldCheck, path: '/admin/dashboards/security' },
                { label: 'People & HR', icon: Users, path: '/admin/dashboards/hrm' },
                { label: 'Projects', icon: FolderKanban, path: '/admin/dashboards/projects' },
                { label: 'MRR Dashboard', icon: TrendingUp, path: '/admin/dashboards/mrr' },
            ]
        },
        {
            title: 'Tools',
            items: [
                { label: 'Export Data', icon: Download, path: '/admin/dashboards/export' },
            ]
        }
    ],
    settings: [
        {
            title: 'General Settings',
            items: [
                { label: 'General Settings', icon: LayoutDashboard, path: '/admin/settings' },
            ]
        },
        {
            title: 'Users & Companies',
            items: [
                { label: 'Users', icon: Users, path: '/admin/settings/users' },
                { label: 'Companies', icon: Building2, path: '/admin/settings/companies' },
                { label: 'User Groups', icon: ShieldCheck, path: '/admin/settings/groups' },
                { label: 'Access Rights', icon: Key, path: '/admin/settings/access-rights' },
                { label: 'Record Rules', icon: Database, path: '/admin/settings/record-rules' },
                { label: 'Security Policy', icon: ShieldCheck, path: '/admin/settings/security-policy' },
            ]
        },
        {
            title: 'Translations',
            items: [
                { label: 'Languages', icon: Globe, path: '/admin/settings/languages' },
                { label: 'Export Translations', icon: Upload, path: '/admin/settings/translations-export' },
                { label: 'Import Translations', icon: Download, path: '/admin/settings/translations-import' },
            ]
        },
        {
            title: 'App Settings',
            items: [
                { label: 'CRM', icon: Users, path: '/admin/settings/crm' },
                { label: 'Sales', icon: ShoppingBag, path: '/admin/settings/sales' },
                { label: 'Accounting', icon: PieChart, path: '/admin/settings/accounting' },
                { label: 'Inventory', icon: Box, path: '/admin/settings/inventory' },
                { label: 'Manufacturing', icon: Wrench, path: '/admin/settings/manufacturing' },
                { label: 'Website', icon: Globe, path: '/admin/settings/website' },
            ]
        },
        {
            title: 'Technical',
            items: [
                { label: 'Scheduled Actions', icon: Clock, path: '/admin/settings/scheduled-actions' },
                { label: 'Server Actions', icon: Terminal, path: '/admin/settings/server-actions' },
                { label: 'Sequences', icon: Layers, path: '/admin/settings/sequences' },
                { label: 'Audit Logs', icon: ShieldCheck, path: '/admin/settings/logs' },
                { label: 'Server Logs', icon: Terminal, path: '/admin/settings/server-logs' },
            ]
        },
        {
            title: 'Email',
            items: [
                { label: 'Outgoing Mail Servers', icon: Send, path: '/admin/settings/email-servers-outgoing' },
                { label: 'Incoming Mail Servers', icon: Mail, path: '/admin/settings/email-servers-incoming' },
                { label: 'Email Templates', icon: FileText, path: '/admin/settings/email-templates' },
                { label: 'Mail Aliases', icon: AtSign, path: '/admin/settings/mail-aliases' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Reports', icon: FileText, path: '/admin/settings/reports' },
                { label: 'Report Tags', icon: Tag, path: '/admin/settings/report-tags' },
            ]
        }
    ],
    apps: [
        {
            title: 'Apps',
            items: [
                { label: 'Apps', icon: Grid, path: '/admin/apps' },
                { label: 'Theme Modules', icon: Palette, path: '/admin/apps/themes' },
                { label: 'Updates', icon: RefreshCw, path: '/admin/apps/updates' },
            ]
        },
        {
            title: 'Categories',
            items: [
                { label: 'Sales', icon: ShoppingBag, path: '/admin/apps?category=Sales' },
                { label: 'Services', icon: LifeBuoy, path: '/admin/apps?category=Services' },
                { label: 'Accounting', icon: PieChart, path: '/admin/apps?category=Accounting' },
                { label: 'Inventory', icon: Box, path: '/admin/apps?category=Inventory' },
                { label: 'Manufacturing', icon: Wrench, path: '/admin/apps?category=Manufacturing' },
                { label: 'Website', icon: Globe, path: '/admin/apps?category=Website' },
                { label: 'Marketing', icon: BarChart3, path: '/admin/apps?category=Marketing' },
                { label: 'Human Resources', icon: Users, path: '/admin/apps?category=Human Resources' },
                { label: 'Productivity', icon: CheckSquare, path: '/admin/apps?category=Productivity' },
                { label: 'Administration', icon: Settings, path: '/admin/apps?category=Administration' },
            ]
        }
    ],
    accounting: [
        {
            title: 'Accounting',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/accounting' },
                { label: 'Journal Entries', icon: FileSpreadsheet, path: '/admin/accounting/journal-entries' },
                { label: 'Ledgers', icon: Book, path: '/admin/accounting/ledgers' },
                { label: 'Bank Statements', icon: Landmark, path: '/admin/accounting/bank-statements' },
                { label: 'Reconciliation', icon: RefreshCw, path: '/admin/accounting/reconciliation' },
            ]
        },
        {
            title: 'Customers',
            items: [
                { label: 'Invoices', icon: FileText, path: '/admin/accounting/invoices' },
                { label: 'Credit Notes', icon: FileText, path: '/admin/accounting/customer-credit-notes' },
                { label: 'Payments', icon: DollarSign, path: '/admin/accounting/customer-payments' },
                { label: 'Follow-up Reports', icon: Activity, path: '/admin/accounting/follow-up' },
                { label: 'Customers', icon: Users, path: '/admin/accounting/customers' },
            ]
        },
        {
            title: 'Vendors',
            items: [
                { label: 'Bills', icon: ShoppingCart, path: '/admin/accounting/vendor-bills' },
                { label: 'Refunds', icon: RefreshCw, path: '/admin/accounting/vendor-refunds' },
                { label: 'Payments', icon: DollarSign, path: '/admin/accounting/vendor-payments' },
                { label: 'Employee Expense', icon: CreditCard, path: '/admin/accounting/employee-expenses' },
                { label: 'Vendors', icon: Users, path: '/admin/accounting/vendors' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'General Ledger', icon: Book, path: '/admin/accounting/reports/general-ledger' },
                { label: 'Partner Ledger', icon: Users, path: '/admin/accounting/reports/partner-ledger' },
                { label: 'Tax Report', icon: FileText, path: '/admin/accounting/reports/tax' },
                { label: 'Aged Receivable/Payable', icon: Clock, path: '/admin/accounting/reports/aged' },
                { label: 'Audit Reports', icon: Activity, path: '/admin/accounting/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/accounting/settings' },
                { label: 'Chart of Accounts', icon: Layers, path: '/admin/accounting/chart-of-accounts' },
                { label: 'Taxes', icon: FileText, path: '/admin/accounting/taxes' },
                { label: 'Journals', icon: BookOpen, path: '/admin/accounting/journals' },
                { label: 'Bank Accounts', icon: Landmark, path: '/admin/accounting/bank-accounts' },
                { label: 'Payment Providers', icon: CreditCard, path: '/admin/accounting/payment-providers' },
                { label: 'Fiscal Positions', icon: Globe, path: '/admin/accounting/fiscal-positions' },
            ]
        }
    ],
    purchase: [
        {
            title: 'Orders',
            items: [
                { label: 'Requests for Quotation', icon: LayoutDashboard, path: '/admin/purchase' },
                { label: 'Purchase Orders', icon: FileText, path: '/admin/purchase/orders' },
                { label: 'Vendors', icon: Users, path: '/admin/purchase/vendors' },
            ]
        },
        {
            title: 'Products',
            items: [
                { label: 'Products', icon: Box, path: '/admin/purchase/products' },
                { label: 'Product Variants', icon: Layers, path: '/admin/purchase/product-variants' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Purchase Analysis', icon: Activity, path: '/admin/purchase/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/purchase/settings' },
                { label: 'Vendor Pricelists', icon: DollarSign, path: '/admin/purchase/pricelists' },
            ]
        }
    ],
    stock: [
        {
            title: 'Inventory',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/stock' },
            ]
        },
        {
            title: 'Operations',
            items: [
                { label: 'Receipts', icon: Truck, path: '/admin/stock/receipts' },
                { label: 'Deliveries', icon: Truck, path: '/admin/stock/deliveries' },
                { label: 'Transfers', icon: RefreshCw, path: '/admin/stock/transfers' },
                { label: 'Replenishment', icon: RefreshCw, path: '/admin/stock/replenishment' },
                { label: 'Inventory Adjustments', icon: Edit3, path: '/admin/stock/adjustments' },
                { label: 'Scrap', icon: Trash2, path: '/admin/stock/scrap' },
                { label: 'Landed Costs', icon: DollarSign, path: '/admin/stock/landed-costs' },
                { label: 'Run Scheduler', icon: Clock, path: '/admin/stock/run-scheduler' },
            ]
        },
        {
            title: 'Products',
            items: [
                { label: 'Products', icon: Box, path: '/admin/stock/products' },
                { label: 'Product Variants', icon: Layers, path: '/admin/stock/product-variants' },
                { label: 'Lots/Serial Numbers', icon: Tag, path: '/admin/stock/lots' },
                { label: 'Packages', icon: Box, path: '/admin/stock/packages' },
                { label: 'Putaway Rules', icon: GitBranch, path: '/admin/stock/putaway' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Stock', icon: Activity, path: '/admin/stock/reports/stock' },
                { label: 'Moves History', icon: Clock, path: '/admin/stock/reports/moves' },
                { label: 'Inventory Valuation', icon: DollarSign, path: '/admin/stock/reports/valuation' },
                { label: 'Performance', icon: BarChart3, path: '/admin/stock/reports/performance' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/stock/settings' },
                { label: 'Warehouses', icon: Building2, path: '/admin/stock/warehouses' },
                { label: 'Locations', icon: MapPin, path: '/admin/stock/locations' },
                { label: 'Routes', icon: GitBranch, path: '/admin/stock/routes' },
                { label: 'Rules', icon: GitBranch, path: '/admin/stock/rules' },
                { label: 'Operation Types', icon: Layers, path: '/admin/stock/operation-types' },
                { label: 'Product Categories', icon: Tags, path: '/admin/stock/product-categories' },
                { label: 'Attributes', icon: Tag, path: '/admin/stock/attributes' },
                { label: 'Reordering Rules', icon: RefreshCw, path: '/admin/stock/reorder-rules' },
                { label: 'Shipping Methods', icon: Truck, path: '/admin/stock/shipping' },
            ]
        }
    ],
    hr: [
        {
            title: 'Employees',
            items: [
                { label: 'Employees', icon: Users, path: '/admin/hr/employees' },
                { label: 'Contracts', icon: FileText, path: '/admin/hr/contracts' },
            ]
        },
        {
            title: 'Departments',
            items: [
                { label: 'Departments', icon: Layers, path: '/admin/hr/org-chart' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Reporting', icon: Activity, path: '/admin/hr/reporting' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/hr/settings' },
                { label: 'Work Locations', icon: MapPin, path: '/admin/hr/work-locations' },
                { label: 'Departure Reasons', icon: AlertCircle, path: '/admin/hr/departure-reasons' },
            ]
        }
    ],
    projects: [
        {
            title: 'Project',
            items: [
                { label: 'Projects', icon: FolderKanban, path: '/admin/projects/list' },
                { label: 'Tasks', icon: Layout, path: '/admin/projects/kanban' },
                { label: 'Updates', icon: Activity, path: '/admin/projects/updates' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Task Analysis', icon: PieChart, path: '/admin/projects/reports' },
                { label: 'Burndown Chart', icon: Activity, path: '/admin/projects/burndown' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/projects/settings' },
                { label: 'Project Stages', icon: Layers, path: '/admin/projects/stages/project' },
                { label: 'Task Stages', icon: GitBranch, path: '/admin/projects/stages/task' },
                { label: 'Project Templates', icon: FileText, path: '/admin/projects/templates' },
                { label: 'Activity Types', icon: Activity, path: '/admin/projects/activity-types' },
                { label: 'Tags', icon: Tag, path: '/admin/projects/tags' },
            ]
        }
    ],
    sales: [
        {
            title: 'Orders',
            items: [
                { label: 'Quotations', icon: FileText, path: '/admin/sales/quotations' },
                { label: 'Orders', icon: ShoppingBag, path: '/admin/sales/orders' },
                { label: 'Sales Teams', icon: Users, path: '/admin/sales/teams' },
                { label: 'Customers', icon: Users, path: '/admin/sales/customers' },
            ]
        },
        {
            title: 'To Invoice',
            items: [
                { label: 'Orders to Invoice', icon: FileText, path: '/admin/sales/to-invoice' },
            ]
        },
        {
            title: 'Products',
            items: [
                { label: 'Products', icon: Box, path: '/admin/sales/products' },
                { label: 'Product Variants', icon: Layers, path: '/admin/sales/product-variants' },
                { label: 'Pricelists', icon: DollarSign, path: '/admin/sales/pricelists' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Sales', icon: Activity, path: '/admin/sales/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/sales/settings' },
                { label: 'Sales Teams', icon: Users, path: '/admin/sales/teams' },
                { label: 'Quotation Templates', icon: FileText, path: '/admin/sales/quote-templates' },
                { label: 'Shipping Methods', icon: Truck, path: '/admin/sales/shipping' },
            ]
        }
    ],
    ecommerce: [
        {
            title: 'eCommerce',
            items: [
                { label: 'Orders', icon: ShoppingCart, path: '/admin/ecommerce/orders' },
                { label: 'Unpaid Orders', icon: CreditCard, path: '/admin/ecommerce/unpaid-orders' },
                { label: 'Abandoned Carts', icon: Trash2, path: '/admin/ecommerce/abandoned-carts' },
                { label: 'Products', icon: Box, path: '/admin/ecommerce/products' },
                { label: 'eCommerce Categories', icon: Tags, path: '/admin/ecommerce/categories' },
                { label: 'Discount & Loyalty', icon: Award, path: '/admin/ecommerce/loyalty' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'eCommerce', icon: Activity, path: '/admin/ecommerce/tracking' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/ecommerce/settings' },
                { label: 'Payment Providers', icon: CreditCard, path: '/admin/ecommerce/payment-providers' },
                { label: 'Shipping Methods', icon: Truck, path: '/admin/ecommerce/shipping' },
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
            title: 'Sales',
            items: [
                { label: 'My Pipeline', icon: Activity, path: '/admin/crm/pipeline' },
                { label: 'My Activities', icon: Calendar, path: '/admin/crm/activities' },
                { label: 'My Quotations', icon: FileText, path: '/admin/crm/quotations' },
            ]
        },
        {
            title: 'Leads',
            items: [
                { label: 'Leads', icon: Users, path: '/admin/crm/leads' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Forecast', icon: TrendingUp, path: '/admin/crm/forecast' },
                { label: 'Pipeline', icon: Activity, path: '/admin/crm/reports' },
                { label: 'Leads', icon: Users, path: '/admin/crm/leads-report' },
                { label: 'Activities', icon: Calendar, path: '/admin/crm/activities-report' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/crm/settings' },
                { label: 'Sales Teams', icon: Users, path: '/admin/crm/teams' },
                { label: 'Lead Mining Requests', icon: Database, path: '/admin/crm/mining' },
                { label: 'Lost Reasons', icon: AlertCircle, path: '/admin/crm/lost-reasons' },
                { label: 'Pipeline', icon: Activity, path: '/admin/crm/pipeline-settings' },
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
                { label: 'Tasks', icon: LayoutDashboard, path: '/admin/helpdesk' },
                { label: 'Planning', icon: Calendar, path: '/admin/helpdesk/tickets' },
                { label: 'Reporting', icon: Activity, path: '/admin/helpdesk/sla-live' },
                { label: 'Configuration', icon: Settings, path: '/admin/helpdesk/settings' },
            ]
        }
    ],
    marketing: [
        {
            title: 'Marketing Automation',
            items: [
                { label: 'Campaigns', icon: Megaphone, path: '/admin/marketing/campaigns' },
                { label: 'Automations', icon: Zap, path: '/admin/marketing/automations' },
                { label: 'Posts', icon: Share2, path: '/admin/marketing/posts' },
                { label: 'Activities', icon: Activity, path: '/admin/marketing/activities' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Analytics', icon: BarChart3, path: '/admin/marketing/dashboards' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/marketing/settings' },
            ]
        }
    ],
    website: [
        {
            title: 'Dashboard',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/website/dashboard' },
            ]
        },
        {
            title: 'Site',
            items: [
                { label: 'Homepage', icon: Home, path: '/', external: true },
                { label: 'Pages', icon: FileText, path: '/admin/website/pages' },
                { label: 'Menus', icon: Layout, path: '/admin/website/menus' },
                { label: 'Blog Posts', icon: BookOpen, path: '/admin/website/blog-posts' },
            ]
        },
        {
            title: 'eCommerce',
            items: [
                { label: 'Orders', icon: ShoppingCart, path: '/admin/ecommerce/orders' },
                { label: 'Unpaid Orders', icon: CreditCard, path: '/admin/ecommerce/unpaid-orders' },
                { label: 'Abandoned Carts', icon: Trash2, path: '/admin/ecommerce/abandoned-carts' },
                { label: 'Products', icon: Box, path: '/admin/ecommerce/products' },
                { label: 'eCommerce Categories', icon: Tags, path: '/admin/ecommerce/categories' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'eCommerce', icon: Activity, path: '/admin/ecommerce/tracking' },
                { label: 'Analytics', icon: BarChart3, path: '/admin/website/dashboards' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/website/settings' },
                { label: 'Websites', icon: Globe, path: '/admin/website/websites' },
                { label: 'Payment Providers', icon: CreditCard, path: '/admin/ecommerce/payment-providers' },
                { label: 'Shipping Methods', icon: Truck, path: '/admin/ecommerce/shipping' },
            ]
        }
    ],
    documents: [
        {
            title: 'Documents',
            items: [
                { label: 'Workspace', icon: FolderOpen, path: '/admin/documents' },
                { label: 'Folders', icon: Building2, path: '/admin/documents/workspaces' },
                { label: 'Tags', icon: Tags, path: '/admin/documents/tags' },
                { label: 'Configuration', icon: Settings, path: '/admin/documents/settings' },
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
    planning: [
        {
            title: 'Schedule',
            items: [
                { label: 'My Planning', icon: Clock, path: '/admin/planning/my-planning' },
                { label: 'Open Shifts', icon: Users, path: '/admin/planning/open-shifts' },
                { label: 'By Employee', icon: Users, path: '/admin/planning/schedule/employee' },
                { label: 'By Role', icon: Key, path: '/admin/planning/schedule/role' },
                { label: 'By Project', icon: FolderKanban, path: '/admin/planning/schedule/project' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Planning Analysis', icon: Activity, path: '/admin/planning/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/planning/settings' },
                { label: 'Roles', icon: ShieldCheck, path: '/admin/planning/roles' },
            ]
        }
    ],
    maintenance: [
        {
            title: 'Maintenance',
            items: [
                { label: 'Equipments', icon: Monitor, path: '/admin/maintenance/assets' },
                { label: 'Maintenance Requests', icon: Wrench, path: '/admin/maintenance/requests' },
                { label: 'Reporting', icon: Activity, path: '/admin/maintenance/depreciation' },
                { label: 'Configuration', icon: Settings, path: '/admin/maintenance/settings' },
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

    hr_attendance: [
        {
            title: 'Attendances',
            items: [
                { label: 'Attendances', icon: UserCheck, path: '/admin/hr_attendance' },
                { label: 'Kiosk Mode', icon: Monitor, path: '/admin/hr_attendance/kiosk' }
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Reporting', icon: Activity, path: '/admin/hr_attendance/reports' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/hr_attendance/settings' }
            ]
        }
    ],
    HrHolidays: [
        {
            title: 'My Time Off',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/hr_holidays' },
                { label: 'My Time Off', icon: Clock, path: '/admin/hr_holidays/requests' },
                { label: 'My Allocations', icon: Plus, path: '/admin/hr_holidays/my-allocations' }
            ]
        },
        {
            title: 'Management',
            items: [
                { label: 'Time Off', icon: CheckSquare, path: '/admin/hr_holidays/approvals' },
                { label: 'Allocations', icon: Plus, path: '/admin/hr_holidays/allocations' }
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'by Employee', icon: Users, path: '/admin/hr_holidays/reports/employee' },
                { label: 'by Type', icon: Tag, path: '/admin/hr_holidays/reports/type' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/hr_holidays/settings' },
                { label: 'Time Off Types', icon: Tag, path: '/admin/hr_holidays/types' },
                { label: 'Accrual Plans', icon: Activity, path: '/admin/hr_holidays/accrual-plans' },
                { label: 'Public Holidays', icon: Calendar, path: '/admin/hr_holidays/public-holidays' }
            ]
        }
    ],
    recruitment: [
        {
            title: 'Applications',
            items: [
                { label: 'Job Positions', icon: FolderKanban, path: '/admin/recruitment' },
                { label: 'All Applications', icon: Users, path: '/admin/recruitment/applications' }
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Recruitment Analysis', icon: Activity, path: '/admin/recruitment/reports' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/recruitment/settings' },
                { label: 'Job Positions', icon: FolderKanban, path: '/admin/recruitment/jobs' },
                { label: 'Refuse Reasons', icon: AlertCircle, path: '/admin/recruitment/refuse-reasons' },
                { label: 'Departments', icon: Layers, path: '/admin/recruitment/departments' },
                { label: 'Activity Types', icon: Activity, path: '/admin/recruitment/activity-types' }
            ]
        }
    ],
    payroll: [
        {
            title: 'Payslips',
            items: [
                { label: 'To Pay', icon: Clock, path: '/admin/payroll/to-pay' },
                { label: 'All Payslips', icon: DollarSign, path: '/admin/payroll' },
                { label: 'Batches', icon: Layers, path: '/admin/payroll/batches' }
            ]
        },
        {
            title: 'Work Entries',
            items: [
                { label: 'Work Entries', icon: Calendar, path: '/admin/payroll/work-entries' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Payroll', icon: BarChart3, path: '/admin/payroll/reports' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/payroll/settings' },
                { label: 'Salary Rules', icon: FileText, path: '/admin/payroll/rules' },
                { label: 'Salary Structures', icon: Database, path: '/admin/payroll/structures' }
            ]
        }
    ],
    appraisals: [
        {
            title: 'Appraisals',
            items: [
                { label: 'Appraisals', icon: Award, path: '/admin/appraisals' }
            ]
        },
        {
            title: 'Goals',
            items: [
                { label: 'Goals', icon: Target, path: '/admin/appraisals/goals' }
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Appraisal Analysis', icon: BarChart3, path: '/admin/appraisals/reports' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/appraisals/settings' },
                { label: 'Evaluation Scale', icon: Activity, path: '/admin/appraisals/scale' },
                { label: '360 Feedback', icon: Users, path: '/admin/appraisals/feedback-templates' }
            ]
        }
    ],
    referrals: [
        {
            title: 'Dashboard',
            items: [
                { label: 'Referral Program', icon: Share2, path: '/admin/referrals' }
            ]
        }
    ],
    pos: [
        {
            title: 'Dashboard',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/pos' },
            ]
        },
        {
            title: 'Orders',
            items: [
                { label: 'Orders', icon: ShoppingBag, path: '/admin/pos/orders' },
                { label: 'Sessions', icon: Clock, path: '/admin/pos/sessions' },
                { label: 'Payments', icon: CreditCard, path: '/admin/pos/payments' },
                { label: 'Customers', icon: Users, path: '/admin/pos/customers' },
            ]
        },
        {
            title: 'Products',
            items: [
                { label: 'Products', icon: Box, path: '/admin/pos/products' },
                { label: 'Product Variants', icon: Layers, path: '/admin/pos/product-variants' },
                { label: 'Pricelists', icon: DollarSign, path: '/admin/pos/pricelists' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Orders', icon: ShoppingBag, path: '/admin/pos/reports' },
                { label: 'Sales Details', icon: Activity, path: '/admin/pos/sales-details' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/pos/settings' },
                { label: 'Point of Sale', icon: Monitor, path: '/admin/pos/configs' },
                { label: 'Payment Methods', icon: CreditCard, path: '/admin/pos/payment-methods' },
                { label: 'Coins/Bills', icon: DollarSign, path: '/admin/pos/coins' },
            ]
        }
    ],
    timesheets: [
        {
            title: 'Timesheets',
            items: [
                { label: 'My Timesheets', icon: Clock, path: '/admin/timesheets' },
                { label: 'All Timesheets', icon: Users, path: '/admin/timesheets/all' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'By Employee', icon: Users, path: '/admin/timesheets/reports/employee' },
                { label: 'By Project', icon: FolderKanban, path: '/admin/timesheets/reports/project' },
                { label: 'By Task', icon: Layout, path: '/admin/timesheets/reports/task' },
                { label: 'By Billing Type', icon: DollarSign, path: '/admin/timesheets/reports/billing' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/timesheets/settings' },
            ]
        }
    ],
    helpdesk: [
        {
            title: 'Helpdesk',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/helpdesk' },
                { label: 'Tickets', icon: LifeBuoy, path: '/admin/helpdesk/tickets' },
                { label: 'My Tickets', icon: Activity, path: '/admin/helpdesk/my-tickets' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Tickets Analysis', icon: BarChart3, path: '/admin/helpdesk/reports/tickets' },
                { label: 'SLA Status Analysis', icon: ShieldCheck, path: '/admin/helpdesk/reports/sla' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/helpdesk/settings' },
                { label: 'Helpdesk Teams', icon: Users, path: '/admin/helpdesk/teams' },
                { label: 'SLA Policies', icon: ShieldCheck, path: '/admin/helpdesk/sla' },
                { label: 'Stages', icon: Layers, path: '/admin/helpdesk/stages' },
                { label: 'Ticket Types', icon: Tag, path: '/admin/helpdesk/types' },
                { label: 'Tags', icon: Tag, path: '/admin/helpdesk/tags' },
            ]
        }
    ],
    appointments: [
        {
            title: 'Appointments',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/appointments' },
                { label: 'Online Appointments', icon: Calendar, path: '/admin/appointments/online' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Appointments Analysis', icon: BarChart3, path: '/admin/appointments/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/appointments/settings' },
                { label: 'Appointment Types', icon: Calendar, path: '/admin/appointments/types' },
            ]
        }
    ],
    field_service: [
        {
            title: 'My Tasks',
            items: [
                { label: 'Map', icon: MapPin, path: '/admin/field-service/my-tasks/map' },
                { label: 'Schedule', icon: Calendar, path: '/admin/field-service/my-tasks/schedule' },
            ]
        },
        {
            title: 'All Tasks',
            items: [
                { label: 'Map', icon: MapPin, path: '/admin/field-service/all-tasks/map' },
                { label: 'Schedule', icon: Calendar, path: '/admin/field-service/all-tasks/schedule' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Tasks Analysis', icon: BarChart3, path: '/admin/field-service/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/field-service/settings' },
                { label: 'Stages', icon: Layers, path: '/admin/field-service/stages' },
                { label: 'Tags', icon: Tag, path: '/admin/field-service/tags' },
            ]
        }
    ],
    mrp: [
        {
            title: 'Manufacturing',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/mrp' },
            ]
        },
        {
            title: 'Operations',
            items: [
                { label: 'Manufacturing Orders', icon: Wrench, path: '/admin/mrp/orders' },
                { label: 'Work Orders', icon: Settings, path: '/admin/mrp/work-orders' },
                { label: 'Scrap', icon: Trash2, path: '/admin/mrp/scrap' },
            ]
        },
        {
            title: 'Products',
            items: [
                { label: 'Products', icon: Box, path: '/admin/mrp/products' },
                { label: 'Product Variants', icon: Layers, path: '/admin/mrp/product-variants' },
                { label: 'Bills of Materials', icon: FileText, path: '/admin/mrp/bom' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Manufacturing Orders', icon: BarChart3, path: '/admin/mrp/reports/orders' },
                { label: 'Work Orders', icon: Activity, path: '/admin/mrp/reports/work-orders' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/mrp/settings' },
                { label: 'Work Centers', icon: Building2, path: '/admin/mrp/work-centers' },
                { label: 'Operations', icon: Activity, path: '/admin/mrp/operations' },
            ]
        }
    ],

    fleet: [
        {
            title: 'Fleet',
            items: [
                { label: 'Vehicles', icon: Truck, path: '/admin/fleet' },
                { label: 'Odometers', icon: Clock, path: '/admin/fleet/odometer' }
            ]
        },
        {
            title: 'Contracts',
            items: [
                { label: 'Contracts', icon: FileText, path: '/admin/fleet/contracts' }
            ]
        },
        {
            title: 'Services',
            items: [
                { label: 'Services', icon: Wrench, path: '/admin/fleet/services' }
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Costs Analysis', icon: BarChart3, path: '/admin/fleet/reports' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/fleet/settings' },
                { label: 'Manufacturers', icon: Building2, path: '/admin/fleet/manufacturers' },
                { label: 'Vehicle Models', icon: Truck, path: '/admin/fleet/models' }
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
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Invoice Analysis', icon: BarChart3, path: '/admin/invoicing/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/invoicing/settings' },
                { label: 'Payment Providers', icon: CreditCard, path: '/admin/invoicing/payment-providers' },
            ]
        }
    ],
    expenses: [
        {
            title: 'My Expenses',
            items: [
                { label: 'My Expenses', icon: CreditCard, path: '/admin/expenses' },
                { label: 'My Reports', icon: FileText, path: '/admin/expenses/my-reports' },
            ]
        },
        {
            title: 'Expense Reports',
            items: [
                { label: 'To Approve', icon: CheckSquare, path: '/admin/expenses/to-approve' },
                { label: 'To Post', icon: FileText, path: '/admin/expenses/to-post' },
                { label: 'To Pay', icon: DollarSign, path: '/admin/expenses/to-pay' },
                { label: 'All Reports', icon: FileText, path: '/admin/expenses/reports' }
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Expenses Analysis', icon: BarChart3, path: '/admin/expenses/analysis' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/expenses/settings' },
                { label: 'Expense Categories', icon: Tags, path: '/admin/expenses/categories' }
            ]
        }
    ],
    
    // Placeholder menus for newly injected modules
    rental: [
        {
            title: 'Rental',
            items: [
                { label: 'Orders', icon: ShoppingBag, path: '/admin/rental' },
                { label: 'Schedule', icon: Calendar, path: '/admin/rental/schedule' },
                { label: 'Customers', icon: Users, path: '/admin/rental/customers' },
            ]
        },
        {
            title: 'Products',
            items: [
                { label: 'Products', icon: Box, path: '/admin/rental/products' },
                { label: 'Product Variants', icon: Layers, path: '/admin/rental/product-variants' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Rental', icon: BarChart3, path: '/admin/rental/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/rental/settings' },
                { label: 'Rental Delays', icon: Clock, path: '/admin/rental/delays' },
            ]
        }
    ],
    spreadsheet: [
        {
            title: 'Spreadsheet',
            items: [
                { label: 'Dashboards', icon: LayoutDashboard, path: '/admin/spreadsheet' },
                { label: 'Documents', icon: FileText, path: '/admin/spreadsheet/documents' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/spreadsheet/settings' },
            ]
        }
    ],
    quality_control: [
        {
            title: 'Quality',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/quality' },
            ]
        },
        {
            title: 'Quality Control',
            items: [
                { label: 'Control Points', icon: Settings, path: '/admin/quality_control/control-points' },
                { label: 'Quality Checks', icon: CheckSquare, path: '/admin/quality_control/checks' },
                { label: 'Quality Alerts', icon: ShieldCheck, path: '/admin/quality_control/alerts' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/quality_control/settings' },
                { label: 'Quality Teams', icon: Users, path: '/admin/quality_control/teams' },
            ]
        }
    ],
    mrp_plm: [
        {
            title: 'PLM',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/plm' },
            ]
        },
        {
            title: 'Changes',
            items: [
                { label: 'Engineering Change Orders', icon: Activity, path: '/admin/mrp_plm/ecos' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/mrp_plm/settings' },
                { label: 'ECO Types', icon: Layers, path: '/admin/mrp_plm/eco-types' },
            ]
        }
    ],
    appraisals: [
        {
            title: 'Appraisals',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/appraisals' },
                { label: 'Appraisals', icon: FileText, path: '/admin/appraisals/list' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Analytics', icon: BarChart3, path: '/admin/appraisals/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/appraisals/settings' },
                { label: 'Evaluation Templates', icon: Layers, path: '/admin/appraisals/templates' },
            ]
        }
    ],
    referrals: [
        {
            title: 'Referrals',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/referrals' },
                { label: 'Ongoing Referrals', icon: Users, path: '/admin/referrals/ongoing' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Analytics', icon: BarChart3, path: '/admin/referrals/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/referrals/settings' },
                { label: 'Rewards', icon: Award, path: '/admin/referrals/rewards' },
            ]
        }
    ],
    social: [
        {
            title: 'Social Marketing',
            items: [
                { label: 'Feed', icon: LayoutDashboard, path: '/admin/social' },
                { label: 'Posts', icon: Share2, path: '/admin/social/posts' },
                { label: 'Campaigns', icon: Megaphone, path: '/admin/social/campaigns' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/social/settings' },
                { label: 'Social Accounts', icon: Users, path: '/admin/social/accounts' },
            ]
        }
    ],
    sms: [
        {
            title: 'SMS Marketing',
            items: [
                { label: 'SMS Mailings', icon: Smartphone, path: '/admin/sms/mailings' },
                { label: 'Contacts', icon: Users, path: '/admin/sms/contacts' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Analytics', icon: BarChart3, path: '/admin/sms/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/sms/settings' },
            ]
        }
    ],
    events: [
        {
            title: 'Events',
            items: [
                { label: 'Events', icon: Calendar, path: '/admin/events' },
                { label: 'Attendees', icon: Users, path: '/admin/events/attendees' },
                { label: 'Tracks', icon: MapPin, path: '/admin/events/tracks' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Analytics', icon: BarChart3, path: '/admin/events/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/events/settings' },
                { label: 'Event Templates', icon: FileText, path: '/admin/events/templates' },
            ]
        }
    ],
    surveys: [
        {
            title: 'Surveys',
            items: [
                { label: 'Surveys', icon: FileQuestion, path: '/admin/surveys' },
                { label: 'Participations', icon: Users, path: '/admin/surveys/participations' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/surveys/settings' },
            ]
        }
    ],
    elearning: [
        {
            title: 'Courses',
            items: [
                { label: 'Courses', icon: Book, path: '/admin/elearning/courses' },
                { label: 'Contents', icon: FileText, path: '/admin/elearning/contents' },
                { label: 'Forums', icon: MessageSquare, path: '/admin/elearning/forums' },
                { label: 'Certifications', icon: Award, path: '/admin/elearning/certifications' },
                { label: 'Reviews', icon: Star, path: '/admin/elearning/reviews' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Courses', icon: BookOpen, path: '/admin/elearning/reports/courses' },
                { label: 'Contents', icon: FileText, path: '/admin/elearning/reports/contents' },
                { label: 'Revenues', icon: DollarSign, path: '/admin/elearning/reports/revenues' },
                { label: 'Certifications', icon: Award, path: '/admin/elearning/reports/certifications' },
                { label: 'Reviews', icon: Star, path: '/admin/elearning/reports/reviews' },
                { label: 'Forums', icon: MessageSquare, path: '/admin/elearning/reports/forums' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/elearning/settings' },
                { label: 'Course Groups', icon: Layers, path: '/admin/elearning/course-groups' },
                { label: 'Content Tags', icon: Tags, path: '/admin/elearning/content-tags' },
            ]
        }
    ],
    livechat: [
        {
            title: 'Live Chat',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/livechat' },
                { label: 'Visitors', icon: Users, path: '/admin/livechat/visitors' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/livechat/settings' },
                { label: 'Channels', icon: MessageCircle, path: '/admin/livechat/channels' },
            ]
        }
    ],
    knowledge: [
        {
            title: 'Knowledge',
            items: [
                { label: 'Articles', icon: FileText, path: '/admin/knowledge' },
                { label: 'Workspaces', icon: Layers, path: '/admin/knowledge/workspaces' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/knowledge/settings' },
                { label: 'Tags', icon: Tag, path: '/admin/knowledge/tags' },
            ]
        }
    ],
    whatsapp: [
        {
            title: 'WhatsApp',
            items: [
                { label: 'Chats', icon: MessageCircle, path: '/admin/whatsapp' },
                { label: 'Templates', icon: FileText, path: '/admin/whatsapp/templates' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/whatsapp/settings' },
                { label: 'Accounts', icon: Users, path: '/admin/whatsapp/accounts' },
            ]
        }
    ],
    payroll: [
        {
            title: 'Payroll',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/payroll' },
                { label: 'Payslips', icon: FileText, path: '/admin/payroll/payslips' },
                { label: 'Contracts', icon: Layers, path: '/admin/payroll/contracts' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/payroll/settings' },
                { label: 'Salary Rules', icon: CheckSquare, path: '/admin/payroll/rules' },
            ]
        }
    ],
    discuss: [
        {
            title: 'Discuss',
            items: [
                { label: 'Inbox', icon: MessageSquare, path: '/admin/discuss' },
                { label: 'Channels', icon: MessageCircle, path: '/admin/discuss/channels' },
                { label: 'Direct Messages', icon: Users, path: '/admin/discuss/dm' },
            ]
        }
    ],
    blog: [
        {
            title: 'Blog',
            items: [
                { label: 'Posts', icon: BookOpen, path: '/admin/blog' },
                { label: 'Tags', icon: Tag, path: '/admin/blog/tags' },
                { label: 'Blogs', icon: FolderOpen, path: '/admin/blog/categories' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/blog/settings' },
            ]
        }
    ],
    calendar: [
        {
            title: 'Calendar',
            items: [
                { label: 'Meetings', icon: Calendar, path: '/admin/calendar' },
            ]
        }
    ],
    portal: [
        {
            title: 'Client Portal',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/portal' },
                { label: 'Forum', icon: MessageSquare, path: '/admin/portal/forum' },
            ]
        }
    ]
};
