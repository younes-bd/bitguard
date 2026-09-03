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


export const reportingManifest = {
    techName: 'reporting',
    displayName: 'Reporting',
    commandCenterSection: 'Productivity',
    commandCenterOrder: 5,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const reportingMenu = [
        {
            title: 'Print & Reports',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/reporting' },
                { label: 'Templates', icon: FileText, path: '/admin/reporting/templates' },
                { label: 'Generated Documents', icon: Layout, path: '/admin/reporting/generated' },
                { label: 'Print Formats', icon: Zap, path: '/admin/reporting/settings' },
            ]
        }
    ];
