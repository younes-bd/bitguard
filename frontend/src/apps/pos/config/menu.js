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


export const posManifest = {
    techName: 'pos',
    displayName: 'Point of Sale',
    commandCenterSection: 'Sales',
    commandCenterOrder: 3,
    hasSettings: true,
    settingsUrl: '/admin/settings/pos',
    settingsDesc: 'Configure settings',
};

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
            title: 'Reporting',
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
