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


export const boardManifest = {
    techName: 'board',
    displayName: 'Board',
    commandCenterSection: 'Other',
    commandCenterOrder: 99,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const dashboardsMenu = [
        {
            title: 'Dashboards',
            items: [
                { label: 'Overview', icon: PieChart, path: '/admin/board/analytics' },
                { label: 'Executive Summary', icon: LayoutDashboard, path: '/admin/board/executive' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Revenue Analytics', icon: DollarSign, path: '/admin/board/revenue' },
                { label: 'Finance & P&L', icon: DollarSign, path: '/admin/board/finance' },
                { label: 'Sales Performance', icon: Users, path: '/admin/board/crm' },
                { label: 'Service Desk', icon: LifeBuoy, path: '/admin/board/support' },
                { label: 'Security Posture', icon: ShieldCheck, path: '/admin/board/security' },
                { label: 'People & HR', icon: Users, path: '/admin/board/hrm' },
                { label: 'Projects', icon: FolderKanban, path: '/admin/board/projects' },
                { label: 'MRR Dashboard', icon: TrendingUp, path: '/admin/board/mrr' },
            ]
        },
        {
            title: 'Tools',
            items: [
                { label: 'Export Data', icon: Download, path: '/admin/board/export' },
            ]
        }
    ];
