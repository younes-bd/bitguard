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


export const quality_controlManifest = {
    techName: 'quality_control',
    displayName: 'Quality',
    commandCenterSection: 'Inventory & MRP',
    commandCenterOrder: 6,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const quality_controlMenu = [
        {
            title: 'Quality',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/quality' },
            ]
        },
        {
            title: 'Quality Control',
            items: [
                { label: 'Control Points', icon: Settings, path: '/admin/quality_control/control-points' },
                { label: 'Quality Checks', icon: CheckSquare, path: '/admin/quality_control/checks' },
                { label: 'Quality Alerts', icon: ShieldCheck, path: '/admin/quality_control/alerts' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/quality_control/settings' },
                { label: 'Quality Teams', icon: Users, path: '/admin/quality_control/teams' },
            ]
        }
    ];
