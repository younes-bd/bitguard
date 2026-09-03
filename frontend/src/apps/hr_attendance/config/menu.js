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


export const hr_attendanceManifest = {
    techName: 'hr_attendance',
    displayName: 'Attendances',
    commandCenterSection: 'Human Resources',
    commandCenterOrder: 2,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const hr_attendanceMenu = [
        {
            title: 'Attendances',
            items: [
                { label: 'Attendances', icon: UserCheck, path: '/admin/hr_attendance' },
                { label: 'Kiosk Mode', icon: Monitor, path: '/admin/hr_attendance/kiosk' }
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Reporting', icon: Activity, path: '/admin/hr_attendance/reports' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/hr_attendance/settings' }
            ]
        }
    ];
