import { Building2, FolderOpen, Settings, Tags } from 'lucide-react';

export const documentsMenu = [
        {
            title: 'Documents',
            items: [
                { label: 'Workspace', icon: FolderOpen, path: '/admin/documents' },
                { label: 'Folders', icon: Building2, path: '/admin/documents/workspaces' },
                { label: 'Tags', icon: Tags, path: '/admin/documents/tags' },
                { label: 'Configuration', icon: Settings, path: '/admin/documents/settings' },
            ]
        }
    ];
