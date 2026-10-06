import {
    AlertCircle, FileText, LayoutDashboard, PieChart,
    Server, Settings, ShieldCheck
} from 'lucide-react';

export const securityMenu = [
        {
            title: 'Security Operations Center',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/security' },
                { label: 'Alerts', icon: AlertCircle, path: '/admin/security/alerts' },
                { label: 'Incidents', icon: ShieldCheck, path: '/admin/security/incidents' },
                { label: 'Assets', icon: Server, path: '/admin/security/assets' },
                { label: 'Compliance', icon: FileText, path: '/admin/security/compliance' },
                { label: 'Logs', icon: PieChart, path: '/admin/security/logs' },
                { label: 'Settings', icon: Settings, path: '/admin/security/settings' },
            ]
        }
    ];
