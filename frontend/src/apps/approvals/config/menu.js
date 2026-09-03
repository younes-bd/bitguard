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


export const approvalsManifest = {
    techName: 'approvals',
    displayName: 'Approvals',
    commandCenterSection: 'Productivity',
    commandCenterOrder: 2,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const approvalsMenu = [
        {
            title: 'Approvals',
            items: [
                { label: 'My Approvals', icon: LayoutDashboard, path: '/admin/approvals' },
                { label: 'Configuration', icon: Settings, path: '/admin/approvals/settings' },
            ]
        }
    ];
