import {
    Activity, Clock, FolderKanban, Key,
    Settings, ShieldCheck, Users
} from 'lucide-react';

export const planningMenu = [
        {
            title: 'Schedule',
            items: [
                { label: 'My Planning', icon: Clock, path: '/admin/planning/my-planning' },
                { label: 'Open Shifts', icon: Users, path: '/admin/planning/open-shifts' },
                { label: 'By Employee', icon: Users, path: '/admin/planning/schedule/employee' },
                { label: 'By Role', icon: Key, path: '/admin/planning/schedule/role' },
                { label: 'By Project', icon: FolderKanban, path: '/admin/planning/schedule/project' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Planning Analysis', icon: Activity, path: '/admin/planning/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/planning/settings' },
                { label: 'Roles', icon: ShieldCheck, path: '/admin/planning/roles' },
            ]
        }
    ];
