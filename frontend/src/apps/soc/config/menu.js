import {
    Activity, AlertCircle, BarChart3, Bug,
    Cloud, FileText, FileWarning, LayoutDashboard,
    Mail, Scale, Server, Shield,
    ShieldCheck, Wifi
} from 'lucide-react';

// SOC sidebar menu — auto-discovered by BackendRoutes glob: apps/*/config/menu.js
export const socMenu = [
    {
        title: 'Overview',
        items: [
            { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/soc' },
        ]
    },
    {
        title: 'Threat Management',
        items: [
            { label: 'Alerts', icon: AlertCircle, path: '/admin/soc/alerts' },
            { label: 'Incidents', icon: ShieldCheck, path: '/admin/soc/incidents' },
            { label: 'Vulnerabilities', icon: Bug, path: '/admin/soc/vulnerabilities' },
            { label: 'Threat Intel', icon: Activity, path: '/admin/soc/intel' },
        ]
    },
    {
        title: 'Security Controls',
        items: [
            { label: 'Network Security', icon: Wifi, path: '/admin/soc/network' },
            { label: 'Email Security', icon: Mail, path: '/admin/soc/email' },
            { label: 'Cloud Security', icon: Cloud, path: '/admin/soc/cloud' },
            { label: 'Remote Support', icon: Server, path: '/admin/soc/remote' },
        ]
    },
    {
        title: 'Compliance & Risk',
        items: [
            { label: 'Security Gaps', icon: FileWarning, path: '/admin/soc/gaps' },
            { label: 'Risk Register', icon: Scale, path: '/admin/soc/risks' },
            { label: 'Compliance', icon: FileText, path: '/admin/soc/compliance' },
        ]
    },
    {
        title: 'Audit',
        items: [
            { label: 'Log Analysis', icon: BarChart3, path: '/admin/soc/logs' },
            { label: 'Assets', icon: Shield, path: '/admin/soc/maintenance' },
        ]
    },
];
