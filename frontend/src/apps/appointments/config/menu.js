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


export const appointmentsManifest = {
    techName: 'appointments',
    displayName: 'Appointments',
    commandCenterSection: 'Services',
    commandCenterOrder: 6,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const appointmentsMenu = [
        {
            title: 'Appointments',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/appointments' },
                { label: 'Online Appointments', icon: Calendar, path: '/admin/appointments/online' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Appointments Analysis', icon: BarChart3, path: '/admin/appointments/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/appointments/settings' },
                { label: 'Appointment Types', icon: Calendar, path: '/admin/appointments/types' },
            ]
        }
    ];
