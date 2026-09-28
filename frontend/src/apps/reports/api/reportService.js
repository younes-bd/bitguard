import client from '@/core/api/client';

export const reportService = {
    getReports: (params) => client.get('reports/generated/', { params })
};
