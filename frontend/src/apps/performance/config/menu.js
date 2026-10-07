import {
    BarChart3, FileText, Layers, LayoutDashboard,
    Settings
} from 'lucide-react';

export const appraisalsMenu = [
        {
            title: 'Appraisals',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/appraisals' },
                { label: 'Appraisals', icon: FileText, path: '/admin/appraisals/list' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Analytics', icon: BarChart3, path: '/admin/appraisals/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/appraisals/settings' },
                { label: 'Evaluation Templates', icon: Layers, path: '/admin/appraisals/templates' },
            ]
        }
    ];
