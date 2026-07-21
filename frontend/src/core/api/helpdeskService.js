import client from './client';

class HelpdeskService {
    async getTickets(params = {}) {
        const response = await client.get('helpdesk/tickets/', { params });
        return response.data?.data ?? response.data;
    }

    async getTicket(id) {
        const response = await client.get(`helpdesk/tickets/${id}/`);
        return response.data?.data ?? response.data;
    }

    async createTicket(data) {
        const response = await client.post('helpdesk/tickets/', data);
        return response.data?.data ?? response.data;
    }

    async updateTicket(id, data) {
        const response = await client.put(`helpdesk/tickets/${id}/`, data);
        return response.data?.data ?? response.data;
    }

    async resolveTicket(id) {
        const response = await client.post(`helpdesk/tickets/${id}/resolve/`);
        return response.data?.data ?? response.data;
    }
 
    async assignTicket(id, userId) {
        const response = await client.post(`helpdesk/tickets/${id}/assign/`, { user_id: userId });
        return response.data?.data ?? response.data;
    }

    async setTicketStage(id, stageId) {
        const response = await client.post(`helpdesk/tickets/${id}/set-stage/`, { stage_id: stageId });
        return response.data?.data ?? response.data;
    }

    async deleteTicket(id) {
        const response = await client.delete(`helpdesk/tickets/${id}/`);
        return response.data?.data ?? response.data;
    }

    async addMessage(id, body) {
        const response = await client.post(`helpdesk/tickets/${id}/add_message/`, { body });
        return response.data?.data ?? response.data;
    }

    async getArticles(params = {}) {
        const response = await client.get('helpdesk/articles/', { params });
        return response.data?.data ?? response.data;
    }

    async createArticle(data) {
        const response = await client.post('helpdesk/articles/', data);
        return response.data?.data ?? response.data;
    }

    async updateArticle(id, data) {
        const response = await client.put(`helpdesk/articles/${id}/`, data);
        return response.data?.data ?? response.data;
    }

    async deleteArticle(id) {
        const response = await client.delete(`helpdesk/articles/${id}/`);
        return response.data?.data ?? response.data;
    }

    async createKbFromTicket(id) {
        const response = await client.post(`helpdesk/tickets/${id}/create_kb_from_ticket/`);
        return response.data?.data ?? response.data;
    }

    async linkArticle(id, articleId) {
        const response = await client.post(`helpdesk/tickets/${id}/link_article/`, { article_id: articleId });
        return response.data?.data ?? response.data;
    }

    // TEAMS
    async getTeams() {
        const response = await client.get('helpdesk/teams/');
        return response.data?.data ?? response.data;
    }
    async createTeam(data) {
        const response = await client.post('helpdesk/teams/', data);
        return response.data?.data ?? response.data;
    }
    async updateTeam(id, data) {
        const response = await client.put(`helpdesk/teams/${id}/`, data);
        return response.data?.data ?? response.data;
    }
    async deleteTeam(id) {
        const response = await client.delete(`helpdesk/teams/${id}/`);
        return response.data?.data ?? response.data;
    }

    // STAGES
    async getStages() {
        const response = await client.get('helpdesk/stages/');
        return response.data?.data ?? response.data;
    }
    async createStage(data) {
        const response = await client.post('helpdesk/stages/', data);
        return response.data?.data ?? response.data;
    }
    async updateStage(id, data) {
        const response = await client.put(`helpdesk/stages/${id}/`, data);
        return response.data?.data ?? response.data;
    }
    async deleteStage(id) {
        const response = await client.delete(`helpdesk/stages/${id}/`);
        return response.data?.data ?? response.data;
    }

    // TAGS
    async getTags() {
        const response = await client.get('helpdesk/tags/');
        return response.data?.data ?? response.data;
    }
    async createTag(data) {
        const response = await client.post('helpdesk/tags/', data);
        return response.data?.data ?? response.data;
    }
    async updateTag(id, data) {
        const response = await client.put(`helpdesk/tags/${id}/`, data);
        return response.data?.data ?? response.data;
    }
    async deleteTag(id) {
        const response = await client.delete(`helpdesk/tags/${id}/`);
        return response.data?.data ?? response.data;
    }

    // SLA POLICIES
    async getSlaPolicies() {
        const response = await client.get('helpdesk/sla-policies/');
        return response.data?.data ?? response.data;
    }
    async createSlaPolicy(data) {
        const response = await client.post('helpdesk/sla-policies/', data);
        return response.data?.data ?? response.data;
    }
    async updateSlaPolicy(id, data) {
        const response = await client.put(`helpdesk/sla-policies/${id}/`, data);
        return response.data?.data ?? response.data;
    }
    async deleteSlaPolicy(id) {
        const response = await client.delete(`helpdesk/sla-policies/${id}/`);
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

export const helpdeskService = new HelpdeskService();
export default helpdeskService;
