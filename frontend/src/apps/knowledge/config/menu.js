import {
    FileText, Layers, Settings, Tag,
    Tags
} from 'lucide-react';

export const knowledgeMenu = [
        {
            title: 'Knowledge',
            items: [
                { label: 'Articles', icon: FileText, path: '/admin/knowledge' },
                { label: 'Workspaces', icon: Layers, path: '/admin/knowledge/workspaces' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/knowledge/settings' },
                { label: 'Tags', icon: Tag, path: '/admin/knowledge/tags' },
            ]
        }
    ];
