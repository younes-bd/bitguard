import {
    Award, BarChart3, LayoutDashboard, Settings,
    Users
} from 'lucide-react';

export const referralsMenu = [
        {
            title: 'Referrals',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/referrals' },
                { label: 'Ongoing Referrals', icon: Users, path: '/admin/referrals/ongoing' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Analytics', icon: BarChart3, path: '/admin/referrals/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/referrals/settings' },
                { label: 'Rewards', icon: Award, path: '/admin/referrals/rewards' },
            ]
        }
    ];
