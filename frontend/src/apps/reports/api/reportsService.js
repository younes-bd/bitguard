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

    // Paper Formats
    getPaperFormats: async () => {
        const response = await client.get('/reports/paper-formats/');
        return response.data;
    },
    
    getPaperFormat: async (id) => {
        const response = await client.get(`/reports/paper-formats/${id}/`);
        return response.data;
    },
    
    createPaperFormat: async (data) => {
        const response = await client.post('/reports/paper-formats/', data);
        return response.data;
    },
    
    updatePaperFormat: async (id, data) => {
        const response = await client.patch(`/reports/paper-formats/${id}/`, data);
        return response.data;
    },

    deletePaperFormat: async (id) => {
        const response = await client.delete(`/reports/paper-formats/${id}/`);
        return response.data;
    }
};

export default reportsService;
export { reportsService };
