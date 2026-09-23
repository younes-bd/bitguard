import React from 'react';
import { Route } from 'react-router-dom';
import PayrollDashboard from '../pages/dashboards/PayrollDashboardPage';
import PayslipBatchList from '../pages/lists/PayslipBatchListPage';
import PayslipBatchDetail from '../pages/lists/PayslipBatchDetailPage';
import SalaryRulesList from '../pages/lists/SalaryRulesListPage';
import PayrollSettings from '../pages/settings/PayrollSettingsPage';

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
