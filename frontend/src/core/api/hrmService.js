import client from './client';

const base = 'hrm';

export const hrmService = {
    // Dashboard stats
    getStats: () => client.get(`${base}/employees/stats/`).then(r => r.data?.data ?? r.data ?? {}),

    // Employees
    getEmployees: (params = {}) => client.get(`${base}/employees/`, { params }).then(r => r.data),
    getEmployee: (id) => client.get(`${base}/employees/${id}/`).then(r => r.data),
    createEmployee: (data) => client.post(`${base}/employees/`, data).then(r => r.data),
    updateEmployee: (id, data) => client.patch(`${base}/employees/${id}/`, data).then(r => r.data),
    deleteEmployee: (id) => client.delete(`${base}/employees/${id}/`),

    // Departments
    getDepartments: () => client.get(`${base}/departments/`).then(r => r.data),
    createDepartment: (data) => client.post(`${base}/departments/`, data).then(r => r.data),

    // Leave Requests
    getLeaveRequests: (params = {}) => client.get(`${base}/leave-requests/`, { params }).then(r => r.data),
    approveLeave: (id) => client.post(`${base}/leave-requests/${id}/approve/`).then(r => r.data),
    rejectLeave: (id) => client.post(`${base}/leave-requests/${id}/reject/`).then(r => r.data),

    // Time Entries
    getTimeEntries: (params = {}) => client.get(`${base}/time-entries/`, { params }).then(r => r.data),

    // Certifications
    getCertifications: (params = {}) => client.get(`${base}/certifications/`, { params }).then(r => r.data),
};

export default hrmService;
