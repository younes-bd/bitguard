import { BarChart3, Settings, Smartphone, Users } from 'lucide-react';

export const smsMenu = [
        {
            title: 'SMS Journeys',
            items: [
                { label: 'SMS Inboxings', icon: Smartphone, path: '/admin/sms/mailings' },
                { label: 'Contacts', icon: Users, path: '/admin/sms/contacts' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Analytics', icon: BarChart3, path: '/admin/sms/reports' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/sms/settings' },
            ]
        }
    ];
