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


export const productManifest = {
    techName: 'product',
    displayName: 'Products',
    commandCenterSection: 'Inventory & MRP',
    commandCenterOrder: 1,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

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
            title: 'Reporting',
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
