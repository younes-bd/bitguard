import client from '../../../shared/core/services/client';

export const ticketService = {
    createTicket: async (data) => {
        const response = await client.post('crm/tickets/', data);
        return response.data;
    },
    getTickets: async () => {
        const response = await client.get('crm/tickets/');
        return response.data;
    },
    getTicketTypes: () => {
        return [
            { id: 'support', label: 'General Support' },
            { id: 'incident', label: 'Security Incident' },
            { id: 'access', label: 'Access Request' },
            { id: 'billing', label: 'Billing Inquery' }
        ];
    }
};
