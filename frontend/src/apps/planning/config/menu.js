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


export const planningManifest = {
    techName: 'planning',
    displayName: 'Planning',
    commandCenterSection: 'Services',
    commandCenterOrder: 5,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const planningMenu = [
        {
            title: 'Schedule',
            items: [
                { label: 'My Planning', icon: Clock, path: '/admin/planning/my-planning' },
                { label: 'Open Shifts', icon: Users, path: '/admin/planning/open-shifts' },
                { label: 'By Employee', icon: Users, path: '/admin/planning/schedule/employee' },
                { label: 'By Role', icon: Key, path: '/admin/planning/schedule/role' },
                { label: 'By Project', icon: FolderKanban, path: '/admin/planning/schedule/project' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Planning Analysis', icon: Activity, path: '/admin/planning/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/planning/settings' },
                { label: 'Roles', icon: ShieldCheck, path: '/admin/planning/roles' },
            ]
        }
    ];
