import { LayoutDashboard, MessageCircle, Settings, Users } from 'lucide-react';

export const messagingMenu = [
        {
            title: 'Live Chat',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/messaging' },
                { label: 'Visitors', icon: Users, path: '/admin/messaging/visitors' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/messaging/settings' },
                { label: 'Channels', icon: MessageCircle, path: '/admin/messaging/channels' },
            ]
        }
    ];
