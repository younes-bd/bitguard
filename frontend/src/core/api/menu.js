import {
    LayoutDashboard, Users, ShieldCheck, Building2,
    AlertCircle, FileText, ShoppingBag, Server,
    Layers, Database, Key, PieChart,
    Paintbrush, Tags, Box, ShoppingCart, Truck, Activity, Puzzle, RefreshCw, Settings,
    Megaphone, LifeBuoy, Bell, CreditCard, BarChart3, FolderKanban, TrendingUp, BookOpen,
    Monitor, Cpu, Wrench, DollarSign, Tag, Globe, Plus, FolderOpen, CheckSquare, GitBranch,
    Award, Download
} from 'lucide-react';

// Main Admin Suite
export const adminMenu = [
    // 1. Command Center
    { label: 'Command Center', icon: null, path: null },
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Notifications', icon: Bell, path: '/admin/notifications' },

    // 2. Revenue & Growth
    { label: 'Revenue & Growth', icon: null, path: null },
    { label: 'Sales & CRM', icon: Users, path: '/admin/crm', permissions: ['view_client'] },
    { label: 'Service Catalog', icon: ShoppingBag, path: '/admin/store', permissions: ['view_product'] },
    { label: 'Billing & Subscriptions', icon: CreditCard, path: '/admin/billing', permissions: ['view_plan'] },
    { label: 'Marketing', icon: Megaphone, path: '/admin/marketing', permissions: ['view_campaign'] },

    // 3. Service Operations
    { label: 'Service Operations', icon: null, path: null },
    { label: 'Service Desk', icon: LifeBuoy, path: '/admin/support', permissions: ['view_ticket'] },
    { label: 'Contracts & SLAs', icon: FileText, path: '/admin/contracts', permissions: ['view_servicecontract'] },
    { label: 'Project Management', icon: FolderKanban, path: '/admin/projects', permissions: ['view_internalproject'] },
    { label: 'Change Management', icon: GitBranch, path: '/admin/itsm', permissions: ['view_changerequest'] },
    { label: 'IT Asset Management', icon: Monitor, path: '/admin/itam', permissions: ['view_managedendpoint'] },
    { label: 'Procurement', icon: Layers, path: '/admin/scm', permissions: ['view_vendor'] },

    // 4. People & Governance
    { label: 'People & Governance', icon: null, path: null },
    { label: 'People & HR', icon: Building2, path: '/admin/hrm', permissions: ['view_employeeprofile'] },
    { label: 'Approval Center', icon: CheckSquare, path: '/admin/approvals', permissions: ['view_approval'] },
    { label: 'Document Management', icon: FolderOpen, path: '/admin/documents', permissions: ['view_document'] },

    // 5. Finance
    { label: 'Finance', icon: null, path: null },
    { label: 'Finance & Billing', icon: PieChart, path: '/admin/erp', permissions: ['view_internalproject'] },

    // 6. Security & Compliance
    { label: 'Security & Compliance', icon: null, path: null },
    { label: 'SOC (Security)', icon: ShieldCheck, path: '/admin/security', permissions: ['view_incident'] },
    { label: 'Identity & Access', icon: Key, path: '/admin/iam', permissions: ['view_user'] },

    // 7. Intelligence
    { label: 'Intelligence', icon: null, path: null },
    { label: 'Analytics & Reports', icon: BarChart3, path: '/admin/reports', permissions: ['view_dashboard'] },

    // 8. Platform
    { label: 'Platform', icon: null, path: null },
    { label: 'System Admin', icon: Server, path: '/admin/system', permissions: ['view_tenant'] },
    { label: 'Website & CMS', icon: Globe, path: '/admin/cms', permissions: ['view_page'] },
    { label: 'Client Portal', icon: Globe, path: '/portal', permissions: ['view_tenant'] }
];

export const productMenu = {
    contracts: [
        {
            title: 'Contract Management',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/contracts' },
                { label: 'Service Contracts', icon: FileText, path: '/admin/contracts/list' },
                { label: 'Quotes', icon: ShoppingCart, path: '/admin/contracts/quotes' },
                { label: 'SLA Tiers', icon: ShieldCheck, path: '/admin/contracts/sla-tiers' },
                { label: 'SLA Breaches', icon: AlertCircle, path: '/admin/contracts/sla-breaches' },
                { label: 'Settings', icon: Settings, path: '/admin/contracts/settings' },
            ]
        }
    ],
    billing: [
        {
            title: 'Billing',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/billing' },
                { label: 'My Subscription', icon: CreditCard, path: '/admin/billing' },
                { label: 'Plans', icon: Layers, path: '/admin/billing/plans' },
                { label: 'Invoices', icon: FileText, path: '/admin/billing/invoices' },
                { label: 'Settings', icon: Settings, path: '/admin/billing/settings' },
            ]
        }
    ],
    reports: [
        {
            title: 'Analytics & Reports',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/reports' },
                { label: 'Revenue Health', icon: DollarSign, path: '/admin/reports/mrr' },
                { label: 'Revenue', icon: TrendingUp, path: '/admin/reports/revenue' },
                { label: 'CRM & Sales', icon: Users, path: '/admin/reports/crm' },
                { label: 'Support', icon: LifeBuoy, path: '/admin/reports/support' },
                { label: 'Security', icon: ShieldCheck, path: '/admin/reports/security' },
                { label: 'Export', icon: Download, path: '/admin/reports/export' },
            ]
        }
    ],
    system: [
        {
            title: 'Platform Administration',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/system' },
                { label: 'Platform Settings', icon: Settings, path: '/admin/system/settings' },
                { label: 'Users', icon: Users, path: '/admin/iam/users' },
                { label: 'Roles & Permissions', icon: Key, path: '/admin/iam/roles' },
                { label: 'System Logs', icon: Database, path: '/admin/system/logs' },
                { label: 'Audit Trail', icon: FileText, path: '/admin/iam/audit' },
            ]
        }
    ],
    projects: [
        {
            title: 'Project Management',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/projects' },
                { label: 'All Projects', icon: FolderKanban, path: '/admin/projects' },
                { label: 'Kanban Board', icon: Layers, path: '/admin/projects/kanban' },
                { label: 'Reports', icon: BarChart3, path: '/admin/projects/reports' },
            ]
        }
    ],
    crm: [
        {
            title: 'Sales & CRM',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/crm' },
                { label: 'Onboard Client', icon: Plus, path: '/admin/crm/onboarding' },
                { label: 'Clients', icon: Users, path: '/admin/crm/clients' },
                { label: 'Contacts', icon: Users, path: '/admin/crm/contacts' },
                { label: 'Leads', icon: AlertCircle, path: '/admin/crm/leads' },
                { label: 'Deals', icon: Layers, path: '/admin/crm/deals' },
                { label: 'Activities', icon: FileText, path: '/admin/crm/activities' },
                { label: 'Reports', icon: PieChart, path: '/admin/crm/reports' },
                { label: 'Settings', icon: Settings, path: '/admin/crm/settings' },
            ]
        }
    ],
    erp: [
        {
            title: 'Finance & Operations',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/erp' },
                { label: 'Invoices', icon: FileText, path: '/admin/erp/invoices' },
                { label: 'Payments', icon: PieChart, path: '/admin/erp/payments' },
                { label: 'Expenses', icon: Layers, path: '/admin/erp/expenses' },
                { label: 'Reports', icon: PieChart, path: '/admin/erp/reports' },
                { label: 'Settings', icon: Settings, path: '/admin/erp/settings' },
            ]
        }
    ],
    store: [
        {
            title: 'Commerce',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/store/dashboard' },
                { label: 'Service Catalog', icon: Tag, path: '/admin/store/services' },
                { label: 'Categories', icon: Tags, path: '/admin/store/categories' },
                { label: 'Products', icon: Box, path: '/admin/store/products' },
                { label: 'Orders', icon: ShoppingCart, path: '/admin/store/orders' },
                { label: 'Customers', icon: Users, path: '/admin/store/customers' },
                { label: 'Shipping Settings', icon: Truck, path: '/admin/store/shipping' },
                { label: 'Subscriptions', icon: RefreshCw, path: '/admin/store/subscriptions' },
                { label: 'Settings', icon: Settings, path: '/admin/store/settings' },
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
                { label: 'Endpoints', icon: Server, path: '/admin/security/assets' },
                { label: 'Workspaces', icon: Layers, path: '/admin/security/workspaces' },
                { label: 'Cloud Apps', icon: Box, path: '/admin/security/cloud' },
                { label: 'Network Events', icon: Activity, path: '/admin/security/network' },
                { label: 'Remote Sessions', icon: RefreshCw, path: '/admin/security/remote' },
                { label: 'Email Security', icon: FileText, path: '/admin/security/email' },
                { label: 'Threat Intel', icon: Database, path: '/admin/security/intel' },
                { label: 'Log Analysis', icon: PieChart, path: '/admin/security/logs' },
                { label: 'Security Gaps', icon: AlertCircle, path: '/admin/security/gaps' },
            ]
        }
    ],
    scm: [
        {
            title: 'Procurement',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/scm' },
                { label: 'Inventory', icon: Database, path: '/admin/scm/inventory' },
                { label: 'Vendors', icon: Users, path: '/admin/scm/vendors' },
                { label: 'Purchase Orders', icon: ShoppingCart, path: '/admin/scm/purchase-orders' },
                { label: 'Settings', icon: Settings, path: '/admin/scm/settings' },
            ]
        }
    ],
    hrm: [
        {
            title: 'People & HR',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/hrm' },
                { label: 'Employees', icon: Users, path: '/admin/hrm/employees' },
                { label: 'Leave Management', icon: RefreshCw, path: '/admin/hrm/leaves' },
                { label: 'Time Tracking', icon: Activity, path: '/admin/hrm/time' },
                { label: 'Certifications', icon: Award, path: '/admin/hrm/certifications' },
                { label: 'Payroll', icon: DollarSign, path: '/admin/hrm/payroll' },
                { label: 'Settings', icon: Settings, path: '/admin/hrm/settings' },
            ]
        }
    ],
    iam: [
        {
            title: 'Identity & Access',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/iam' },
                { label: 'Users', icon: Users, path: '/admin/iam/users' },
                { label: 'Roles & Permissions', icon: Key, path: '/admin/iam/roles' },
                { label: 'Tenants', icon: Building2, path: '/admin/iam/tenants' },
                { label: 'Audit Logs', icon: FileText, path: '/admin/iam/audit' },
                { label: 'Settings', icon: Settings, path: '/admin/iam/settings' },
            ]
        }
    ],
    support: [
        {
            title: 'Service Desk',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/support' },
                { label: 'Tickets', icon: FileText, path: '/admin/support/tickets' },
                { label: 'Escalations', icon: AlertCircle, path: '/admin/support/escalations' },
                { label: 'SLA Breaches', icon: ShieldCheck, path: '/admin/support/sla-breaches' },
                { label: 'Knowledge Base', icon: BookOpen, path: '/admin/support/knowledge-base' },
                { label: 'Settings', icon: Settings, path: '/admin/support/settings' },
            ]
        }
    ],
    itam: [
        {
            title: 'Asset Management',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/itam' },
                { label: 'All Assets', icon: Monitor, path: '/admin/itam/assets' },
                { label: 'Settings', icon: Settings, path: '/admin/itam/settings' },
            ]
        }
    ],
    marketing: [
        {
            title: 'Marketing Automation',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/marketing' },
                { label: 'Campaigns', icon: Megaphone, path: '/admin/marketing/campaigns' },
                { label: 'Integrations', icon: Puzzle, path: '/admin/marketing/integrations' },
                { label: 'Settings', icon: Settings, path: '/admin/marketing/settings' },
            ]
        }
    ],
    cms: [
        {
            title: 'Website Builder',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/cms' },
                { label: 'All Pages', icon: FileText, path: '/admin/cms' },
                { label: 'Landing Pages', icon: LayoutDashboard, path: '/admin/cms/landing-pages' },
                { label: 'Create New Page', icon: Plus, path: '/admin/cms/pages/new' },
                { label: 'Inquiries', icon: Activity, path: '/admin/cms/inquiries' },
                { label: 'Settings', icon: Settings, path: '/admin/cms/settings' },
            ]
        }
    ],
    // ── Future Enhancement Modules ──
    documents: [
        {
            title: 'Document Management',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/documents' },
                { label: 'All Documents', icon: FolderOpen, path: '/admin/documents' },
                { label: 'Settings', icon: Settings, path: '/admin/documents/settings' },
            ]
        }
    ],
    approvals: [
        {
            title: 'Approval Center',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/approvals' },
                { label: 'Pending', icon: CheckSquare, path: '/admin/approvals' },
                { label: 'Settings', icon: Settings, path: '/admin/approvals/settings' },
            ]
        }
    ],
    itsm: [
        {
            title: 'Change Management',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/itsm' },
                { label: 'Change Requests', icon: GitBranch, path: '/admin/itsm' },
                { label: 'Settings', icon: Settings, path: '/admin/itsm/settings' },
            ]
        }
    ]
};
