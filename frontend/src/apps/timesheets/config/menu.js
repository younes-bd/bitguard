import {
    Clock, DollarSign, FolderKanban, Layout,
    Settings, Users
} from 'lucide-react';

export const timesheetsMenu = [
        {
            title: 'Timesheets',
            items: [
                { label: 'My Timesheets', icon: Clock, path: '/admin/timesheets' },
                { label: 'All Timesheets', icon: Users, path: '/admin/timesheets/all' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'By Employee', icon: Users, path: '/admin/timesheets/reports/employee' },
                { label: 'By Project', icon: FolderKanban, path: '/admin/timesheets/reports/project' },
                { label: 'By Task', icon: Layout, path: '/admin/timesheets/reports/task' },
                { label: 'By Billing Type', icon: DollarSign, path: '/admin/timesheets/reports/billing' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/timesheets/settings' },
            ]
        }
    ];
