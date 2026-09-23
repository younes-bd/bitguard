import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import EmployeesDashboard from '../pages/dashboards/EmployeesDashboardPage';
import EmployeeList from '../pages/lists/EmployeeListPage';
import EmployeeDetail from '../pages/lists/EmployeeDetailPage';
import CertificationsPage from '../pages/lists/CertificationsPage';
import EmployeesSettings from '../pages/settings/EmployeesSettingsPage';
import OnboardingWorkflow from '../pages/wizards/OnboardingWorkflowPage';
import OrgChart from '../pages/lists/OrgChartPage';
import ContractsList from '../pages/lists/ContractsListPage';
import SkillsMatrix from '../pages/lists/SkillsMatrixPage';
import EmployeesReports from '../pages/reports/EmployeesReportsPage';

import MyProfile from '../pages/ess/MyProfilePage';
import MyPayslips from '../pages/ess/MyPayslipsPage';
import MyLeaves from '../pages/ess/MyLeavesPage';
import MyAttendance from '../pages/ess/MyAttendancePage';

export const employeesAdminRoutes = (
    <>
        <Route index element={<Navigate to="employees" replace />} />
        <Route path="overview" element={<EmployeesDashboard />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/:id" element={<EmployeeDetail />} />
        <Route path="certifications" element={<CertificationsPage />} />
        <Route path="onboarding" element={<OnboardingWorkflow />} />
        <Route path="settings" element={<EmployeesSettings />} />
        <Route path="org-chart" element={<OrgChart />} />
        <Route path="contracts" element={<ContractsList />} />
        <Route path="skills-matrix" element={<SkillsMatrix />} />
        <Route path="reports" element={<EmployeesReports />} />
        
        {/* ESS Routes */}
        <Route path="my-profile" element={<MyProfile />} />
        <Route path="my-payslips" element={<MyPayslips />} />
        <Route path="my-leaves" element={<MyLeaves />} />
        <Route path="my-attendance" element={<MyAttendance />} />
        
        {/* Legacy redirect for old hr routes if accessed directly */}
        <Route path="attendance" element={<Navigate to="/admin/hr_attendance" replace />} />
        <Route path="time" element={<Navigate to="/admin/timeclock/time" replace />} />
        <Route path="leaves" element={<Navigate to="/admin/hr_holidays" replace />} />
        <Route path="recruitment" element={<Navigate to="/admin/recruitment" replace />} />
        <Route path="payroll" element={<Navigate to="/admin/payroll" replace />} />
        <Route path="appraisals" element={<Navigate to="/admin/appraisals" replace />} />
        <Route path="*" element={<EmployeesDashboard />} />
    </>
);
