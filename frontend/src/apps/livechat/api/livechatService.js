import api from '../../../core/api/client';

export const livechatService = {
    getSessions: async () => {
        const response = await api.get('/api/v1/discuss/channels/');
        return response.data;
    },
    
    sendMessage: async (channelId, message) => {
        const response = await api.post(`/api/v1/discuss/channels/${channelId}/messages/`, { message });
        return response.data;
    }
};

export default livechatService;
