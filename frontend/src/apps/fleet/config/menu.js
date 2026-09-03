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


export const fleetManifest = {
    techName: 'fleet',
    displayName: 'Fleet',
    commandCenterSection: 'Human Resources',
    commandCenterOrder: 7,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const fleetMenu = [
        {
            title: 'Fleet',
            items: [
                { label: 'Vehicles', icon: Truck, path: '/admin/fleet' },
                { label: 'Odometers', icon: Clock, path: '/admin/fleet/odometer' }
            ]
        },
        {
            title: 'Contracts',
            items: [
                { label: 'Contracts', icon: FileText, path: '/admin/fleet/contracts' }
            ]
        },
        {
            title: 'Services',
            items: [
                { label: 'Services', icon: Wrench, path: '/admin/fleet/services' }
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Costs Analysis', icon: BarChart3, path: '/admin/fleet/reports' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/fleet/settings' },
                { label: 'Manufacturers', icon: Building2, path: '/admin/fleet/manufacturers' },
                { label: 'Vehicle Models', icon: Truck, path: '/admin/fleet/models' }
            ]
        }
    ];
