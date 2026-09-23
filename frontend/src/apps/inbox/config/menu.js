import { Inbox, Send, FileText, AtSign, Bell } from 'lucide-react';

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
