import { Terminal, Webhook } from 'lucide-react';

export const getSettingsMenu = () => [
    {
        title: 'Automation',
        items: [
            { label: 'Automated Actions', icon: Terminal, path: '/admin/settings/automated-actions' },
        ]
    }
];

export const settingsMenu = [
    { section: 'Technical', label: 'Automated Actions', icon: Terminal, path: '/admin/settings/automated-actions' },
    { section: 'Technical', label: 'Webhooks', icon: Webhook, path: '/admin/settings/webhooks' },
];
