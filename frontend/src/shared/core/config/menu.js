import {
    LayoutDashboard, Users, ShieldCheck, Building2,
    AlertCircle, FileText, ShoppingBag, Server,
    Layers, Database, Key, PieChart
} from 'lucide-react';

// Main Admin Suite (The "Hub" - Switching between major modules)
export const adminMenu = [
    // 1. Command Center
    { label: 'Command Center', icon: null, path: null },
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },

    // 2. Business & Revenue
    { label: 'Business & Revenue', icon: null, path: null },
    { label: 'CRM / Sales', icon: Users, path: '/admin/crm', permissions: ['view_client'] },
    { label: 'Commerce', icon: ShoppingBag, path: '/admin/store', permissions: ['view_product'] },

    // 3. Operations & Resources
    { label: 'Operations & Resources', icon: null, path: null },
    { label: 'ERP / Finance', icon: PieChart, path: '/admin/erp', permissions: ['view_internalproject'] },
    { label: 'Supply Chain', icon: Layers, path: '/admin/scm', permissions: ['view_vendor'] },
    { label: 'Human Capital', icon: Building2, path: '/admin/hrm', permissions: ['view_employeeprofile'] },

    // 4. Governance & Security
    { label: 'Governance & Security', icon: null, path: null },
    { label: 'Security Operations', icon: ShieldCheck, path: '/admin/security', permissions: ['view_incident'] },
    { label: 'Identity & Access', icon: Key, path: '/admin/iam', permissions: ['view_user'] },

    // 5. System Core
    { label: 'Platform Core', icon: null, path: null },
    { label: 'System Admin', icon: Server, path: '/admin/system' }
];

export const productMenu = {
    crm: [
        {
            title: 'CRM',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/crm' },
                { label: 'Clients', icon: Users, path: '/admin/crm/clients' },
                { label: 'Leads & Deals', icon: Layers, path: '/admin/crm/leads' },
                { label: 'Tickets', icon: AlertCircle, path: '/admin/crm/tickets' },
                { label: 'Contracts', icon: FileText, path: '/admin/crm/contracts' },
                { label: 'Reports', icon: PieChart, path: '/admin/crm/reports' },
                { label: 'Settings', icon: Server, path: '/admin/crm/settings' },
            ]
        }
    ],
    erp: [
        {
            title: 'ERP',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/erp' },
                { label: 'Projects', icon: Layers, path: '/admin/erp/projects' },
                { label: 'Invoices', icon: FileText, path: '/admin/erp/invoices' },
                { label: 'Revenue', icon: PieChart, path: '/admin/erp/revenue' },
                { label: 'Payroll', icon: Users, path: '/admin/erp/payroll' },
                { label: 'Reports', icon: PieChart, path: '/admin/erp/reports' },
                { label: 'Settings', icon: Server, path: '/admin/erp/settings' },
            ]
        }
    ],
    store: [
        {
            title: 'Commerce',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/store' },
                { label: 'Products', icon: Layers, path: '/admin/store/products' },
                { label: 'Orders', icon: FileText, path: '/admin/store/orders' },
                { label: 'Customers', icon: Users, path: '/admin/store/customers' },
                { label: 'Reports', icon: PieChart, path: '/admin/store/reports' },
                { label: 'Settings', icon: Server, path: '/admin/store/settings' },
            ]
        }
    ],
    security: [ // Renamed from soc
        {
            title: 'Security Operations',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/security' },
                { label: 'Alerts', icon: AlertCircle, path: '/admin/security/alerts' },
                { label: 'Assets', icon: Server, path: '/admin/security/assets' },
                { label: 'Threat Intel', icon: ShieldCheck, path: '/admin/security/threat-intel' },
                { label: 'Vulnerabilities', icon: Database, path: '/admin/security/vulns' },
                { label: 'Reports', icon: PieChart, path: '/admin/security/reports' },
                { label: 'Settings', icon: Server, path: '/admin/security/settings' },
            ]
        }
    ],
    scm: [
        {
            title: 'Supply Chain',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/scm' },
                { label: 'Vendors', icon: Users, path: '/admin/scm/vendors' },
                { label: 'Inventory', icon: Database, path: '/admin/scm/inventory' },
                { label: 'Reports', icon: PieChart, path: '/admin/scm/reports' },
                { label: 'Settings', icon: Server, path: '/admin/scm/settings' },
            ]
        }
    ],
    hrm: [
        {
            title: 'Human Capital',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/hrm' },
                { label: 'Employees', icon: Users, path: '/admin/hrm/employees' },
                { label: 'Payroll', icon: PieChart, path: '/admin/hrm/payroll' },
                { label: 'Reports', icon: PieChart, path: '/admin/hrm/reports' },
                { label: 'Settings', icon: Server, path: '/admin/hrm/settings' },
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
                { label: 'Settings', icon: Server, path: '/admin/iam/settings' },
            ]
        }
    ]
};
