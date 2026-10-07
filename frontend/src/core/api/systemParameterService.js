import client from './client';

export const systemParameterService = {
    getParameters: async () => {
        const res = await client.get('base/parameters/');
        return res.data?.results || res.data || [];
    },
    getParameter: async (id) => {
        const res = await client.get(`base/parameters/${id}/`);
        return res.data;
    },
    createParameter: async (data) => {
        return await client.post('base/parameters/', data);
    },
    updateParameter: async (id, data) => {
        return await client.put(`base/parameters/${id}/`, data);
    },
    deleteParameter: async (id) => {
        return await client.delete(`base/parameters/${id}/`);
    }
};
