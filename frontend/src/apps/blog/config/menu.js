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


export const blogManifest = {
    techName: 'blog',
    displayName: 'Blog',
    commandCenterSection: 'Website',
    commandCenterOrder: 3,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const blogMenu = [
        {
            title: 'Blog',
            items: [
                { label: 'Posts', icon: BookOpen, path: '/admin/blog' },
                { label: 'Tags', icon: Tag, path: '/admin/blog/tags' },
                { label: 'Blogs', icon: FolderOpen, path: '/admin/blog/categories' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/blog/settings' },
            ]
        }
    ];
