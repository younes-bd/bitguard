import apiClient from './client';

const payrollService = {
  // Payslips
  getPayslips: (params) => apiClient.get('/hrm/payslips/', { params }).then(r => r.data),
  getPayslip: (id) => apiClient.get(`/hrm/payslips/${id}/`).then(r => r.data),
  createPayslip: (data) => apiClient.post('/hrm/payslips/', data).then(r => r.data),
  updatePayslip: (id, data) => apiClient.put(`/hrm/payslips/${id}/`, data).then(r => r.data),
  deletePayslip: (id) => apiClient.delete(`/hrm/payslips/${id}/`),

  // Payroll Periods  
  getPayrollPeriods: (params) => apiClient.get('/hrm/payroll-periods/', { params }).then(r => r.data),
  getPayrollPeriod: (id) => apiClient.get(`/hrm/payroll-periods/${id}/`).then(r => r.data),
  createPayrollPeriod: (data) => apiClient.post('/hrm/payroll-periods/', data).then(r => r.data),
  processPayrollPeriod: (id) => apiClient.post(`/hrm/payroll-periods/${id}/process/`).then(r => r.data),
  generatePayslips: (id) => apiClient.post(`/hrm/payroll-periods/${id}/generate_payslips/`).then(r => r.data),

  // Salary components
  getSalaryComponents: () => apiClient.get('/hrm/salary-components/').then(r => r.data),
};

export default payrollService;
