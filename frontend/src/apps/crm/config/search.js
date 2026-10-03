
import { FileText } from 'lucide-react';
import { crmService } from '../api/crmService';

export const getSearchProviders = () => [
    {
        name: 'crm_clients',
        handler: async (q) => {
            const results = await crmService.getClients({ search: q }).catch(() => []);
            return results.slice(0, 3).map(c => ({ 
                id: c.id, 
                title: c.name, 
                type: 'Client', 
                icon: FileText, 
                path: `/admin/crm/clients/${c.id}` 
            }));
        }
    }
];
