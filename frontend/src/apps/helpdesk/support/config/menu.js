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


export const supportManifest = {
    techName: 'support',
    displayName: 'Support',
    commandCenterSection: 'Other',
    commandCenterOrder: 99,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const supportMenu = [
        {
            title: 'Field Service',
            items: [
                { label: 'Tasks', icon: LayoutDashboard, path: '/admin/helpdesk' },
                { label: 'Planning', icon: Calendar, path: '/admin/helpdesk/tickets' },
                { label: 'Reporting', icon: Activity, path: '/admin/helpdesk/sla-live' },
                { label: 'Configuration', icon: Settings, path: '/admin/helpdesk/settings' },
            ]
        }
    ];
