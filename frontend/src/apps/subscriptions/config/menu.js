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


export const subscriptionsManifest = {
    techName: 'subscriptions',
    displayName: 'Subscriptions',
    commandCenterSection: 'Sales',
    commandCenterOrder: 4,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

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
            title: 'Reporting',
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
