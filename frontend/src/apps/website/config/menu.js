import {
    LayoutDashboard, Users, ShieldCheck, Building2,
    AlertCircle, FileText, ShoppingBag, Server,
    Layers, Database, Key, PieChart,
    Paintbrush, Tags, Box, ShoppingCart, Truck, Activity, Puzzle, RefreshCw, Settings,
    Megaphone, LifeBuoy, Bell, CreditCard, BarChart3, FolderKanban, TrendingUp, BookOpen,
    Monitor, Cpu, Wrench, DollarSign, Tag, Globe, Plus, FolderOpen, CheckSquare, GitBranch,
    Award, Download, Clock, Repeat, Landmark, FileSpreadsheet, Scale, Image, Mail,
    UserPlus, TrendingDown, FileCheck, Terminal, Calendar, Edit3, Share2, MessageSquare, Sparkles, PenTool, Palette, Layout, Send, Video, Smartphone, Zap, Printer, User, Trash2, Grid, Home, Target, Compass, MessageCircle, FileQuestion, Book, PhoneCall, CheckCircle, MapPin, Utensils, Leaf, UserCheck, Star, Upload, AtSign, Webhook
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
                { label: 'Orders', icon: ShoppingCart, path: '/admin/ecommerce/orders' },
                { label: 'Unpaid Orders', icon: CreditCard, path: '/admin/ecommerce/unpaid-orders' },
                { label: 'Abandoned Carts', icon: Trash2, path: '/admin/ecommerce/abandoned-carts' },
                { label: 'Products', icon: Box, path: '/admin/ecommerce/products' },
                { label: 'eCommerce Categories', icon: Tags, path: '/admin/ecommerce/categories' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'eCommerce', icon: Activity, path: '/admin/ecommerce/tracking' },
                { label: 'Analytics', icon: BarChart3, path: '/admin/website/dashboards' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/website/settings' },
                { label: 'Websites', icon: Globe, path: '/admin/website/websites' },
                { label: 'Payment Providers', icon: CreditCard, path: '/admin/ecommerce/payment-providers' },
                { label: 'Shipping Methods', icon: Truck, path: '/admin/ecommerce/shipping' },
                { label: 'Live Chat Channels', icon: MessageCircle, path: '/admin/website/livechat/channels' },
                { label: 'Live Chat Settings', icon: Settings, path: '/admin/website/livechat/settings' },
            ]
        }
    ];
