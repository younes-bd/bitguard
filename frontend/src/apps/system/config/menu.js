import {
    LayoutDashboard, Users, ShieldCheck, Building2,
    AlertCircle, FileText, ShoppingBag, Server,
    Layers, Database, Key, PieChart,
    Paintbrush, Tags, Box, ShoppingCart, Truck, Activity, Puzzle, RefreshCw, Settings,
    Megaphone, LifeBuoy, Bell, CreditCard, BarChart3, FolderKanban, TrendingUp, BookOpen,
    Monitor, Cpu, Wrench, DollarSign, Tag, Globe, Plus, FolderOpen, CheckSquare, GitBranch,
    Award, Download, Clock, Repeat, Landmark, FileSpreadsheet, Scale, Image, Mail,
    UserPlus, TrendingDown, FileCheck, Terminal, Calendar, Edit3, Share2, MessageSquare, Sparkles, PenTool, Palette, Layout, Send, Video, Smartphone, Zap, Printer, User, Trash2, Grid, Home, Target, Compass, MessageCircle, FileQuestion, Book, PhoneCall, CheckCircle, MapPin, Utensils, Leaf, UserCheck, Star, Upload, AtSign, Webhook, Bot
} from 'lucide-react';


export const settingsManifest = {
    techName: 'settings',
    displayName: 'Settings',
    commandCenterSection: 'Administration',
    commandCenterOrder: 99,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const getSettingsMenu = (settingsAppEntries = []) => [
        {
            title: 'General Settings',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/settings' },
                { label: 'General Settings', icon: Settings, path: '/admin/settings/general' },
                { label: 'Notifications', icon: Bell, path: '/admin/settings/notifications' },
                { label: 'Payments', icon: CreditCard, path: '/admin/settings/payment' },
                { label: 'Integrations', icon: Webhook, path: '/admin/settings/integrations' },
                { label: 'Smart Automations', icon: Zap, path: '/admin/settings/automations', permissions: ['is_admin'] },
            ]
        },
        {
            title: 'Users & Companies',
            items: [
                { label: 'Users', icon: Users, path: '/admin/settings/users' },
                { label: 'Companies', icon: Building2, path: '/admin/settings/companies' },
                { label: 'User Groups', icon: ShieldCheck, path: '/admin/settings/groups' },
                { label: 'Access Rights', icon: Key, path: '/admin/settings/access-rights' },
                { label: 'Record Rules', icon: Database, path: '/admin/settings/record-rules' },
                { label: 'Security Policy', icon: ShieldCheck, path: '/admin/settings/security-policy' },
            ]
        },
        {
            title: 'Translations',
            items: [
                { label: 'Languages', icon: Globe, path: '/admin/settings/languages' },
                { label: 'Export Translations', icon: Upload, path: '/admin/settings/translations-export' },
                { label: 'Import Translations', icon: Download, path: '/admin/settings/translations-import' },
            ]
        },
        {
            title: 'Email',
            items: [
                { label: 'Outgoing Mail Servers', icon: Send, path: '/admin/settings/outgoing-mail-servers' },
                { label: 'Incoming Mail Servers', icon: Mail, path: '/admin/settings/incoming-mail-servers' },
                { label: 'Email Templates', icon: FileText, path: '/admin/settings/email-templates' },
                { label: 'Mail Aliases', icon: AtSign, path: '/admin/settings/mail-aliases' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Reports', icon: FileText, path: '/admin/settings/reports' },
                { label: 'Report Tags', icon: Tag, path: '/admin/settings/report-tags' },
                { label: 'Print Formats', icon: FileText, path: '/admin/settings/print-formats' },
            ]
        },
        {
            title: 'Technical',
            items: [
                { label: 'Scheduled Actions', icon: Clock, path: '/admin/settings/scheduled-actions' },
                { label: 'Automated Actions', icon: Terminal, path: '/admin/settings/automated-actions' },
                { label: 'Sequences', icon: Layers, path: '/admin/settings/sequences' },
                { label: 'Menu Sequences', icon: Layout, path: '/admin/settings/menu-sequences' },
                { label: 'Audit Logs', icon: ShieldCheck, path: '/admin/settings/logs' },
                { label: 'Server Logs', icon: Terminal, path: '/admin/settings/server-logs' },
                { label: 'Webhooks', icon: Webhook, path: '/admin/settings/webhooks' },
                { label: 'API Keys', icon: Key, path: '/admin/settings/api-keys' },
                { label: 'Virtual Agents', icon: Bot, path: '/admin/settings/virtual-agents', permissions: ['is_admin'] },
            ]
        },
        ...(settingsAppEntries.length > 0 ? [{
            title: 'App Settings',
            items: settingsAppEntries.map(e => ({
                label: e.title, icon: Server, path: e.link
            }))
        }] : [])
    ];

export const settingsMenu = getSettingsMenu([]);
