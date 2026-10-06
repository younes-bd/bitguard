import {
    Building2, FileText, MessageCircle, MessageSquare,
    PhoneCall, Users
} from 'lucide-react';

export const discussMenu = [
        {
            title: 'Discuss',
            items: [
                { label: 'Inbox', icon: MessageSquare, path: '/admin/discuss' },
                { label: 'Channels', icon: MessageCircle, path: '/admin/discuss/channels' },
                { label: 'Direct Messages', icon: Users, path: '/admin/discuss/dm' },
            ]
        },
        {
            title: 'WhatsApp',
            items: [
                { label: 'Conversations', icon: PhoneCall, path: '/admin/discuss/whatsapp' },
                { label: 'Accounts', icon: Building2, path: '/admin/discuss/whatsapp/accounts' },
                { label: 'Message Templates', icon: FileText, path: '/admin/discuss/whatsapp/templates' },
            ]
        }
    ];
