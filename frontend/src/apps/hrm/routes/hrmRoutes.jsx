import React from 'react';
import { Route } from 'react-router-dom';
import HrmDashboard from '../pages/dashboards/HrmDashboard';
import EmployeeList from '../pages/EmployeeList';
import LeaveManagement from '../pages/LeaveManagement';
import TimeTracking from '../pages/TimeTracking';
import CertificationsPage from '../pages/CertificationsPage';
import PayrollPage from '../pages/PayrollPage';
import HrmSettings from '../pages/HrmSettings';
import OnboardingWorkflow from '../pages/OnboardingWorkflow';

export const hrmRoutes = (
    <>
        <Route index element={<HrmDashboard />} />
        <Route path="overview" element={<HrmDashboard />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="leaves" element={<LeaveManagement />} />
        <Route path="time" element={<TimeTracking />} />
        <Route path="certifications" element={<CertificationsPage />} />
        <Route path="payroll" element={<PayrollPage />} />
        <Route path="onboarding" element={<OnboardingWorkflow />} />
        <Route path="settings" element={<HrmSettings />} />
    </>
);
