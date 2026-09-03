import client from '@/core/api/client';

export const hrService = {
    getDashboardStats: async () => {
        const response = await client.get('hr/dashboard/stats/');
        return response.data?.data ?? response.data;
    },
    getEmployees: async (params = {}) => {
        const response = await client.get('hr/employees/', { params });
        return response.data?.data ?? response.data;
    },
    getEmployee: async (id) => {
        const response = await client.get(`hr/employees/${id}/`);
        return response.data?.data ?? response.data;
    },
    createEmployee: async (data) => {
        const response = await client.post('hr/employees/', data);
        return response.data?.data ?? response.data;
    },
    updateEmployee: async (id, data) => {
        const response = await client.patch(`hr/employees/${id}/`, data);
        return response.data?.data ?? response.data;
    },
    deleteEmployee: async (id) => {
        const response = await client.delete(`hr/employees/${id}/`);
        return response.data?.data ?? response.data;
    },
    getLeaves: async (params = {}) => {
        const response = await client.get('hr/leaves/', { params });
        return response.data?.data ?? response.data;
    },
    getPayroll: async (params = {}) => {
        const response = await client.get('hr/payroll/', { params });
        return response.data?.data ?? response.data;
    },
    getDepartments: async () => {
        const response = await client.get('hr/departments/');
        return response.data?.data ?? response.data;
    },
    getLeaveRequests: async (params = {}) => {
        const response = await client.get('hr/leave-requests/', { params });
        return response.data?.data ?? response.data;
    },
    approveLeave: async (id) => {
        const response = await client.post(`hr/leave-requests/${id}/approve/`);
        return response.data;
    },
    rejectLeave: async (id, reason) => {
        const response = await client.post(`hr/leave-requests/${id}/reject/`, { reason });
        return response.data;
    },
    createLeaveRequest: async (data) => {
        const response = await client.post('hr/leave-requests/', data);
        return response.data;
    },
    getCertifications: async (params = {}) => {
        const response = await client.get('hr/certifications/', { params });
        return response.data?.data ?? response.data;
    },
    getJobPositions: async (params = {}) => {
        const response = await client.get('hr/job-positions/', { params });
        return response.data?.data ?? response.data;
    },
    getJobApplications: async (params = {}) => {
        const response = await client.get('hr/job-applications/', { params });
        return response.data?.data ?? response.data;
    },
    getPayrollPeriods: async (params = {}) => {
        const response = await client.get('hr/payroll-periods/', { params });
        return response.data?.data ?? response.data;
    },
    getPayslipBatches: async (params = {}) => {
        const response = await client.get('hr/payslip-batches/', { params });
        return response.data?.data ?? response.data;
    },
    getPerformanceReviews: async (params = {}) => {
        const response = await client.get('hr/performance-reviews/', { params });
        return response.data?.data ?? response.data;
    },
    getEmployeeSkills: async (params = {}) => {
        const response = await client.get('hr/employee-skills/', { params });
        return response.data?.data ?? response.data;
    },
    // â”€â”€â”€ DOCUMENT GENERATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    downloadDocument: async (model, id) => {
        const response = await client.post('reporting/generated/generate/', {
            record_model: model,
            record_id: id,
        });
        return response.data;
    }
};
