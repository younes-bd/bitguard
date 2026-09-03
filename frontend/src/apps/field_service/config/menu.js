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


export const field_serviceManifest = {
    techName: 'field_service',
    displayName: 'Field Service',
    commandCenterSection: 'Services',
    commandCenterOrder: 3,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const field_serviceMenu = [
        {
            title: 'My Tasks',
            items: [
                { label: 'Map', icon: MapPin, path: '/admin/field-service/my-tasks/map' },
                { label: 'Schedule', icon: Calendar, path: '/admin/field-service/my-tasks/schedule' },
            ]
        },
        {
            title: 'All Tasks',
            items: [
                { label: 'Map', icon: MapPin, path: '/admin/field-service/all-tasks/map' },
                { label: 'Schedule', icon: Calendar, path: '/admin/field-service/all-tasks/schedule' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Tasks Analysis', icon: BarChart3, path: '/admin/field-service/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/field-service/settings' },
                { label: 'Stages', icon: Layers, path: '/admin/field-service/stages' },
                { label: 'Tags', icon: Tag, path: '/admin/field-service/tags' },
            ]
        }
    ];
