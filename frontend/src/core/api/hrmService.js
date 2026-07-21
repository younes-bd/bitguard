import client from './client';

export const hrmService = {
    getDashboardStats: async () => {
        const response = await client.get('hrm/dashboard/');
        return response.data?.data ?? response.data;
    },
    getEmployees: async (params = {}) => {
        const response = await client.get('hrm/employees/', { params });
        return response.data?.data ?? response.data;
    },
    getEmployee: async (id) => {
        const response = await client.get(`hrm/employees/${id}/`);
        return response.data?.data ?? response.data;
    },
    createEmployee: async (data) => {
        const response = await client.post('hrm/employees/', data);
        return response.data?.data ?? response.data;
    },
    updateEmployee: async (id, data) => {
        const response = await client.patch(`hrm/employees/${id}/`, data);
        return response.data?.data ?? response.data;
    },
    deleteEmployee: async (id) => {
        const response = await client.delete(`hrm/employees/${id}/`);
        return response.data?.data ?? response.data;
    },
    getLeaves: async (params = {}) => {
        const response = await client.get('hrm/leaves/', { params });
        return response.data?.data ?? response.data;
    },
    getPayroll: async (params = {}) => {
        const response = await client.get('hrm/payroll/', { params });
        return response.data?.data ?? response.data;
    },
    getDepartments: async () => {
        const response = await client.get('hrm/departments/');
        return response.data?.data ?? response.data;
    },
    getLeaveRequests: async (params = {}) => {
        const response = await client.get('hrm/leave-requests/', { params });
        return response.data?.data ?? response.data;
    },
    approveLeave: async (id) => {
        const response = await client.post(`hrm/leave-requests/${id}/approve/`);
        return response.data;
    },
    rejectLeave: async (id, reason) => {
        const response = await client.post(`hrm/leave-requests/${id}/reject/`, { reason });
        return response.data;
    },
    createLeaveRequest: async (data) => {
        const response = await client.post('hrm/leave-requests/', data);
        return response.data;
    },
    getCertifications: async (params = {}) => {
        const response = await client.get('hrm/certifications/', { params });
        return response.data?.data ?? response.data;
    },
    getJobPositions: async (params = {}) => {
        const response = await client.get('hrm/job-positions/', { params });
        return response.data?.data ?? response.data;
    },
    getJobApplications: async (params = {}) => {
        const response = await client.get('hrm/job-applications/', { params });
        return response.data?.data ?? response.data;
    },
    getPayrollPeriods: async (params = {}) => {
        const response = await client.get('hrm/payroll-periods/', { params });
        return response.data?.data ?? response.data;
    },
    getPayslipBatches: async (params = {}) => {
        const response = await client.get('hrm/payslip-batches/', { params });
        return response.data?.data ?? response.data;
    },
    getPerformanceReviews: async (params = {}) => {
        const response = await client.get('hrm/performance-reviews/', { params });
        return response.data?.data ?? response.data;
    },
    getEmployeeSkills: async (params = {}) => {
        const response = await client.get('hrm/employee-skills/', { params });
        return response.data?.data ?? response.data;
    },
    // ─── DOCUMENT GENERATION ──────────────────────────────────────────────────
    downloadDocument: async (model, id) => {
        const response = await client.post('reporting/generated/generate/', {
            record_model: model,
            record_id: id,
        });
        return response.data;
    }
};
