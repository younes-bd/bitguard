import client from './client';

const reportingService = {
    // Templates
    getTemplates: async () => {
        const response = await client.get('/reporting/templates/');
        return response.data;
    },
    
    getTemplate: async (id) => {
        const response = await client.get(`/reporting/templates/${id}/`);
        return response.data;
    },
    
    createTemplate: async (data) => {
        const response = await client.post('/reporting/templates/', data);
        return response.data;
    },
    
    updateTemplate: async (id, data) => {
        const response = await client.patch(`/reporting/templates/${id}/`, data);
        return response.data;
    },
    
    deleteTemplate: async (id) => {
        const response = await client.delete(`/reporting/templates/${id}/`);
        return response.data;
    },
    
    previewTemplate: async (id, sampleData) => {
        const response = await client.post(`/reporting/templates/${id}/preview/`, { sample_data: sampleData });
        return response.data;
    },

    // Generated Reports
    getGeneratedReports: async () => {
        const response = await client.get('/reporting/generated/');
        return response.data;
    },
    
    generateReport: async (templateId, recordModel, recordId) => {
        const response = await client.post('/reporting/generated/generate/', {
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
        const response = await client.get('/reporting/settings/');
        return response.data;
    },
    
    updateSettings: async (id, data) => {
        const response = await client.patch(`/reporting/settings/${id}/`, data);
        return response.data;
    },
    
    createSettings: async (data) => {
        const response = await client.post('/reporting/settings/', data);
        return response.data;
    }
};

export default reportingService;
