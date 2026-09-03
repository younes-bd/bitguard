import { LayoutDashboard, Settings } from 'lucide-react';

export const frontdeskManifest = {
    techName: 'frontdesk',
    displayName: 'Frontdesk',
    commandCenterSection: 'Human Resources',
    commandCenterOrder: 5,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const frontdeskMenu = [
    {
        title: 'Frontdesk',
        items: [
            { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/frontdesk' }
        ]
    }
];
