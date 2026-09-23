import client from '@/core/api/client';

const reportsService = {
    // Templates
    getTemplates: async () => {
        const response = await client.get('/reports/templates/');
        return response.data;
    },
    
    getTemplate: async (id) => {
        const response = await client.get(`/reports/templates/${id}/`);
        return response.data;
    },
    
    createTemplate: async (data) => {
        const response = await client.post('/reports/templates/', data);
        return response.data;
    },
    
    updateTemplate: async (id, data) => {
        const response = await client.patch(`/reports/templates/${id}/`, data);
        return response.data;
    },
    
    deleteTemplate: async (id) => {
        const response = await client.delete(`/reports/templates/${id}/`);
        return response.data;
    },
    
    previewTemplate: async (id, sampleData) => {
        const response = await client.post(`/reports/templates/${id}/preview/`, { sample_data: sampleData });
        return response.data;
    },

    // Generated Reports
    getGeneratedReports: async () => {
        const response = await client.get('/reports/generated/');
        return response.data;
    },
    
    generateReport: async (templateId, recordModel, recordId) => {
        const response = await client.post('/reports/generated/generate/', {
            template_id: templateId,
            record_model: recordModel,
            record_id: recordId
        });
        return response.data;
    },
    
    generateDocument: async (module, entity, id) => {
        // Hits the unified generate-report endpoint on the record's viewset
        const response = await client.post(`/${module}/${entity}/${id}/generate-report/`);
        return response.data;
    },

    // Settings
    getSettings: async () => {
        const response = await client.get('/reports/settings/');
        return response.data;
    },
    
    updateSettings: async (id, data) => {
        const response = await client.patch(`/reports/settings/${id}/`, data);
        return response.data;
    },
    
    createSettings: async (data) => {
        const response = await client.post('/reports/settings/', data);
        return response.data;
    }
};

export default reportsService;
export { reportsService };
