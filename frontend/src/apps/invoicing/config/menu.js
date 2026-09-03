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


export const invoicingManifest = {
    techName: 'invoicing',
    displayName: 'Invoicing',
    commandCenterSection: 'Finance',
    commandCenterOrder: 2,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const invoicingMenu = [
        {
            title: 'Invoicing',
            items: [
                { label: 'Invoices', icon: FileText, path: '/admin/invoicing/invoices' },
                { label: 'Credit Notes', icon: FileText, path: '/admin/invoicing/credit-notes' },
                { label: 'Payments', icon: DollarSign, path: '/admin/invoicing/payments' },
                { label: 'Customers', icon: Users, path: '/admin/invoicing/customers' },
                { label: 'Products', icon: Box, path: '/admin/invoicing/products' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Invoice Analysis', icon: BarChart3, path: '/admin/invoicing/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/invoicing/settings' },
                { label: 'Payment Providers', icon: CreditCard, path: '/admin/invoicing/payment-providers' },
            ]
        }
    ];
