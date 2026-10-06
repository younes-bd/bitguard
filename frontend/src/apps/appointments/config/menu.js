import { BarChart3, Calendar, LayoutDashboard, Settings } from 'lucide-react';

export const appointmentsMenu = [
        {
            title: 'Appointments',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/appointments' },
                { label: 'Online Appointments', icon: Calendar, path: '/admin/appointments/online' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Appointments Analysis', icon: BarChart3, path: '/admin/appointments/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/appointments/settings' },
                { label: 'Appointment Types', icon: Calendar, path: '/admin/appointments/types' },
            ]
        }
    ];
