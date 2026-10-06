import { Activity, Monitor, Settings, UserCheck } from 'lucide-react';

export const hr_attendanceMenu = [
        {
            title: 'Attendances',
            items: [
                { label: 'Attendances', icon: UserCheck, path: '/admin/timeclock' },
                { label: 'Kiosk Mode', icon: Monitor, path: '/admin/timeclock/kiosk' }
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Reports', icon: Activity, path: '/admin/timeclock/reports' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/timeclock/settings' }
            ]
        }
    ];
