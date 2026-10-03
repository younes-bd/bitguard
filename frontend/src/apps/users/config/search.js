
import { Users } from 'lucide-react';
import { usersService } from '../api/usersService';

export const getSearchProviders = () => [
    {
        name: 'iam_users',
        handler: async (q) => {
            const results = await usersService.getUsers({ search: q }).catch(() => []);
            return results.slice(0, 3).map(u => ({ 
                id: u.id, 
                title: u.email, 
                type: 'User', 
                icon: Users, 
                path: `/admin/iam/users/${u.id}` 
            }));
        }
    }
];
