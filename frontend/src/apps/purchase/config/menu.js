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


export const purchaseManifest = {
    techName: 'purchase',
    displayName: 'Purchase',
    commandCenterSection: 'Inventory & MRP',
    commandCenterOrder: 4,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const purchaseMenu = [
        {
            title: 'Orders',
            items: [
                { label: 'Requests for Quotation', icon: LayoutDashboard, path: '/admin/purchase' },
                { label: 'Purchase Orders', icon: FileText, path: '/admin/purchase/orders' },
                { label: 'Vendors', icon: Users, path: '/admin/purchase/vendors' },
            ]
        },
        {
            title: 'Products',
            items: [
                { label: 'Products', icon: Box, path: '/admin/purchase/products' },
                { label: 'Product Variants', icon: Layers, path: '/admin/purchase/product-variants' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Purchase Analysis', icon: Activity, path: '/admin/purchase/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/purchase/settings' },
                { label: 'Vendor Pricelists', icon: DollarSign, path: '/admin/purchase/pricelists' },
            ]
        }
    ];
