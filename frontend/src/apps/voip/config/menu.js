import React from 'react';
import { PhoneCall } from 'lucide-react';

export const voipManifest = {
    techName: 'voip',
    displayName: 'VoIP',
    commandCenterSection: 'Productivity',
    commandCenterOrder: 99,
    hasSettings: false,
    icon: 'PhoneCall',
};

export const voipMenu = [
    {
        title: 'Overview',
        items: [
            {
                label: 'Dashboard',
        path: '',
        icon: PhoneCall,
            }
        ]
    }
];
