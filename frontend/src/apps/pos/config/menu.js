import {
    Activity, Box, Clock, CreditCard,
    DollarSign, Layers, LayoutDashboard, Monitor,
    Settings, ShoppingBag, Users
} from 'lucide-react';

export const posMenu = [
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
            title: 'Reports',
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
    ];
