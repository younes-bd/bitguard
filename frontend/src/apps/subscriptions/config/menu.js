import {
    Activity, AlertCircle, BarChart3, Bell,
    Box, CreditCard, FileText, Layers,
    PieChart, Settings, Users
} from 'lucide-react';

export const subscriptionsMenu = [
        {
            title: 'Subscriptions',
            items: [
                { label: 'Subscriptions', icon: CreditCard, path: '/admin/subscriptions' },
                { label: 'Subscriptions to Invoice', icon: FileText, path: '/admin/subscriptions/to-invoice' },
                { label: 'Customers', icon: Users, path: '/admin/subscriptions/customers' },
            ]
        },
        {
            title: 'Products',
            items: [
                { label: 'Products', icon: Box, path: '/admin/subscriptions/products' },
                { label: 'Subscription Templates', icon: Layers, path: '/admin/subscriptions/plans' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Subscriptions', icon: BarChart3, path: '/admin/subscriptions/reports' },
                { label: 'Retention', icon: Activity, path: '/admin/subscriptions/retention' },
                { label: 'Revenue KPIs', icon: PieChart, path: '/admin/subscriptions/kpis' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/subscriptions/settings' },
                { label: 'Subscription Templates', icon: Layers, path: '/admin/subscriptions/plans' },
                { label: 'Close Reasons', icon: AlertCircle, path: '/admin/subscriptions/close-reasons' },
                { label: 'Alerts', icon: Bell, path: '/admin/subscriptions/alerts' },
            ]
        }
    ];
