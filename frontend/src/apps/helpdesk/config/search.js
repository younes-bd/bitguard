
import { Ticket } from 'lucide-react';
import { helpdeskService } from '../api/helpdeskService';

export const getSearchProviders = () => [
    {
        name: 'helpdesk_tickets',
        handler: async (q) => {
            const results = await helpdeskService.getTickets({ search: q }).catch(() => []);
            return results.slice(0, 3).map(t => ({ 
                id: t.id, 
                title: t.subject, 
                type: 'Ticket', 
                icon: Ticket, 
                path: `/admin/helpdesk/tickets/${t.id}` 
            }));
        }
    }
];
