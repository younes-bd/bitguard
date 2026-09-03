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


export const projectsManifest = {
    techName: 'projects',
    displayName: 'Projects',
    commandCenterSection: 'Services',
    commandCenterOrder: 1,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const projectsMenu = [
        {
            title: 'Project',
            items: [
                { label: 'Projects', icon: FolderKanban, path: '/admin/projects/list' },
                { label: 'Tasks', icon: Layout, path: '/admin/projects/kanban' },
                { label: 'Updates', icon: Activity, path: '/admin/projects/updates' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Task Analysis', icon: PieChart, path: '/admin/projects/reports' },
                { label: 'Burndown Chart', icon: Activity, path: '/admin/projects/burndown' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/projects/settings' },
                { label: 'Project Stages', icon: Layers, path: '/admin/projects/stages/project' },
                { label: 'Task Stages', icon: GitBranch, path: '/admin/projects/stages/task' },
                { label: 'Project Templates', icon: FileText, path: '/admin/projects/templates' },
                { label: 'Activity Types', icon: Activity, path: '/admin/projects/activity-types' },
                { label: 'Tags', icon: Tag, path: '/admin/projects/tags' },
            ]
        }
    ];
