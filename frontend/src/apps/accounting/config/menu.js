import {
    Activity, Book, BookOpen, Box,
    Clock, CreditCard, DollarSign, FileSpreadsheet,
    FileText, Globe, Landmark, Layers,
    LayoutDashboard, RefreshCw, Settings, ShoppingCart,
    Users
} from 'lucide-react';

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
            title: 'Reports',
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
