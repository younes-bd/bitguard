import { Activity, Calendar, LayoutDashboard, Settings } from 'lucide-react';

export const supportMenu = [
        {
            title: 'Field Service',
            items: [
                { label: 'Tasks', icon: LayoutDashboard, path: '/admin/helpdesk' },
                { label: 'Planning', icon: Calendar, path: '/admin/helpdesk/tickets' },
                { label: 'Reports', icon: Activity, path: '/admin/helpdesk/sla-live' },
                { label: 'Configuration', icon: Settings, path: '/admin/helpdesk/settings' },
            ]
        }
    ];
