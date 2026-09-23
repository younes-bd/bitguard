import { Settings, Users, ShieldCheck, Building2, Globe, Server, Layers, Layout, Database, Key, Clock, Terminal, Upload, Download, Webhook, Bot } from 'lucide-react';

export const getSettingsMenu = (settingsAppEntries = []) => [
        {
            title: 'General Settings',
            items: [
                { label: 'General Settings', icon: Settings, path: '/admin/settings/general' },
            ]
        },
        {
            title: 'Users & Companies',
            items: [
                { label: 'Users', icon: Users, path: '/admin/settings/users' },
                { label: 'Companies', icon: Building2, path: '/admin/settings/companies' },
                { label: 'User Groups', icon: ShieldCheck, path: '/admin/settings/groups' },
                { label: 'Security Policy', icon: ShieldCheck, path: '/admin/settings/security-policy' },
            ]
        },
        {
            title: 'Translations',
            items: [
                { label: 'Languages', icon: Globe, path: '/admin/settings/languages' },
                { label: 'Export Translations', icon: Upload, path: '/admin/settings/translations-export' },
                { label: 'Import Translations', icon: Download, path: '/admin/settings/translations-import' },
            ]
        },
        {
            title: 'Technical',
            items: [
                { label: 'Access Rights', icon: Key, path: '/admin/settings/access-rights' },
                { label: 'Record Rules', icon: Database, path: '/admin/settings/record-rules' },
                { label: 'System Parameters', icon: Settings, path: '/admin/settings/parameters' },
                { label: 'Scheduled Actions', icon: Clock, path: '/admin/settings/scheduled-actions' },
                { label: 'Sequences', icon: Layers, path: '/admin/settings/sequences' },
                { label: 'Menu Sequences', icon: Layout, path: '/admin/settings/menu-sequences' },
                { label: 'Audit Logs', icon: ShieldCheck, path: '/admin/settings/logs' },
                { label: 'Server Logs', icon: Terminal, path: '/admin/settings/server-logs' },
                { label: 'Backup & Restore', icon: Database, path: '/admin/settings/backups' },
                { label: 'Webhooks', icon: Webhook, path: '/admin/settings/webhooks' },
                { label: 'Integration Keys', icon: Key, path: '/admin/settings/integration-keys' },
                { label: 'Virtual Agents', icon: Bot, path: '/admin/settings/virtual-agents', permissions: ['is_admin'] },
            ]
        }
    ];

export const settingsMenu = getSettingsMenu([]);
