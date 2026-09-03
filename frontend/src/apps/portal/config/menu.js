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


export const portalManifest = {
    techName: 'portal',
    displayName: 'Portal',
    commandCenterSection: 'Website',
    commandCenterOrder: 5,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const portalMenu = [
        {
            title: 'Client Portal',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/portal' },
                { label: 'Access Management', icon: Users, path: '/admin/portal/access' },
                { label: 'Shared Resources', icon: Share2, path: '/admin/portal/shares' },
            ]
        }
    ];
