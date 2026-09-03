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


export const HrHolidaysManifest = {
    techName: 'HrHolidays',
    displayName: 'Time Off',
    commandCenterSection: 'Human Resources',
    commandCenterOrder: 3,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const HrHolidaysMenu = [
        {
            title: 'My Time Off',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/hr_holidays' },
                { label: 'My Time Off', icon: Clock, path: '/admin/hr_holidays/requests' },
                { label: 'My Allocations', icon: Plus, path: '/admin/hr_holidays/my-allocations' }
            ]
        },
        {
            title: 'Management',
            items: [
                { label: 'Time Off', icon: CheckSquare, path: '/admin/hr_holidays/approvals' },
                { label: 'Allocations', icon: Plus, path: '/admin/hr_holidays/allocations' }
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'by Employee', icon: Users, path: '/admin/hr_holidays/reports/employee' },
                { label: 'by Type', icon: Tag, path: '/admin/hr_holidays/reports/type' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/hr_holidays/settings' },
                { label: 'Time Off Types', icon: Tag, path: '/admin/hr_holidays/types' },
                { label: 'Accrual Plans', icon: Activity, path: '/admin/hr_holidays/accrual-plans' },
                { label: 'Public Holidays', icon: Calendar, path: '/admin/hr_holidays/public-holidays' }
            ]
        }
    ];
