import React from 'react';
import { PenTool } from 'lucide-react';

export const studioManifest = {
    techName: 'studio',
    displayName: 'Studio',
    commandCenterSection: 'Productivity',
    commandCenterOrder: 99,
    hasSettings: false,
    icon: 'PenTool',
};

export const studioMenu = [
    {
        title: 'Overview',
        items: [
            {
                label: 'Dashboard',
        path: '',
        icon: PenTool,
            }
        ]
    }
];
