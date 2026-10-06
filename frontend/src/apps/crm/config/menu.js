import {
    Activity, AlertCircle, Calendar, Database,
    FileText, Settings, TrendingUp, Users
} from 'lucide-react';

export const crmMenu = [
        {
            title: 'Sales',
            items: [
                { label: 'My Pipeline', icon: Activity, path: '/admin/crm/pipeline' },
                { label: 'My Activities', icon: Calendar, path: '/admin/crm/activities' },
                { label: 'My Quotations', icon: FileText, path: '/admin/crm/quotations' },
            ]
        },
        {
            title: 'Leads',
            items: [
                { label: 'Leads', icon: Users, path: '/admin/crm/leads' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Forecast', icon: TrendingUp, path: '/admin/crm/forecast' },
                { label: 'Pipeline', icon: Activity, path: '/admin/crm/reports' },
                { label: 'Leads', icon: Users, path: '/admin/crm/leads-report' },
                { label: 'Activities', icon: Calendar, path: '/admin/crm/activities-report' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/crm/settings' },
                { label: 'Sales Teams', icon: Users, path: '/admin/crm/teams' },
                { label: 'Lead Mining Requests', icon: Database, path: '/admin/crm/mining' },
                { label: 'Lost Reasons', icon: AlertCircle, path: '/admin/crm/lost-reasons' },
                { label: 'Pipeline', icon: Activity, path: '/admin/crm/pipeline-settings' },
            ]
        }
    ];
