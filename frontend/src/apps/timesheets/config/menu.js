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


export const timesheetsManifest = {
    techName: 'timesheets',
    displayName: 'Timesheets',
    commandCenterSection: 'Services',
    commandCenterOrder: 2,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const timesheetsMenu = [
        {
            title: 'Timesheets',
            items: [
                { label: 'My Timesheets', icon: Clock, path: '/admin/timesheets' },
                { label: 'All Timesheets', icon: Users, path: '/admin/timesheets/all' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'By Employee', icon: Users, path: '/admin/timesheets/reports/employee' },
                { label: 'By Project', icon: FolderKanban, path: '/admin/timesheets/reports/project' },
                { label: 'By Task', icon: Layout, path: '/admin/timesheets/reports/task' },
                { label: 'By Billing Type', icon: DollarSign, path: '/admin/timesheets/reports/billing' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/timesheets/settings' },
            ]
        }
    ];
