import { LayoutDashboard, Settings } from 'lucide-react';

export const todoManifest = {
    techName: 'todo',
    displayName: 'To-Do',
    commandCenterSection: 'Productivity',
    commandCenterOrder: 2,
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
};

export const todoMenu = [
    {
        title: 'To-Do',
        items: [
            { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/todo' }
        ]
    }
];
