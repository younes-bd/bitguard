import { Terminal } from 'lucide-react';

export const getSettingsMenu = () => [
    {
        title: 'Automation',
        items: [
            { label: 'Automated Actions', icon: Terminal, path: '/admin/settings/automated-actions' },
        ]
    }
];
