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

export const learningMenu = [
        {
            title: 'Courses',
            items: [
                { label: 'Courses', icon: Book, path: '/admin/learning/courses' },
                { label: 'Contents', icon: FileText, path: '/admin/learning/contents' },
                { label: 'Forums', icon: MessageSquare, path: '/admin/learning/forums' },
                { label: 'Certifications', icon: Award, path: '/admin/learning/certifications' },
                { label: 'Reviews', icon: Star, path: '/admin/learning/reviews' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Courses', icon: BookOpen, path: '/admin/learning/reports/courses' },
                { label: 'Contents', icon: FileText, path: '/admin/learning/reports/contents' },
                { label: 'Revenues', icon: DollarSign, path: '/admin/learning/reports/revenues' },
                { label: 'Certifications', icon: Award, path: '/admin/learning/reports/certifications' },
                { label: 'Reviews', icon: Star, path: '/admin/learning/reports/reviews' },
                { label: 'Forums', icon: MessageSquare, path: '/admin/learning/reports/forums' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/learning/settings' },
                { label: 'Course Groups', icon: Layers, path: '/admin/learning/course-groups' },
                { label: 'Content Tags', icon: Tags, path: '/admin/learning/content-tags' },
            ]
        }
    ];
