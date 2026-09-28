import client from '@/core/api/client';

export const webhookService = {
    getWebhooks: () => client.get('automation/webhook-endpoints/'),
    createWebhook: (data) => client.post('automation/webhook-endpoints/', data),
    deleteWebhook: (id) => client.delete(`automation/webhook-endpoints/${id}/`),
    testWebhook: (id) => client.post(`automation/webhook-endpoints/${id}/test/`)
};
