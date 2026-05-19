import client from './client';

class SupportService {
    async getTickets(params = {}) {
        const response = await client.get('support/tickets/', { params });
        return response.data?.data ?? response.data;
    }

    async getTicket(id) {
        const response = await client.get(`support/tickets/${id}/`);
        return response.data?.data ?? response.data;
    }

    async createTicket(data) {
        const response = await client.post('support/tickets/', data);
        return response.data?.data ?? response.data;
    }

    async updateTicket(id, data) {
        const response = await client.put(`support/tickets/${id}/`, data);
        return response.data?.data ?? response.data;
    }

    async resolveTicket(id) {
        const response = await client.post(`support/tickets/${id}/resolve/`);
        return response.data?.data ?? response.data;
    }
 
    async assignTicket(id, userId) {
        const response = await client.patch(`support/tickets/${id}/`, { assigned_to: userId });
        return response.data?.data ?? response.data;
    }

    async deleteTicket(id) {
        const response = await client.delete(`support/tickets/${id}/`);
        return response.data?.data ?? response.data;
    }

    async addMessage(id, body) {
        const response = await client.post(`support/tickets/${id}/add_message/`, { body });
        return response.data?.data ?? response.data;
    }

    async getArticles(params = {}) {
        const response = await client.get('support/articles/', { params });
        return response.data?.data ?? response.data;
    }

    async createArticle(data) {
        const response = await client.post('support/articles/', data);
        return response.data?.data ?? response.data;
    }

    async updateArticle(id, data) {
        const response = await client.put(`support/articles/${id}/`, data);
        return response.data?.data ?? response.data;
    }

    async deleteArticle(id) {
        const response = await client.delete(`support/articles/${id}/`);
        return response.data?.data ?? response.data;
    }

    async createKbFromTicket(id) {
        const response = await client.post(`support/tickets/${id}/create_kb_from_ticket/`);
        return response.data?.data ?? response.data;
    }

    async linkArticle(id, articleId) {
        const response = await client.post(`support/tickets/${id}/link_article/`, { article_id: articleId });
        return response.data?.data ?? response.data;
    }

    async getSlaBreaches(params = {}) {
        const response = await client.get('contracts/sla-breaches/', { params });
        return response.data?.data ?? response.data;
    }

    async acknowledgeBreach(id) {
        const response = await client.patch(`contracts/sla-breaches/${id}/`, { acknowledged: true });
        return response.data?.data ?? response.data;
    }
}

export const supportService = new SupportService();
export default supportService;
