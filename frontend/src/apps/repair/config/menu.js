import React from 'react';
import { Wrench } from 'lucide-react';

export const repairManifest = {
    techName: 'repair',
    displayName: 'Repairs',
    commandCenterSection: 'Inventory & MRP',
    commandCenterOrder: 99,
    hasSettings: false,
    icon: 'Wrench',
};

export const repairMenu = [
    {
        title: 'Overview',
        items: [
            {
                label: 'Dashboard',
        path: '',
        icon: Wrench,
            }
        ]
    }
];
