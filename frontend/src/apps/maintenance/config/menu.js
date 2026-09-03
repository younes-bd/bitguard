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


export const maintenanceManifest = {
    techName: 'maintenance',
    displayName: 'Maintenance',
    commandCenterSection: 'Inventory & MRP',
    commandCenterOrder: 5,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const maintenanceMenu = [
        {
            title: 'Maintenance',
            items: [
                { label: 'Equipments', icon: Monitor, path: '/admin/maintenance/assets' },
                { label: 'Maintenance Requests', icon: Wrench, path: '/admin/maintenance/requests' },
                { label: 'Reporting', icon: Activity, path: '/admin/maintenance/depreciation' },
                { label: 'Configuration', icon: Settings, path: '/admin/maintenance/settings' },
            ]
        }
    ];
