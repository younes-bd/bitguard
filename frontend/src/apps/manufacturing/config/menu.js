import {
    Activity, BarChart3, Box, Building2,
    FileText, Layers, LayoutDashboard, Settings,
    Trash2, Wrench
} from 'lucide-react';

export const mrpMenu = [
        {
            title: 'Manufacturing',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/mrp' },
            ]
        },
        {
            title: 'Operations',
            items: [
                { label: 'Manufacturing Orders', icon: Wrench, path: '/admin/manufacturing/orders' },
                { label: 'Work Orders', icon: Settings, path: '/admin/manufacturing/work-orders' },
                { label: 'Scrap', icon: Trash2, path: '/admin/manufacturing/scrap' },
            ]
        },
        {
            title: 'Products',
            items: [
                { label: 'Products', icon: Box, path: '/admin/manufacturing/products' },
                { label: 'Product Variants', icon: Layers, path: '/admin/manufacturing/product-variants' },
                { label: 'Bills of Materials', icon: FileText, path: '/admin/manufacturing/bom' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Manufacturing Orders', icon: BarChart3, path: '/admin/manufacturing/reports/orders' },
                { label: 'Work Orders', icon: Activity, path: '/admin/manufacturing/reports/work-orders' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/manufacturing/settings' },
                { label: 'Work Centers', icon: Building2, path: '/admin/manufacturing/work-centers' },
                { label: 'Operations', icon: Activity, path: '/admin/manufacturing/operations' },
            ]
        }
    ];
