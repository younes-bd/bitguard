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


export const mrpManifest = {
    techName: 'mrp',
    displayName: 'Manufacturing',
    commandCenterSection: 'Inventory & MRP',
    commandCenterOrder: 3,
    hasSettings: true,
    settingsUrl: '/admin/settings/mrp',
    settingsDesc: 'Configure settings',
};

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
                { label: 'Manufacturing Orders', icon: Wrench, path: '/admin/mrp/orders' },
                { label: 'Work Orders', icon: Settings, path: '/admin/mrp/work-orders' },
                { label: 'Scrap', icon: Trash2, path: '/admin/mrp/scrap' },
            ]
        },
        {
            title: 'Products',
            items: [
                { label: 'Products', icon: Box, path: '/admin/mrp/products' },
                { label: 'Product Variants', icon: Layers, path: '/admin/mrp/product-variants' },
                { label: 'Bills of Materials', icon: FileText, path: '/admin/mrp/bom' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Manufacturing Orders', icon: BarChart3, path: '/admin/mrp/reports/orders' },
                { label: 'Work Orders', icon: Activity, path: '/admin/mrp/reports/work-orders' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/mrp/settings' },
                { label: 'Work Centers', icon: Building2, path: '/admin/mrp/work-centers' },
                { label: 'Operations', icon: Activity, path: '/admin/mrp/operations' },
            ]
        }
    ];
