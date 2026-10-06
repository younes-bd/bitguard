import {
    Activity, BarChart3, BookOpen, Box,
    CreditCard, FileText, Globe, Home,
    Layout, LayoutDashboard, MessageCircle, Settings,
    ShoppingCart, Tags, Trash2, Truck
} from 'lucide-react';


export const websiteManifest = {
    techName: 'website',
    displayName: 'Website',
    commandCenterSection: 'Website',
    commandCenterOrder: 1,
    hasSettings: true,
    settingsUrl: '/admin/settings/website',
    settingsDesc: 'Configure settings',
};

export const websiteMenu = [
        {
            title: 'Dashboard',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/website/dashboard' },
            ]
        },
        {
            title: 'Site',
            items: [
                { label: 'Homepage', icon: Home, path: '/', external: true },
                { label: 'Pages', icon: FileText, path: '/admin/website/pages' },
                { label: 'Menus', icon: Layout, path: '/admin/website/menus' },
                { label: 'Blog Posts', icon: BookOpen, path: '/admin/website/blog-posts' },
            ]
        },
        {
            title: 'eCommerce',
            items: [
                { label: 'Orders', icon: ShoppingCart, path: '/admin/website/ecommerce/orders' },
                { label: 'Unpaid Orders', icon: CreditCard, path: '/admin/website/ecommerce/unpaid-orders' },
                { label: 'Abandoned Carts', icon: Trash2, path: '/admin/website/ecommerce/abandoned-carts' },
                { label: 'Products', icon: Box, path: '/admin/website/ecommerce/products' },
                { label: 'eCommerce Categories', icon: Tags, path: '/admin/website/ecommerce/categories' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'eCommerce', icon: Activity, path: '/admin/website/ecommerce/tracking' },
                { label: 'Analytics', icon: BarChart3, path: '/admin/website/dashboards' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/website/settings' },
                { label: 'Websites', icon: Globe, path: '/admin/website/websites' },
                { label: 'Payment Providers', icon: CreditCard, path: '/admin/website/ecommerce/payment-providers' },
                { label: 'Shipping Methods', icon: Truck, path: '/admin/website/ecommerce/shipping' },
                { label: 'Live Chat Channels', icon: MessageCircle, path: '/admin/website/livechat/channels' },
                { label: 'Live Chat Settings', icon: Settings, path: '/admin/website/livechat/settings' },
            ]
        }
    ];
