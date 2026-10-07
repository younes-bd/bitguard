import {
    LayoutDashboard, Megaphone, Settings, Share2,
    Users
} from 'lucide-react';

export const socialMenu = [
        {
            title: 'Social Journeys',
            items: [
                { label: 'Feed', icon: LayoutDashboard, path: '/admin/social' },
                { label: 'Posts', icon: Share2, path: '/admin/social/posts' },
                { label: 'Campaigns', icon: Megaphone, path: '/admin/social/campaigns' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/social/settings' },
                { label: 'Social Accounts', icon: Users, path: '/admin/social/accounts' },
            ]
        }
    ];
