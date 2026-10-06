import {
    Activity, Box, DollarSign, FileText,
    Layers, Settings, ShoppingBag, Truck,
    Users
} from 'lucide-react';

export const salesMenu = [
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
            title: 'Reports',
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
    ];
