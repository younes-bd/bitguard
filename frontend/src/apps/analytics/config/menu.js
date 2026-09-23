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

// Use standard import.meta.glob but DO NOT make this file a React component.
// It exposes a function to dynamically build the menu when called.
const pluginModules = import.meta.glob('../../*/config/analytics_plugin.js', { eager: true });

export const getDashboardsMenu = (installedApps = []) => {
    
    const coreItems = [
        { label: 'Overview', icon: PieChart, path: '/admin/analytics/analytics' },
        { label: 'Executive Summary', icon: LayoutDashboard, path: '/admin/analytics/executive' },
        { label: 'MRR Dashboard', icon: TrendingUp, path: '/admin/analytics/mrr' },
    ];

    const reportItems = [];
    
    // Dynamically inject reports from installed apps
    for (const path in pluginModules) {
        const mod = pluginModules[path].default;
        if (mod && mod.id) {
            if (installedApps.some(app => app.technical_name === mod.id)) {
                reportItems.push({
                    label: `${mod.title} Analytics`,
                    icon: mod.icon,
                    path: `/admin/analytics/${mod.path}`
                });
            }
        }
    }
    
    // Sort dynamically added reports
    reportItems.sort((a, b) => a.label.localeCompare(b.label));

    return [
        {
            title: 'Dashboards',
            items: coreItems
        },
        {
            title: 'Reports',
            items: reportItems
        },
        {
            title: 'Tools',
            items: [
                { label: 'Export Data', icon: Download, path: '/admin/analytics/export' },
            ]
        }
    ];
};

// Export empty default for the static loader to not crash, 
// the ModuleLayout will need to call getDashboardsMenu instead
export const dashboardsMenu = [];
