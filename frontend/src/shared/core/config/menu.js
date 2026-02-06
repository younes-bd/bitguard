import {
    LayoutDashboard, Users, ShieldCheck, Building2,
    AlertCircle, FileText, ShoppingBag, Server,
    Layers, Database, Key, PieChart
} from 'lucide-react';

// Main Admin Apps (Clicking them goes to their Dashboard)
export const adminMenu = [
    // Overview
    { label: 'Overview', icon: null, path: null }, // Header
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },

    // Core Business Modules
    { label: 'Business Modules', icon: null, path: null }, // Header
    { label: 'Clients & CRM', icon: Building2, path: '/admin/crm' },
    { label: 'ERP & Finance', icon: PieChart, path: '/admin/erp' },
    { label: 'Store Management', icon: ShoppingBag, path: '/admin/store' },

    // Security & Infrastructure
    { label: 'Platform & Security', icon: null, path: null }, // Header
    { label: 'Security (SOC)', icon: ShieldCheck, path: '/admin/security' },
    { label: 'Access & Identity (IAM)', icon: Key, path: '/admin/iam' },

    // System Administration
    { label: 'System Admin', icon: null, path: null }, // Header
    { label: 'User Management', icon: Users, path: '/admin/users' },
    { label: 'System Logs', icon: AlertCircle, path: '/admin/logs' },
    { label: 'Platform Settings', icon: Server, path: '/admin/settings' }
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
            ]
        }
    ],
    store: [
        {
            title: 'Store',
            items: [
                { label: 'Product Catalog', icon: LayoutDashboard, path: '/store' },
                { label: 'My Products', icon: Layers, path: '/store/products' }, // Feature pending
                { label: 'Orders', icon: FileText, path: '/store/orders' },     // Feature pending
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
            ]
        }
    ]
};
