import React from 'react';
import { Layers } from 'lucide-react';

export const consolidationManifest = {
    techName: 'consolidation',
    displayName: 'Consolidation',
    commandCenterSection: 'Finance',
    commandCenterOrder: 99,
    hasSettings: false,
    icon: 'Layers',
};

export const consolidationMenu = [
    {
        title: 'Overview',
        items: [
            {
                label: 'Dashboard',
        path: '',
        icon: Layers,
            }
        ]
    }
];
