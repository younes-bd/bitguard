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


export const expensesManifest = {
    techName: 'expenses',
    displayName: 'Expenses',
    commandCenterSection: 'Finance',
    commandCenterOrder: 3,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const expensesMenu = [
        {
            title: 'My Expenses',
            items: [
                { label: 'My Expenses', icon: CreditCard, path: '/admin/expenses' },
                { label: 'My Reports', icon: FileText, path: '/admin/expenses/my-reports' },
            ]
        },
        {
            title: 'Expense Reports',
            items: [
                { label: 'To Approve', icon: CheckSquare, path: '/admin/expenses/to-approve' },
                { label: 'To Post', icon: FileText, path: '/admin/expenses/to-post' },
                { label: 'To Pay', icon: DollarSign, path: '/admin/expenses/to-pay' },
                { label: 'All Reports', icon: FileText, path: '/admin/expenses/reports' }
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Expenses Analysis', icon: BarChart3, path: '/admin/expenses/analysis' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/expenses/settings' },
                { label: 'Expense Categories', icon: Tags, path: '/admin/expenses/categories' }
            ]
        }
    ];
