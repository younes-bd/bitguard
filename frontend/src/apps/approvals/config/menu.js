import { LayoutDashboard, Settings } from 'lucide-react';

export const approvalsMenu = [
        {
            title: 'Approvals',
            items: [
                { label: 'My Approvals', icon: LayoutDashboard, path: '/admin/approvals' },
                { label: 'Configuration', icon: Settings, path: '/admin/approvals/settings' },
            ]
        }
    ];
