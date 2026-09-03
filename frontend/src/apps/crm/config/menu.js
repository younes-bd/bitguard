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


export const crmManifest = {
    techName: 'crm',
    displayName: 'CRM',
    commandCenterSection: 'Sales',
    commandCenterOrder: 2,
    hasSettings: true,
    settingsUrl: '/admin/settings/crm',
    settingsDesc: 'Configure settings',
};

export const crmMenu = [
        {
            title: 'Sales',
            items: [
                { label: 'My Pipeline', icon: Activity, path: '/admin/crm/pipeline' },
                { label: 'My Activities', icon: Calendar, path: '/admin/crm/activities' },
                { label: 'My Quotations', icon: FileText, path: '/admin/crm/quotations' },
            ]
        },
        {
            title: 'Leads',
            items: [
                { label: 'Leads', icon: Users, path: '/admin/crm/leads' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Forecast', icon: TrendingUp, path: '/admin/crm/forecast' },
                { label: 'Pipeline', icon: Activity, path: '/admin/crm/reports' },
                { label: 'Leads', icon: Users, path: '/admin/crm/leads-report' },
                { label: 'Activities', icon: Calendar, path: '/admin/crm/activities-report' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/crm/settings' },
                { label: 'Sales Teams', icon: Users, path: '/admin/crm/teams' },
                { label: 'Lead Mining Requests', icon: Database, path: '/admin/crm/mining' },
                { label: 'Lost Reasons', icon: AlertCircle, path: '/admin/crm/lost-reasons' },
                { label: 'Pipeline', icon: Activity, path: '/admin/crm/pipeline-settings' },
            ]
        }
    ];
