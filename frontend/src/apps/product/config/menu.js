import {
    BarChart3, Box, FolderOpen, Layers,
    LayoutDashboard, Settings, Tag
} from 'lucide-react';

export const productMenu = [
        {
            title: 'Products',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/products' },
                { label: 'All Products', icon: Box, path: '/admin/products/list' },
                { label: 'Product Variants', icon: Layers, path: '/admin/products/variants' },
            ]
        },
        {
            title: 'Master Data',
            items: [
                { label: 'Categories', icon: FolderOpen, path: '/admin/products/categories' },
                { label: 'Attributes', icon: Tag, path: '/admin/products/attributes' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Product Analysis', icon: BarChart3, path: '/admin/products/list' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/products/settings' },
            ]
        },
    ];
