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


export const marketingManifest = {
    techName: 'marketing',
    displayName: 'Email Marketing',
    commandCenterSection: 'Marketing',
    commandCenterOrder: 1,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const marketingMenu = [
        {
            title: 'Marketing Automation',
            items: [
                { label: 'Campaigns', icon: Megaphone, path: '/admin/marketing/campaigns' },
                { label: 'Automations', icon: Zap, path: '/admin/marketing/automations' },
                { label: 'Posts', icon: Share2, path: '/admin/marketing/posts' },
                { label: 'Activities', icon: Activity, path: '/admin/marketing/activities' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Analytics', icon: BarChart3, path: '/admin/marketing/dashboards' },
            ]
        },
        {
            title: 'SMS Marketing',
            items: [
                { label: 'SMS Dashboard', icon: Smartphone, path: '/admin/marketing/sms' },
                { label: 'SMS Mailings', icon: Send, path: '/admin/marketing/sms/mailings' },
                { label: 'SMS Contacts', icon: Users, path: '/admin/marketing/sms/contacts' },
                { label: 'SMS Analytics', icon: BarChart3, path: '/admin/marketing/sms/analytics' },
            ]
        },
        {
            title: 'Email Campaigns',
            items: [
                { label: 'Email Campaigns', icon: Mail, path: '/admin/marketing/mass-mailing' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/marketing/settings' },
            ]
        }
    ];
