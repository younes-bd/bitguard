import { Grid, LayoutTemplate, RefreshCw } from 'lucide-react';

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
