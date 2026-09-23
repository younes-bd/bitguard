import React from 'react';
import { Mail, Users, List, Settings } from 'lucide-react';

export const campaignsMenu = [
    {
        title: 'Mailings',
        items: [
            {
                label: 'Campaigns',
                path: '',
                icon: Mail,
            }
        ]
    },
    {
        title: 'Mailing Lists',
        items: [
            {
                label: 'Mailing Lists',
                path: 'lists',
                icon: List,
            },
            {
                label: 'Contacts',
                path: 'contacts',
                icon: Users,
            }
        ]
    },
    {
        title: 'Configuration',
        items: [
            {
                label: 'Settings',
                path: 'settings',
                icon: Settings,
            }
        ]
    }
];
