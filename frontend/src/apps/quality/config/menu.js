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
                { label: 'Control Points', icon: Settings, path: '/admin/quality/control-points' },
                { label: 'Quality Checks', icon: CheckSquare, path: '/admin/quality/checks' },
                { label: 'Quality Alerts', icon: ShieldCheck, path: '/admin/quality/alerts' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/quality/settings' },
                { label: 'Quality Teams', icon: Users, path: '/admin/quality/teams' },
            ]
        }
    ];
