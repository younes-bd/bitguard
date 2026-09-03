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


export const recruitmentManifest = {
    techName: 'recruitment',
    displayName: 'Recruitment',
    commandCenterSection: 'Human Resources',
    commandCenterOrder: 5,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const recruitmentMenu = [
        {
            title: 'Applications',
            items: [
                { label: 'Job Positions', icon: FolderKanban, path: '/admin/recruitment' },
                { label: 'All Applications', icon: Users, path: '/admin/recruitment/applications' }
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Recruitment Analysis', icon: Activity, path: '/admin/recruitment/reports' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/recruitment/settings' },
                { label: 'Job Positions', icon: FolderKanban, path: '/admin/recruitment/jobs' },
                { label: 'Refuse Reasons', icon: AlertCircle, path: '/admin/recruitment/refuse-reasons' },
                { label: 'Departments', icon: Layers, path: '/admin/recruitment/departments' },
                { label: 'Activity Types', icon: Activity, path: '/admin/recruitment/activity-types' }
            ]
        }
    ];
