import {
    CheckSquare, LayoutDashboard, Settings, ShieldCheck,
    Users
} from 'lucide-react';

export const quality_controlMenu = [
        {
            title: 'Quality',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/quality' },
            ]
        },
        {
            title: 'Quality Control',
            items: [
                { label: 'Control Points', icon: Settings, path: '/admin/quality/control-points' },
                { label: 'Quality Checks', icon: CheckSquare, path: '/admin/quality/checks' },
                { label: 'Quality Alerts', icon: ShieldCheck, path: '/admin/quality/alerts' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/quality/settings' },
                { label: 'Quality Teams', icon: Users, path: '/admin/quality/teams' },
            ]
        }
    ];
