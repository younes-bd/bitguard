import client from '@/core/api/client';

export const employeesService = {
    getDashboardStats: async () => {
        const response = await client.get('/employees/dashboard/');
        return response.data?.data ?? response.data;
    },
    getEmployees: async (params = {}) => {
        const response = await client.get('/employees/employees/', { params });
        return response.data?.data ?? response.data;
    },
    getEmployee: async (id) => {
        const response = await client.get(`/employees/employees/${id}/`);
        return response.data?.data ?? response.data;
    },
    createEmployee: async (data) => {
        const response = await client.post('/employees/employees/', data);
        return response.data?.data ?? response.data;
    },
    updateEmployee: async (id, data) => {
        const response = await client.patch(`/employees/employees/${id}/`, data);
        return response.data?.data ?? response.data;
    },
    deleteEmployee: async (id) => {
        const response = await client.delete(`/employees/employees/${id}/`);
        return response.data?.data ?? response.data;
    },
    getLeaves: async (params = {}) => {
        const response = await client.get('/employees/leaves/', { params });
        return response.data?.data ?? response.data;
    },
    getPayroll: async (params = {}) => {
        const response = await client.get('/employees/payroll/', { params });
        return response.data?.data ?? response.data;
    },
    getDepartments: async () => {
        const response = await client.get('/employees/departments/');
        return response.data?.data ?? response.data;
    },
    getLeaveRequests: async (params = {}) => {
        const response = await client.get('/employees/leave-requests/', { params });
        return response.data?.data ?? response.data;
    },
    approveLeave: async (id) => {
        const response = await client.post(`/employees/leave-requests/${id}/approve/`);
        return response.data;
    },
    rejectLeave: async (id, reason) => {
        const response = await client.post(`/employees/leave-requests/${id}/reject/`, { reason });
        return response.data;
    },
    createLeaveRequest: async (data) => {
        const response = await client.post('/employees/leave-requests/', data);
        return response.data;
    },
    getCertifications: async (params = {}) => {
        const response = await client.get('/employees/certifications/', { params });
        return response.data?.data ?? response.data;
    },
    getJobPositions: async (params = {}) => {
        const response = await client.get('/employees/job-positions/', { params });
        return response.data?.data ?? response.data;
    },
    getJobApplications: async (params = {}) => {
        const response = await client.get('/employees/job-applications/', { params });
        return response.data?.data ?? response.data;
    },
    getPayrollPeriods: async (params = {}) => {
        const response = await client.get('/employees/payroll-periods/', { params });
        return response.data?.data ?? response.data;
    },
    getPayslipBatches: async (params = {}) => {
        const response = await client.get('/employees/payslip-batches/', { params });
        return response.data?.data ?? response.data;
    },
    getPerformanceReviews: async (params = {}) => {
        const response = await client.get('/employees/performance-reviews/', { params });
        return response.data?.data ?? response.data;
    },
    getEmployeeSkills: async (params = {}) => {
        const response = await client.get('/employees/employee-skills/', { params });
        return response.data?.data ?? response.data;
    },
    // â”€â”€â”€ DOCUMENT GENERATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    downloadDocument: async (model, id) => {
        const response = await client.post('reports/generated/generate/', {
            record_model: model,
            record_id: id,
        });
        return response.data;
    }
};
