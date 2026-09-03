import React from 'react';
import { Cpu } from 'lucide-react';

export const iotManifest = {
    techName: 'iot',
    displayName: 'IoT',
    commandCenterSection: 'Productivity',
    commandCenterOrder: 99,
    hasSettings: false,
    icon: 'Cpu',
};

export const iotMenu = [
    {
        title: 'Overview',
        items: [
            {
                label: 'Dashboard',
        path: '',
        icon: Cpu,
            }
        ]
    }
];
