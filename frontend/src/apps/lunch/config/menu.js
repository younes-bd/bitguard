import React from 'react';
import { Utensils } from 'lucide-react';

export const lunchManifest = {
    techName: 'lunch',
    displayName: 'Lunch',
    commandCenterSection: 'Human Resources',
    commandCenterOrder: 99,
    hasSettings: false,
    icon: 'Utensils',
};

export const lunchMenu = [
    {
        title: 'Overview',
        items: [
            {
                label: 'Dashboard',
        path: '',
        icon: Utensils,
            }
        ]
    }
];
