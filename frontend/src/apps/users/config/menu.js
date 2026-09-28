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

export const usersMenu = [
        {
            title: 'Users & Companies',
            items: [
                { label: 'Users', icon: Users, path: '/admin/users/users' },
                { label: 'Companies', icon: Building2, path: '/admin/users/tenants' },
                { label: 'Groups', icon: Key, path: '/admin/users/roles' },
            ]
        }
    ];

export const settingsMenu = [
    { section: 'Users & Companies', label: 'Users', icon: Users, path: '/admin/settings/users' },
    { section: 'Users & Companies', label: 'Companies', icon: Building2, path: '/admin/settings/companies' },
    { section: 'Users & Companies', label: 'User Groups', icon: ShieldCheck, path: '/admin/settings/groups' },
    { section: 'Users & Companies', label: 'Active Sessions', icon: Server, path: '/admin/settings/active-sessions' },
    { section: 'Users & Companies', label: 'Personal Access Tokens', icon: Key, path: '/admin/settings/personal-access-tokens' },
    { section: 'Technical', label: 'Access Rights', icon: Key, path: '/admin/settings/access-rights' },
    { section: 'Technical', label: 'Record Rules', icon: Database, path: '/admin/settings/record-rules' },
    { section: 'Technical', label: 'Security Policy', icon: ShieldCheck, path: '/admin/settings/security-policy' },
];
