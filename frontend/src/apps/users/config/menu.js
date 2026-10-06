import { Building2, Key, Users } from 'lucide-react';

export const usersMenu = [
    {
        title: 'Users & Companies',
        items: [
            { label: 'Users', icon: Users, path: '/admin/users/users' },
            { label: 'Companies', icon: Building2, path: '/admin/users/tenants' },
            { label: 'Groups', icon: Key, path: '/admin/users/roles' },
        ]
    }
];
