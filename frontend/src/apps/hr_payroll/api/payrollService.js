import apiClient from '@/core/api/client';

const payrollService = {
  // Payslips
  getPayslips: (params) => apiClient.get('/hr/payslips/', { params }).then(r => r.data),
  getPayslip: (id) => apiClient.get(`/hr/payslips/${id}/`).then(r => r.data),
  createPayslip: (data) => apiClient.post('/hr/payslips/', data).then(r => r.data),
  updatePayslip: (id, data) => apiClient.put(`/hr/payslips/${id}/`, data).then(r => r.data),
  deletePayslip: (id) => apiClient.delete(`/hr/payslips/${id}/`),

  // Payroll Periods  
  getPayrollPeriods: (params) => apiClient.get('/hr/payroll-periods/', { params }).then(r => r.data),
  getPayrollPeriod: (id) => apiClient.get(`/hr/payroll-periods/${id}/`).then(r => r.data),
  createPayrollPeriod: (data) => apiClient.post('/hr/payroll-periods/', data).then(r => r.data),
  processPayrollPeriod: (id) => apiClient.post(`/hr/payroll-periods/${id}/process/`).then(r => r.data),
  generatePayslips: (id) => apiClient.post(`/hr/payroll-periods/${id}/generate_payslips/`).then(r => r.data),

  // Salary components
  getSalaryComponents: () => apiClient.get('/hr/salary-components/').then(r => r.data),
};

export default payrollService;
export { payrollService };
