import client from './client';

export const systemParameterService = {
    getParameters: async () => {
        const res = await client.get('/core/parameters/');
        return res.data?.results || res.data || [];
    },
    getParameter: async (id) => {
        const res = await client.get(`/core/parameters/${id}/`);
        return res.data;
    },
    createParameter: async (data) => {
        return await client.post('/core/parameters/', data);
    },
    updateParameter: async (id, data) => {
        return await client.put(`/core/parameters/${id}/`, data);
    },
    deleteParameter: async (id) => {
        return await client.delete(`/core/parameters/${id}/`);
    }
};
