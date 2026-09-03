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


export const discussManifest = {
    techName: 'discuss',
    displayName: 'Discuss',
    commandCenterSection: 'Productivity',
    commandCenterOrder: 3,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const discussMenu = [
        {
            title: 'Discuss',
            items: [
                { label: 'Inbox', icon: MessageSquare, path: '/admin/discuss' },
                { label: 'Channels', icon: MessageCircle, path: '/admin/discuss/channels' },
                { label: 'Direct Messages', icon: Users, path: '/admin/discuss/dm' },
            ]
        },
        {
            title: 'WhatsApp',
            items: [
                { label: 'Conversations', icon: PhoneCall, path: '/admin/discuss/whatsapp' },
                { label: 'Accounts', icon: Building2, path: '/admin/discuss/whatsapp/accounts' },
                { label: 'Message Templates', icon: FileText, path: '/admin/discuss/whatsapp/templates' },
            ]
        }
    ];
