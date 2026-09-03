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


export const rentalManifest = {
    techName: 'rental',
    displayName: 'Rental',
    commandCenterSection: 'Sales',
    commandCenterOrder: 5,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const rentalMenu = [
        {
            title: 'Rental',
            items: [
                { label: 'Orders', icon: ShoppingBag, path: '/admin/rental' },
                { label: 'Schedule', icon: Calendar, path: '/admin/rental/schedule' },
                { label: 'Customers', icon: Users, path: '/admin/rental/customers' },
            ]
        },
        {
            title: 'Products',
            items: [
                { label: 'Products', icon: Box, path: '/admin/rental/products' },
                { label: 'Product Variants', icon: Layers, path: '/admin/rental/product-variants' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Rental', icon: BarChart3, path: '/admin/rental/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/rental/settings' },
                { label: 'Rental Delays', icon: Clock, path: '/admin/rental/delays' },
            ]
        }
    ];
