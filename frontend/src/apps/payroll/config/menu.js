import {
    CheckSquare, FileText, Layers, LayoutDashboard,
    Settings
} from 'lucide-react';

export const payrollMenu = [
        {
            title: 'Payroll',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/payroll' },
                { label: 'Payslips', icon: FileText, path: '/admin/payroll/payslips' },
                { label: 'Contracts', icon: Layers, path: '/admin/payroll/contracts' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/payroll/settings' },
                { label: 'Salary Rules', icon: CheckSquare, path: '/admin/payroll/rules' },
            ]
        }
    ];
