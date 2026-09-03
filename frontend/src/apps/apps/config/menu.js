import { Grid, RefreshCw, LayoutTemplate, Briefcase, Calculator, ShoppingCart, Truck, Wrench, Globe, Megaphone, Users, Activity, Settings, List } from 'lucide-react';

export const appsManifest = {
    techName: 'apps',
    displayName: 'Apps',
    commandCenterSection: 'Administration',
    commandCenterOrder: 1,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const appsMenu = [
    {
        title: 'App Store',
        items: [
            { label: 'Apps', icon: Grid, path: '/admin/apps' },
            { label: 'Updates', icon: RefreshCw, path: '/admin/apps/updates' },
            { label: 'Themes', icon: LayoutTemplate, path: '/admin/apps/themes' },
        ]
    }
];
