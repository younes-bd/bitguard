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


export const payrollManifest = {
    techName: 'payroll',
    displayName: 'Payroll',
    commandCenterSection: 'Human Resources',
    commandCenterOrder: 4,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const payrollMenu = [
        {
            title: 'Payroll',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/payroll' },
                { label: 'Payslips', icon: FileText, path: '/admin/payroll/payslips' },
                { label: 'Contracts', icon: Layers, path: '/admin/payroll/contracts' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/payroll/settings' },
                { label: 'Salary Rules', icon: CheckSquare, path: '/admin/payroll/rules' },
            ]
        }
    ];
