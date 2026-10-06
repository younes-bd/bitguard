import {
    Activity, Box, DollarSign, FileText,
    Layers, LayoutDashboard, Settings, Users
} from 'lucide-react';

export const procurementMenu = [
        {
            title: 'Orders',
            items: [
                { label: 'Requests for Quotation', icon: LayoutDashboard, path: '/admin/procurement' },
                { label: 'Procurement Orders', icon: FileText, path: '/admin/procurement/orders' },
                { label: 'Vendors', icon: Users, path: '/admin/procurement/vendors' },
            ]
        },
        {
            title: 'Products',
            items: [
                { label: 'Products', icon: Box, path: '/admin/procurement/products' },
                { label: 'Product Variants', icon: Layers, path: '/admin/procurement/product-variants' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Procurement Analysis', icon: Activity, path: '/admin/procurement/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/procurement/settings' },
                { label: 'Vendor Pricelists', icon: DollarSign, path: '/admin/procurement/pricelists' },
            ]
        }
    ];
