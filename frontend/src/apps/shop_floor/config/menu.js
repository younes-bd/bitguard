import { LayoutDashboard, Settings } from 'lucide-react';

export const shop_floorManifest = {
    techName: 'shop_floor',
    displayName: 'Shop Floor',
    commandCenterSection: 'Manufacturing',
    commandCenterOrder: 2,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const shop_floorMenu = [
    {
        title: 'Shop Floor',
        items: [
            { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/shop_floor' }
        ]
    }
];
