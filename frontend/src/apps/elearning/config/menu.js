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


export const elearningManifest = {
    techName: 'elearning',
    displayName: 'eLearning',
    commandCenterSection: 'Website',
    commandCenterOrder: 4,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const elearningMenu = [
        {
            title: 'Courses',
            items: [
                { label: 'Courses', icon: Book, path: '/admin/elearning/courses' },
                { label: 'Contents', icon: FileText, path: '/admin/elearning/contents' },
                { label: 'Forums', icon: MessageSquare, path: '/admin/elearning/forums' },
                { label: 'Certifications', icon: Award, path: '/admin/elearning/certifications' },
                { label: 'Reviews', icon: Star, path: '/admin/elearning/reviews' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Courses', icon: BookOpen, path: '/admin/elearning/reports/courses' },
                { label: 'Contents', icon: FileText, path: '/admin/elearning/reports/contents' },
                { label: 'Revenues', icon: DollarSign, path: '/admin/elearning/reports/revenues' },
                { label: 'Certifications', icon: Award, path: '/admin/elearning/reports/certifications' },
                { label: 'Reviews', icon: Star, path: '/admin/elearning/reports/reviews' },
                { label: 'Forums', icon: MessageSquare, path: '/admin/elearning/reports/forums' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/elearning/settings' },
                { label: 'Course Groups', icon: Layers, path: '/admin/elearning/course-groups' },
                { label: 'Content Tags', icon: Tags, path: '/admin/elearning/content-tags' },
            ]
        }
    ];
