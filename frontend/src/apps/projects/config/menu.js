import {
    Activity, FileText, FolderKanban, GitBranch,
    Layers, Layout, PieChart, Settings,
    Tag, Tags
} from 'lucide-react';

export const projectsMenu = [
        {
            title: 'Project',
            items: [
                { label: 'Projects', icon: FolderKanban, path: '/admin/projects/list' },
                { label: 'Tasks', icon: Layout, path: '/admin/projects/kanban' },
                { label: 'Updates', icon: Activity, path: '/admin/projects/updates' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Task Analysis', icon: PieChart, path: '/admin/projects/reports' },
                { label: 'Burndown Chart', icon: Activity, path: '/admin/projects/burndown' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/projects/settings' },
                { label: 'Project Stages', icon: Layers, path: '/admin/projects/stages/project' },
                { label: 'Task Stages', icon: GitBranch, path: '/admin/projects/stages/task' },
                { label: 'Project Templates', icon: FileText, path: '/admin/projects/templates' },
                { label: 'Activity Types', icon: Activity, path: '/admin/projects/activity-types' },
                { label: 'Tags', icon: Tag, path: '/admin/projects/tags' },
            ]
        }
    ];
