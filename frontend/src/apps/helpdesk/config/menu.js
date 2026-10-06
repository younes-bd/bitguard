import {
    Activity, BarChart3, Compass, Layers,
    LayoutDashboard, LifeBuoy, MessageCircle, Settings,
    ShieldCheck, Tag, Tags, Users
} from 'lucide-react';

export const helpdeskMenu = [
        {
            title: 'Helpdesk',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/helpdesk' },
                { label: 'Tickets', icon: LifeBuoy, path: '/admin/helpdesk/tickets' },
                { label: 'My Tickets', icon: Activity, path: '/admin/helpdesk/my-tickets' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Tickets Analysis', icon: BarChart3, path: '/admin/helpdesk/reports/tickets' },
                { label: 'SLA Status Analysis', icon: ShieldCheck, path: '/admin/helpdesk/reports/sla' },
                { label: 'Live Chat', icon: MessageCircle, path: '/admin/helpdesk/messaging' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/helpdesk/settings' },
                { label: 'Helpdesk Teams', icon: Users, path: '/admin/helpdesk/teams' },
                { label: 'SLA Policies', icon: ShieldCheck, path: '/admin/helpdesk/sla' },
                { label: 'Stages', icon: Layers, path: '/admin/helpdesk/stages' },
                { label: 'Ticket Types', icon: Tag, path: '/admin/helpdesk/types' },
                { label: 'Tags', icon: Tag, path: '/admin/helpdesk/tags' },
                { label: 'Visitors', icon: Compass, path: '/admin/helpdesk/messaging/visitors' },
            ]
        }
    ];
