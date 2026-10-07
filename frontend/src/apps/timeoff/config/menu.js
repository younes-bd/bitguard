import {
    Activity, Calendar, CheckSquare, Clock,
    LayoutDashboard, Plus, Settings, Tag,
    Users
} from 'lucide-react';

export const TimeoffMenu = [
        {
            title: 'My Time Off',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/timeoff' },
                { label: 'My Time Off', icon: Clock, path: '/admin/timeoff/requests' },
                { label: 'My Allocations', icon: Plus, path: '/admin/timeoff/my-allocations' }
            ]
        },
        {
            title: 'Management',
            items: [
                { label: 'Time Off', icon: CheckSquare, path: '/admin/timeoff/approvals' },
                { label: 'Allocations', icon: Plus, path: '/admin/timeoff/allocations' }
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'by Employee', icon: Users, path: '/admin/timeoff/reports/employee' },
                { label: 'by Type', icon: Tag, path: '/admin/timeoff/reports/type' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/timeoff/settings' },
                { label: 'Time Off Types', icon: Tag, path: '/admin/timeoff/types' },
                { label: 'Accrual Plans', icon: Activity, path: '/admin/timeoff/accrual-plans' },
                { label: 'Public Holidays', icon: Calendar, path: '/admin/timeoff/public-holidays' }
            ]
        }
    ];
