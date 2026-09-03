import apiClient from '@/core/api/client';

const discussService = {
  getChannels: () => apiClient.get('/discuss/channels/').then(r => r.data),
  getMessages: (channelId, params) => apiClient.get('/discuss/messages/', { params: { channel: channelId, ...params } }).then(r => r.data),
  postMessage: (data) => apiClient.post('/discuss/messages/', data).then(r => r.data),
  createChannel: (data) => apiClient.post('/discuss/channels/', data).then(r => r.data),
  getCalendarEvents: (params) => apiClient.get('/discuss/calendarevents/', { params }).then(r => r.data),
  getLiveChatSessions: (params) => apiClient.get('/api/discuss/livechatsessions/', { params }).then(r => r.data),
  getWhatsAppMessages: (params) => apiClient.get('/api/discuss/whatsappmessages/', { params }).then(r => r.data),
  // LiveChat Configuration
  getLiveChatChannels: () => apiClient.get('/api/discuss/livechat/').then(r => r.data),
  createLiveChatChannel: (data) => apiClient.post('/api/discuss/livechat/', data).then(r => r.data),
  updateLiveChatChannel: (id, data) => apiClient.patch(`/api/discuss/livechat/${id}/`, data).then(r => r.data),
  deleteLiveChatChannel: (id) => apiClient.delete(`/api/discuss/livechat/${id}/`).then(r => r.data),
};

export default discussService;
