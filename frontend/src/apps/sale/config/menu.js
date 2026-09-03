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


export const salesManifest = {
    techName: 'sales',
    displayName: 'Sales',
    commandCenterSection: 'Other',
    commandCenterOrder: 99,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

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
            title: 'Reporting',
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
