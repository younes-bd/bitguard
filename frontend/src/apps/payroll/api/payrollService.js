import apiClient from '@/core/api/client';

const payrollService = {
  // Payslips
  getPayslips: (params) => apiClient.get('/employees/payslips/', { params }).then(r => r.data),
  getPayslip: (id) => apiClient.get(`/employees/payslips/${id}/`).then(r => r.data),
  createPayslip: (data) => apiClient.post('/employees/payslips/', data).then(r => r.data),
  updatePayslip: (id, data) => apiClient.put(`/employees/payslips/${id}/`, data).then(r => r.data),
  deletePayslip: (id) => apiClient.delete(`/employees/payslips/${id}/`),

  // Payroll Periods  
  getPayrollPeriods: (params) => apiClient.get('/employees/payroll-periods/', { params }).then(r => r.data),
  getPayrollPeriod: (id) => apiClient.get(`/employees/payroll-periods/${id}/`).then(r => r.data),
  createPayrollPeriod: (data) => apiClient.post('/employees/payroll-periods/', data).then(r => r.data),
  processPayrollPeriod: (id) => apiClient.post(`/employees/payroll-periods/${id}/process/`).then(r => r.data),
  generatePayslips: (id) => apiClient.post(`/employees/payroll-periods/${id}/generate_payslips/`).then(r => r.data),

  // Dashboard & Batches (Delegating to standard HR endpoints or mocking if missing)
  getDashboardStats: () => apiClient.get('/employees/dashboard/').then(r => r.data?.data ?? r.data),
  getPayslipBatches: (params) => apiClient.get('/employees/payslip-batches/', { params }).then(r => r.data?.data ?? r.data),

  // Salary components
  getSalaryComponents: () => apiClient.get('/employees/salary-components/').then(r => r.data),
};

export default payrollService;
export { payrollService };
