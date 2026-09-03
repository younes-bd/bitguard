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


export const accountingManifest = {
    techName: 'accounting',
    displayName: 'Accounting',
    commandCenterSection: 'Finance',
    commandCenterOrder: 1,
    hasSettings: true,
    settingsUrl: '/admin/settings/accounting',
    settingsDesc: 'Configure settings',
};

export const accountingMenu = [
        {
            title: 'Accounting',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/accounting' },
                { label: 'Journal Entries', icon: FileSpreadsheet, path: '/admin/accounting/journal-entries' },
                { label: 'Ledgers', icon: Book, path: '/admin/accounting/ledgers' },
                { label: 'Bank Statements', icon: Landmark, path: '/admin/accounting/bank-statements' },
                { label: 'Reconciliation', icon: RefreshCw, path: '/admin/accounting/reconciliation' },
            ]
        },
        {
            title: 'Customers',
            items: [
                { label: 'Invoices', icon: FileText, path: '/admin/accounting/invoices' },
                { label: 'Credit Notes', icon: FileText, path: '/admin/accounting/customer-credit-notes' },
                { label: 'Payments', icon: DollarSign, path: '/admin/accounting/customer-payments' },
                { label: 'Follow-up Reports', icon: Activity, path: '/admin/accounting/follow-up' },
                { label: 'Customers', icon: Users, path: '/admin/accounting/customers' },
                { label: 'Products', icon: Box, path: '/admin/accounting/products' },
            ]
        },
        {
            title: 'Vendors',
            items: [
                { label: 'Bills', icon: ShoppingCart, path: '/admin/accounting/vendor-bills' },
                { label: 'Refunds', icon: RefreshCw, path: '/admin/accounting/vendor-refunds' },
                { label: 'Payments', icon: DollarSign, path: '/admin/accounting/vendor-payments' },
                { label: 'Employee Expense', icon: CreditCard, path: '/admin/accounting/employee-expenses' },
                { label: 'Vendors', icon: Users, path: '/admin/accounting/vendors' },
                { label: 'Products', icon: Box, path: '/admin/accounting/vendor-products' },
            ]
        },
        {
            title: 'Reporting',
            items: [
                { label: 'General Ledger', icon: Book, path: '/admin/accounting/reports/general-ledger' },
                { label: 'Partner Ledger', icon: Users, path: '/admin/accounting/reports/partner-ledger' },
                { label: 'Tax Report', icon: FileText, path: '/admin/accounting/reports/tax' },
                { label: 'Aged Receivable/Payable', icon: Clock, path: '/admin/accounting/reports/aged' },
                { label: 'Audit Reports', icon: Activity, path: '/admin/accounting/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/accounting/settings' },
                { label: 'Chart of Accounts', icon: Layers, path: '/admin/accounting/chart-of-accounts' },
                { label: 'Taxes', icon: FileText, path: '/admin/accounting/taxes' },
                { label: 'Journals', icon: BookOpen, path: '/admin/accounting/journals' },
                { label: 'Bank Accounts', icon: Landmark, path: '/admin/accounting/bank-accounts' },
                { label: 'Fiscal Positions', icon: Globe, path: '/admin/accounting/fiscal-positions' },
            ]
        }
    ];
