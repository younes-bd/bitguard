import {
    FileText, FolderOpen, Layers, LayoutDashboard,
    Settings, ShieldCheck, Users
} from 'lucide-react';

export const signMenu = [
        {
            title: 'Dashboard',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/sign' },
            ]
        },
        {
            title: 'Signature Requests',
            items: [
                { label: 'Signature Requests', icon: FileText, path: '/admin/sign/requests' },
            ]
        },
        {
            title: 'Documents',
            items: [
                { label: 'Documents', icon: FolderOpen, path: '/admin/sign/documents' },
            ]
        },
        {
            title: 'Templates',
            items: [
                { label: 'Templates', icon: Layers, path: '/admin/sign/templates' },
            ]
        },
        {
            title: 'Contacts',
            items: [
                { label: 'Contacts', icon: Users, path: '/admin/sign/contacts' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/sign/settings' },
                { label: 'Roles', icon: ShieldCheck, path: '/admin/sign/roles' },
            ]
        }
    ];
