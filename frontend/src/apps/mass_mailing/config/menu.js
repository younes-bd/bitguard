import React from 'react';
import { Mail } from 'lucide-react';

export const mass_mailingManifest = {
    techName: 'mass_mailing',
    displayName: 'Email Marketing',
    commandCenterSection: 'Marketing',
    commandCenterOrder: 99,
    hasSettings: false,
    icon: 'Mail',
};

export const mass_mailingMenu = [
    {
        title: 'Overview',
        items: [
            {
                label: 'Dashboard',
        path: '',
        icon: Mail,
            }
        ]
    }
];
