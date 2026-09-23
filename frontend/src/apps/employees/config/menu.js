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

export const hrMenu = [
        {
            title: 'Employees',
            items: [
                { label: 'Employees', icon: Users, path: '/admin/employees/employees' },
                { label: 'Contracts', icon: FileText, path: '/admin/employees/contracts' },
            ]
        },
        {
            title: 'Departments',
            items: [
                { label: 'Departments', icon: Layers, path: '/admin/employees/org-chart' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Reports', icon: Activity, path: '/admin/employees/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/employees/settings' },
                { label: 'Work Locations', icon: MapPin, path: '/admin/employees/work-locations' },
                { label: 'Departure Reasons', icon: AlertCircle, path: '/admin/employees/departure-reasons' },
            ]
        }
    ];
