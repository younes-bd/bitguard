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


export const ecommerceManifest = {
    techName: 'ecommerce',
    displayName: 'eCommerce',
    commandCenterSection: 'Website',
    commandCenterOrder: 2,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const ecommerceMenu = [
        {
            title: 'eCommerce',
            items: [
                { label: 'Orders', icon: ShoppingCart, path: '/admin/ecommerce/orders' },
                { label: 'Unpaid Orders', icon: CreditCard, path: '/admin/ecommerce/unpaid-orders' },
                { label: 'Abandoned Carts', icon: Trash2, path: '/admin/ecommerce/abandoned-carts' },
                { label: 'Products', icon: Box, path: '/admin/ecommerce/products' },
                { label: 'eCommerce Categories', icon: Tags, path: '/admin/ecommerce/categories' },
                { label: 'Discount & Loyalty', icon: Award, path: '/admin/ecommerce/loyalty' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'eCommerce', icon: Activity, path: '/admin/ecommerce/tracking' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/ecommerce/settings' },
                { label: 'Payment Providers', icon: CreditCard, path: '/admin/ecommerce/payment-providers' },
                { label: 'Shipping Methods', icon: Truck, path: '/admin/ecommerce/shipping' },
            ]
        }
    ];
