import {
    BookOpen, FolderOpen, Settings, Tag,
    Tags
} from 'lucide-react';

export const blogMenu = [
        {
            title: 'Blog',
            items: [
                { label: 'Posts', icon: BookOpen, path: '/admin/blog' },
                { label: 'Tags', icon: Tag, path: '/admin/blog/tags' },
                { label: 'Blogs', icon: FolderOpen, path: '/admin/blog/categories' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/blog/settings' },
            ]
        }
    ];
