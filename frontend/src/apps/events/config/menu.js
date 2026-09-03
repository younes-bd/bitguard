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


export const eventsManifest = {
    techName: 'events',
    displayName: 'Events',
    commandCenterSection: 'Marketing',
    commandCenterOrder: 3,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const eventsMenu = [
        {
            title: 'Events',
            items: [
                { label: 'Events', icon: Calendar, path: '/admin/events' },
                { label: 'Attendees', icon: Users, path: '/admin/events/attendees' },
                { label: 'Tracks', icon: MapPin, path: '/admin/events/tracks' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Analytics', icon: BarChart3, path: '/admin/events/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/events/settings' },
                { label: 'Event Templates', icon: FileText, path: '/admin/events/templates' },
            ]
        }
    ];
