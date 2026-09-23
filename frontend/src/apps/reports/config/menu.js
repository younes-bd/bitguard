import { FileText, Tag } from 'lucide-react';

export const getSettingsMenu = () => [
    {
        title: 'Reports',
        items: [
            { label: 'Reports', icon: FileText, path: '/admin/settings/reports' },
            { label: 'Report Tags', icon: Tag, path: '/admin/settings/report-tags' },
            { label: 'Print Formats', icon: FileText, path: '/admin/settings/print-formats' },
        ]
    }
];
