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


export const stockManifest = {
    techName: 'stock',
    displayName: 'Inventory',
    commandCenterSection: 'Inventory & MRP',
    commandCenterOrder: 2,
    hasSettings: true,
    settingsUrl: '/admin/settings/stock',
    settingsDesc: 'Configure settings',
};

export const stockMenu = [
        {
            title: 'Inventory',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/stock' },
            ]
        },
        {
            title: 'Operations',
            items: [
                { label: 'Receipts', icon: Truck, path: '/admin/stock/receipts' },
                { label: 'Deliveries', icon: Truck, path: '/admin/stock/deliveries' },
                { label: 'Transfers', icon: RefreshCw, path: '/admin/stock/transfers' },
                { label: 'Replenishment', icon: RefreshCw, path: '/admin/stock/replenishment' },
                { label: 'Inventory Adjustments', icon: Edit3, path: '/admin/stock/adjustments' },
                { label: 'Scrap', icon: Trash2, path: '/admin/stock/scrap' },
                { label: 'Landed Costs', icon: DollarSign, path: '/admin/stock/landed-costs' },
                { label: 'Run Scheduler', icon: Clock, path: '/admin/stock/run-scheduler' },
            ]
        },
        {
            title: 'Products',
            items: [
                { label: 'Products', icon: Box, path: '/admin/stock/products' },
                { label: 'Product Variants', icon: Layers, path: '/admin/stock/product-variants' },
                { label: 'Lots/Serial Numbers', icon: Tag, path: '/admin/stock/lots' },
                { label: 'Packages', icon: Box, path: '/admin/stock/packages' },
                { label: 'Putaway Rules', icon: GitBranch, path: '/admin/stock/putaway' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'Stock', icon: Activity, path: '/admin/stock/reports/stock' },
                { label: 'Moves History', icon: Clock, path: '/admin/stock/reports/moves' },
                { label: 'Inventory Valuation', icon: DollarSign, path: '/admin/stock/reports/valuation' },
                { label: 'Performance', icon: BarChart3, path: '/admin/stock/reports/performance' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/stock/settings' },
                { label: 'Warehouses', icon: Building2, path: '/admin/stock/warehouses' },
                { label: 'Locations', icon: MapPin, path: '/admin/stock/locations' },
                { label: 'Routes', icon: GitBranch, path: '/admin/stock/routes' },
                { label: 'Rules', icon: GitBranch, path: '/admin/stock/rules' },
                { label: 'Operation Types', icon: Layers, path: '/admin/stock/operation-types' },
                { label: 'Product Categories', icon: Tags, path: '/admin/stock/product-categories' },
                { label: 'Attributes', icon: Tag, path: '/admin/stock/attributes' },
                { label: 'Reordering Rules', icon: RefreshCw, path: '/admin/stock/reorder-rules' },
                { label: 'Shipping Methods', icon: Truck, path: '/admin/stock/shipping' },
            ]
        }
    ];
