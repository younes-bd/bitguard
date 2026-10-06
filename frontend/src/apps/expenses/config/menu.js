import {
    BarChart3, CheckSquare, CreditCard, DollarSign,
    FileText, Settings, Tags
} from 'lucide-react';

export const expensesMenu = [
        {
            title: 'My Expenses',
            items: [
                { label: 'My Expenses', icon: CreditCard, path: '/admin/expenses' },
                { label: 'My Reports', icon: FileText, path: '/admin/expenses/my-reports' },
            ]
        },
        {
            title: 'Expense Reports',
            items: [
                { label: 'To Approve', icon: CheckSquare, path: '/admin/expenses/to-approve' },
                { label: 'To Post', icon: FileText, path: '/admin/expenses/to-post' },
                { label: 'To Pay', icon: DollarSign, path: '/admin/expenses/to-pay' },
                { label: 'All Reports', icon: FileText, path: '/admin/expenses/reports' }
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Expenses Analysis', icon: BarChart3, path: '/admin/expenses/analysis' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/expenses/settings' },
                { label: 'Expense Categories', icon: Tags, path: '/admin/expenses/categories' }
            ]
        }
    ];
