import { FileText, MessageCircle, Settings, Users } from 'lucide-react';

export const whatsappMenu = [
        {
            title: 'WhatsApp',
            items: [
                { label: 'Chats', icon: MessageCircle, path: '/admin/whatsapp' },
                { label: 'Templates', icon: FileText, path: '/admin/whatsapp/templates' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/whatsapp/settings' },
                { label: 'Accounts', icon: Users, path: '/admin/whatsapp/accounts' },
            ]
        }
    ];
