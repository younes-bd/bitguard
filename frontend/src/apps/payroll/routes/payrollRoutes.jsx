import React from 'react';
import { Route } from 'react-router-dom';
import PayrollDashboard from '../pages/dashboards/PayrollDashboard';
import PayslipBatchList from '../pages/lists/PayslipBatchList';
import PayslipBatchDetail from '../pages/lists/PayslipBatchDetail';
import SalaryRulesList from '../pages/lists/SalaryRulesList';

export const payrollRoutes = (
    <>
        <Route index element={<PayrollDashboard />} />
        <Route path="batches" element={<PayslipBatchList />} />
        <Route path="batches/:id" element={<PayslipBatchDetail />} />
        <Route path="rules" element={<SalaryRulesList />} />
        <Route path="settings" element={<div className="p-8">Settings placeholder</div>} />
        <Route path="*" element={<PayrollDashboard />} />
    </>
);
