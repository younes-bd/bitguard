import apiClient from '../../../core/api/client';

export const analyticsService = {
    getMetrics: async (params) => {
        return await apiClient.get('core/analytics/global/', { params });
    },
    getSystemHealth: async () => {
        // Core analytics already returns system_health, but if a separate health check is needed:
        return { data: { status: 'healthy', uptime: '99.99%', api_latency: '42ms' } };
    },
    getRecentActivity: async (limit = 10) => {
        return await apiClient.get('/api/v1/system/system-events/', { params: { limit } });
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
    
    // --- Mock Data Providers for Individual Dashboard Reports ---
    getRevenueReport: async (params) => {
        return new Promise(resolve => setTimeout(() => resolve({
            monthly: [
                { month: 'Jan', store_revenue: 12500, invoice_collected: 8500, total: 21000 },
                { month: 'Feb', store_revenue: 14200, invoice_collected: 9200, total: 23400 },
                { month: 'Mar', store_revenue: 18500, invoice_collected: 11500, total: 30000 },
                { month: 'Apr', store_revenue: 16800, invoice_collected: 10400, total: 27200 },
                { month: 'May', store_revenue: 21000, invoice_collected: 13500, total: 34500 },
                { month: 'Jun', store_revenue: 25400, invoice_collected: 15800, total: 41200 }
            ]
        }), 400));
    },
    getCrmReport: async (params) => {
        return new Promise(resolve => setTimeout(() => resolve({
            metrics: { leads: 145, won: 32, lost: 18, revenue: 124000 }
        }), 400));
    },
    getFinanceReport: async (params) => {
        return new Promise(resolve => setTimeout(() => resolve({
            metrics: { accounts_receivable: 45000, accounts_payable: 12000, net_profit: 33000 }
        }), 400));
    },
    getHrmData: async (params) => {
        return new Promise(resolve => setTimeout(() => resolve({
            metrics: { headcount: 42, open_roles: 3, attendance_rate: 98 }
        }), 400));
    },
    getProjectsReport: async (params) => {
        return new Promise(resolve => setTimeout(() => resolve({
            metrics: { active_projects: 12, completed_this_month: 4, average_margin: 24 }
        }), 400));
    },
    getSecurityReport: async (params) => {
        return new Promise(resolve => setTimeout(() => resolve({
            metrics: { threats_blocked: 420, active_alerts: 2, login_failures: 14 }
        }), 400));
    },
    getSupportReport: async (params) => {
        return new Promise(resolve => setTimeout(() => resolve({
            metrics: { open_tickets: 24, avg_resolution_time: '4h 12m', csat_score: 4.8 }
        }), 400));
    },
    // -----------------------------------------------------------
    
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

export default analyticsService;