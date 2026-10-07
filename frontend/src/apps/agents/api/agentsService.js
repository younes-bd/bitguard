import apiClient from '../../../core/api/client';

export const agentsService = {
    // Agents
    getAgents:    ()           => apiClient.get('/agents/profiles/'),
    getAgent:     (id)         => apiClient.get(`/agents/profiles/${id}/`),
    createAgent:  (data)       => apiClient.post('/agents/profiles/', data),
    updateAgent:  (id, data)   => apiClient.patch(`/agents/profiles/${id}/`, data),
    deleteAgent:  (id)         => apiClient.delete(`/agents/profiles/${id}/`),

    // Run / Stats
    runAgent: (id, prompt) => apiClient.post(`/agents/profiles/${id}/run/`, { prompt }),
    getStats: ()           => apiClient.get('/agents/profiles/stats/'),

    // Logs
    getLogs:      (params)          => apiClient.get('/agents/logs/', { params }),
    getAgentLogs: (agentId, params) => apiClient.get('/agents/logs/', { params: { agent: agentId, ...params } }),

    // AI Engine Usage & Settings (ai_engine stays headless — endpoints unchanged)
    getUsage:         (params)   => apiClient.get('/ai_engine/logs/', { params }),
    getAISettings:    ()         => apiClient.get('/ai_engine/settings/'),
    updateAISettings: (id, data) => apiClient.patch(`/ai_engine/settings/${id}/`, data),
    createAISettings: (data)     => apiClient.post('/ai_engine/settings/', data),
};
