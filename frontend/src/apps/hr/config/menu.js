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


export const hrManifest = {
    techName: 'hr',
    displayName: 'Human Resources',
    commandCenterSection: 'Human Resources',
    commandCenterOrder: 1,
    hasSettings: true,
    settingsUrl: '/admin/settings/hr',
    settingsDesc: 'Configure settings',
};

export const hrMenu = [
        {
            title: 'Employees',
            items: [
                { label: 'Employees', icon: Users, path: '/admin/hr/employees' },
                { label: 'Contracts', icon: FileText, path: '/admin/hr/contracts' },
            ]
        },
        {
            title: 'Departments',
            items: [
                { label: 'Departments', icon: Layers, path: '/admin/hr/org-chart' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Reporting', icon: Activity, path: '/admin/hr/reporting' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/hr/settings' },
                { label: 'Work Locations', icon: MapPin, path: '/admin/hr/work-locations' },
                { label: 'Departure Reasons', icon: AlertCircle, path: '/admin/hr/departure-reasons' },
            ]
        }
    ];
