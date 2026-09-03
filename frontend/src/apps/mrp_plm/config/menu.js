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


export const mrp_plmManifest = {
    techName: 'mrp_plm',
    displayName: 'PLM',
    commandCenterSection: 'Inventory & MRP',
    commandCenterOrder: 7,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const mrp_plmMenu = [
        {
            title: 'PLM',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/plm' },
            ]
        },
        {
            title: 'Changes',
            items: [
                { label: 'Engineering Change Orders', icon: Activity, path: '/admin/mrp_plm/ecos' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/mrp_plm/settings' },
                { label: 'ECO Types', icon: Layers, path: '/admin/mrp_plm/eco-types' },
            ]
        }
    ];
