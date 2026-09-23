import {
    LayoutDashboard, Users, ShieldCheck, Building2,
    AlertCircle, FileText, ShoppingBag, Server,
    Layers, Database, Key, PieChart,
    Paintbrush, Tags, Box, ShoppingCart, Truck, Activity, Puzzle, RefreshCw, Settings,
    Megaphone, LifeBuoy, Bell, CreditCard, BarChart3, FolderKanban, TrendingUp, BookOpen,
    Monitor, Cpu, Wrench, DollarSign, Tag, Globe, Plus, FolderOpen, CheckSquare, GitBranch,
    Award, Download, Clock, Repeat, Landmark, FileSpreadsheet, Scale, Image, Inbox,
    UserPlus, TrendingDown, FileCheck, Terminal, Calendar, Edit3, Share2, MessageSquare, Sparkles, PenTool, Palette, Layout, Send, Video, Smartphone, Zap, Printer, User, Trash2, Grid, Home, Target, Compass, MessageCircle, FileQuestion, Book, PhoneCall, CheckCircle, MapPin, Utensils, Leaf, UserCheck, Star, Upload, AtSign, Webhook
} from 'lucide-react';

export const marketingMenu = [
        {
            title: 'Journeys Automation',
            items: [
                { label: 'Campaigns', icon: Megaphone, path: '/admin/journeys/campaigns' },
                { label: 'Automations', icon: Zap, path: '/admin/journeys/automations' },
                { label: 'Posts', icon: Share2, path: '/admin/journeys/posts' },
                { label: 'Activities', icon: Activity, path: '/admin/journeys/activities' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Analytics', icon: BarChart3, path: '/admin/journeys/dashboards' },
            ]
        },
        {
            title: 'SMS Journeys',
            items: [
                { label: 'SMS Dashboard', icon: Smartphone, path: '/admin/journeys/sms' },
                { label: 'SMS Inboxings', icon: Send, path: '/admin/journeys/sms/mailings' },
                { label: 'SMS Contacts', icon: Users, path: '/admin/journeys/sms/contacts' },
                { label: 'SMS Analytics', icon: BarChart3, path: '/admin/journeys/sms/analytics' },
            ]
        },
        {
            title: 'Email Campaigns',
            items: [
                { label: 'Email Campaigns', icon: Inbox, path: '/admin/journeys/mass-mailing' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/journeys/settings' },
            ]
        }
    ];
