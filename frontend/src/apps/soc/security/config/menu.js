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


export const securityManifest = {
    techName: 'security',
    displayName: 'Security',
    commandCenterSection: 'Administration',
    commandCenterOrder: 1,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const securityMenu = [
        {
            title: 'Security Operations Center',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/security' },
                { label: 'Alerts', icon: AlertCircle, path: '/admin/security/alerts' },
                { label: 'Incidents', icon: ShieldCheck, path: '/admin/security/incidents' },
                { label: 'Assets', icon: Server, path: '/admin/security/assets' },
                { label: 'Compliance', icon: FileText, path: '/admin/security/compliance' },
                { label: 'Logs', icon: PieChart, path: '/admin/security/logs' },
                { label: 'Settings', icon: Settings, path: '/admin/security/settings' },
            ]
        }
    ];
