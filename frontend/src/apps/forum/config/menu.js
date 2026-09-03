import React from 'react';
import { MessageCircle } from 'lucide-react';

export const forumManifest = {
    techName: 'forum',
    displayName: 'Forum',
    commandCenterSection: 'Website',
    commandCenterOrder: 99,
    hasSettings: false,
    icon: 'MessageCircle',
};

export const forumMenu = [
    {
        title: 'Overview',
        items: [
            {
                label: 'Dashboard',
        path: '',
        icon: MessageCircle,
            }
        ]
    }
];
