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


export const signManifest = {
    techName: 'sign',
    displayName: 'Sign',
    commandCenterSection: 'Finance',
    commandCenterOrder: 4,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const signMenu = [
        {
            title: 'Dashboard',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/sign' },
            ]
        },
        {
            title: 'Signature Requests',
            items: [
                { label: 'Signature Requests', icon: FileText, path: '/admin/sign/requests' },
            ]
        },
        {
            title: 'Documents',
            items: [
                { label: 'Documents', icon: FolderOpen, path: '/admin/sign/documents' },
            ]
        },
        {
            title: 'Templates',
            items: [
                { label: 'Templates', icon: Layers, path: '/admin/sign/templates' },
            ]
        },
        {
            title: 'Contacts',
            items: [
                { label: 'Contacts', icon: Users, path: '/admin/sign/contacts' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/sign/settings' },
                { label: 'Roles', icon: ShieldCheck, path: '/admin/sign/roles' },
            ]
        }
    ];
