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


export const documentsManifest = {
    techName: 'documents',
    displayName: 'Documents',
    commandCenterSection: 'Productivity',
    commandCenterOrder: 1,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const documentsMenu = [
        {
            title: 'Documents',
            items: [
                { label: 'Workspace', icon: FolderOpen, path: '/admin/documents' },
                { label: 'Folders', icon: Building2, path: '/admin/documents/workspaces' },
                { label: 'Tags', icon: Tags, path: '/admin/documents/tags' },
                { label: 'Configuration', icon: Settings, path: '/admin/documents/settings' },
            ]
        }
    ];
