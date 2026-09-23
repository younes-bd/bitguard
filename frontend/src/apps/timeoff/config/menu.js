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

export const TimeoffMenu = [
        {
            title: 'My Time Off',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/timeoff' },
                { label: 'My Time Off', icon: Clock, path: '/admin/timeoff/requests' },
                { label: 'My Allocations', icon: Plus, path: '/admin/timeoff/my-allocations' }
            ]
        },
        {
            title: 'Management',
            items: [
                { label: 'Time Off', icon: CheckSquare, path: '/admin/timeoff/approvals' },
                { label: 'Allocations', icon: Plus, path: '/admin/timeoff/allocations' }
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'by Employee', icon: Users, path: '/admin/timeoff/reports/employee' },
                { label: 'by Type', icon: Tag, path: '/admin/timeoff/reports/type' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/timeoff/settings' },
                { label: 'Time Off Types', icon: Tag, path: '/admin/timeoff/types' },
                { label: 'Accrual Plans', icon: Activity, path: '/admin/timeoff/accrual-plans' },
                { label: 'Public Holidays', icon: Calendar, path: '/admin/timeoff/public-holidays' }
            ]
        }
    ];
