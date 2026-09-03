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


export const helpdeskManifest = {
    techName: 'helpdesk',
    displayName: 'Helpdesk',
    commandCenterSection: 'Services',
    commandCenterOrder: 4,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const helpdeskMenu = [
        {
            title: 'Helpdesk',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/helpdesk' },
                { label: 'Tickets', icon: LifeBuoy, path: '/admin/helpdesk/tickets' },
                { label: 'My Tickets', icon: Activity, path: '/admin/helpdesk/my-tickets' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Tickets Analysis', icon: BarChart3, path: '/admin/helpdesk/reports/tickets' },
                { label: 'SLA Status Analysis', icon: ShieldCheck, path: '/admin/helpdesk/reports/sla' },
                { label: 'Live Chat', icon: MessageCircle, path: '/admin/helpdesk/livechat' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/helpdesk/settings' },
                { label: 'Helpdesk Teams', icon: Users, path: '/admin/helpdesk/teams' },
                { label: 'SLA Policies', icon: ShieldCheck, path: '/admin/helpdesk/sla' },
                { label: 'Stages', icon: Layers, path: '/admin/helpdesk/stages' },
                { label: 'Ticket Types', icon: Tag, path: '/admin/helpdesk/types' },
                { label: 'Tags', icon: Tag, path: '/admin/helpdesk/tags' },
                { label: 'Visitors', icon: Compass, path: '/admin/helpdesk/livechat/visitors' },
            ]
        }
    ];
