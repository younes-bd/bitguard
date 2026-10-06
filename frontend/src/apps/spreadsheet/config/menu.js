import { FileText, LayoutDashboard, Settings } from 'lucide-react';

export const spreadsheetMenu = [
        {
            title: 'Spreadsheet',
            items: [
                { label: 'Dashboards', icon: LayoutDashboard, path: '/admin/spreadsheet' },
                { label: 'Documents', icon: FileText, path: '/admin/spreadsheet/documents' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/spreadsheet/settings' },
            ]
        }
    ];
