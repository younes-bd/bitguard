import apiClient from '../../../core/api/client';

export const boardService = {
    getMetrics: async (params) => {
        return await apiClient.get('core/analytics/global/', { params });
    },
    getSystemHealth: async () => {
        // Core analytics already returns system_health, but if a separate health check is needed:
        return { data: { status: 'healthy', uptime: '99.99%', api_latency: '42ms' } };
    },
    getRecentActivity: async (limit = 10) => {
        return await apiClient.get('/api/v1/system/audit-logs/', { params: { limit } });
    },
    // Aggregates data from the newly decoupled endpoints
    getExecutiveSummary: async (dateRange = '30days') => {
        try {
            // We can fetch these in parallel since they are now decoupled!
            const [
                revRes, crmRes, supRes, secRes, hrRes, projRes, finRes
            ] = await Promise.all([
                apiClient.get('/api/v1/ecommerce/report/revenue/', { params: { range: dateRange } }).catch(() => ({ data: { data: null }})),
                apiClient.get('/api/v1/crm/report/metrics/', { params: { range: dateRange } }).catch(() => ({ data: { data: null }})),
                apiClient.get('/api/v1/helpdesk/report/metrics/', { params: { range: dateRange } }).catch(() => ({ data: { data: null }})),
                apiClient.get('/api/v1/soc/report/metrics/', { params: { range: dateRange } }).catch(() => ({ data: { data: null }})),
                apiClient.get('/api/v1/hr/report/metrics/', { params: { range: dateRange } }).catch(() => ({ data: { data: null }})),
                apiClient.get('/api/v1/projects/report/metrics/', { params: { range: dateRange } }).catch(() => ({ data: { data: null }})),
                apiClient.get('/api/v1/accounting/report/metrics/', { params: { range: dateRange } }).catch(() => ({ data: { data: null }})),
            ]);

            return {
                revenue: revRes.data.data,
                crm: crmRes.data.data,
                support: supRes.data.data,
                security: secRes.data.data,
                hr: hrRes.data.data,
                projects: projRes.data.data,
                finance: finRes.data.data
            };
        } catch (error) {
            console.error('Error fetching executive summary:', error);
            throw error;
        }
    },
    
    exportReport: async (type) => {
        const endpointMap = {
            'revenue': '/api/v1/ecommerce/report/export/',
            'crm': '/api/v1/crm/report/export/',
            'support': '/api/v1/helpdesk/report/export/',
            'security': '/api/v1/soc/report/export/',
            'hrm': '/api/v1/hr/report/export/',
            'invoices': '/api/v1/accounting/report/export/',
        };
        
        const url = endpointMap[type];
        if (!url) throw new Error(`Unknown export type: ${type}`);
        
        const response = await apiClient.get(url, { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${type}_export.csv`;
        link.click();
    }
};

export default boardService;
