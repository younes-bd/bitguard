import React from 'react';
import { Route } from 'react-router-dom';
import PayrollDashboard from '../pages/dashboards/PayrollDashboard';
import PayslipBatchList from '../pages/lists/PayslipBatchList';
import PayslipBatchDetail from '../pages/lists/PayslipBatchDetail';
import SalaryRulesList from '../pages/lists/SalaryRulesList';
import PayrollSettings from '../pages/settings/PayrollSettings';

export const payrollAdminRoutes = (
    <>
        <Route index element={<PayrollDashboard />} />
        <Route path="batches" element={<PayslipBatchList />} />
        <Route path="batches/:id" element={<PayslipBatchDetail />} />
        <Route path="rules" element={<SalaryRulesList />} />
        <Route path="settings" element={<PayrollSettings />} />
        <Route path="*" element={<PayrollDashboard />} />
    </>
);
