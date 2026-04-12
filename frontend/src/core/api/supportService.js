import client from './client';

class SupportService {
    async getTickets(params = {}) {
        const response = await client.get('support/tickets/', { params });
        return response.data.data;
    }

    async getTicket(id) {
        const response = await client.get(`support/tickets/${id}/`);
        return response.data.data;
    }

    async createTicket(data) {
        const response = await client.post('support/tickets/', data);
        return response.data.data;
    }

    async updateTicket(id, data) {
        const response = await client.put(`support/tickets/${id}/`, data);
        return response.data.data;
    }

    async resolveTicket(id) {
        const response = await client.post(`support/tickets/${id}/resolve/`);
        return response.data.data;
    }
 
    async assignTicket(id, userId) {
        const response = await client.patch(`support/tickets/${id}/`, { assigned_to: userId });
        return response.data.data;
    }

    async deleteTicket(id) {
        const response = await client.delete(`support/tickets/${id}/`);
        return response.data.data;
    }

    async addMessage(id, body) {
        const response = await client.post(`support/tickets/${id}/add_message/`, { body });
        return response.data.data;
    }

    async getArticles(params = {}) {
        const response = await client.get('support/articles/', { params });
        return response.data.data;
    }
}

export default new SupportService();
