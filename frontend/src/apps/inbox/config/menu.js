import { Inbox, Send, FileText, AtSign, Bell, Server, MessageCircle } from 'lucide-react';

export const getSettingsMenu = () => [
    {
        title: 'Email',
        items: [
            { label: 'Inbox', icon: Bell, path: '/admin/settings/inbox' },
            { label: 'Outgoing Mail Servers', icon: Send, path: '/admin/settings/outgoing-mail-servers' },
            { label: 'Incoming Mail Servers', icon: Inbox, path: '/admin/settings/incoming-mail-servers' },
            { label: 'Email Templates', icon: FileText, path: '/admin/settings/email-templates' },
            { label: 'Mail Aliases', icon: AtSign, path: '/admin/settings/mail-aliases' },
        ]
    }
];

export const settingsMenu = [
    { section: 'Email / Discuss', label: 'Outgoing Mail Servers', icon: Server, path: '/admin/settings/outgoing-mail' },
    { section: 'Email / Discuss', label: 'Incoming Mail Servers', icon: Server, path: '/admin/settings/incoming-mail' },
    { section: 'Email / Discuss', label: 'Email Templates', icon: FileText, path: '/admin/settings/email-templates' },
    { section: 'Email / Discuss', label: 'Channels', icon: MessageCircle, path: '/admin/settings/channels' },
];
