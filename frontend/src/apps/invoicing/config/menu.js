import {
    BarChart3, Box, CreditCard, DollarSign,
    FileText, Settings, Users
} from 'lucide-react';

export const invoicingMenu = [
        {
            title: 'Invoicing',
            items: [
                { label: 'Invoices', icon: FileText, path: '/admin/invoicing/invoices' },
                { label: 'Credit Notes', icon: FileText, path: '/admin/invoicing/credit-notes' },
                { label: 'Payments', icon: DollarSign, path: '/admin/invoicing/payments' },
                { label: 'Customers', icon: Users, path: '/admin/invoicing/customers' },
                { label: 'Products', icon: Box, path: '/admin/invoicing/products' },
            ]
        },
        {
            title: 'Reports',
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
    ];
