import { LayoutDashboard, Settings } from 'lucide-react';

export const amazonManifest = {
    techName: 'amazon',
    displayName: 'Amazon Connector',
    commandCenterSection: 'Sales',
    commandCenterOrder: 6,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const amazonMenu = [
    {
        title: 'Amazon Connector',
        items: [
            { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/amazon' }
        ]
    }
];
