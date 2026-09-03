import apiClient from '../../../core/api/client';

export const aiAgentService = {
    // Agents
    getAgents: () => apiClient.get('/ai_agent/profiles/'),
    getAgent: (id) => apiClient.get('/ai_agent/profiles/' + id + '/'),
    createAgent: (data) => apiClient.post('/ai_agent/profiles/', data),
    updateAgent: (id, data) => apiClient.patch('/ai_agent/profiles/' + id + '/', data),
    deleteAgent: (id) => apiClient.delete('/ai_agent/profiles/' + id + '/'),

    // Run / Stats
    runAgent: (id, prompt) => apiClient.post('/ai_agent/profiles/' + id + '/run/', { prompt }),
    getStats: () => apiClient.get('/ai_agent/profiles/stats/'),

    // Logs
    getLogs: (params) => apiClient.get('/ai_agent/logs/', { params }),
    getAgentLogs: (agentId, params) => apiClient.get('/ai_agent/logs/', { params: { agent: agentId, ...params } }),

    // AI Engine Usage
    getUsage: (params) => apiClient.get('/ai_engine/logs/', { params }),

    // AI Engine Settings
    getAISettings: () => apiClient.get('/ai_engine/settings/'),
    saveAISettings: (id, data) => apiClient.patch('/ai_engine/settings/' + id + '/', data),
    createAISettings: (data) => apiClient.post('/ai_engine/settings/', data),
};
