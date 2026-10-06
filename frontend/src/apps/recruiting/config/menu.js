import {
    Activity, AlertCircle, FolderKanban, Layers,
    Settings, Users
} from 'lucide-react';

export const recruitmentMenu = [
        {
            title: 'Applications',
            items: [
                { label: 'Job Positions', icon: FolderKanban, path: '/admin/recruitment' },
                { label: 'All Applications', icon: Users, path: '/admin/recruitment/applications' }
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Recruitment Analysis', icon: Activity, path: '/admin/recruitment/reports' }
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/recruitment/settings' },
                { label: 'Job Positions', icon: FolderKanban, path: '/admin/recruitment/jobs' },
                { label: 'Refuse Reasons', icon: AlertCircle, path: '/admin/recruitment/refuse-reasons' },
                { label: 'Departments', icon: Layers, path: '/admin/recruitment/departments' },
                { label: 'Activity Types', icon: Activity, path: '/admin/recruitment/activity-types' }
            ]
        }
    ];
