import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import HrmDashboard from '../pages/dashboards/HrmDashboard';
import EmployeeList from '../pages/lists/EmployeeList';
import EmployeeDetail from '../pages/lists/EmployeeDetail';
import CertificationsPage from '../pages/lists/CertificationsPage';
import HrmSettings from '../pages/settings/HrmSettings';
import OnboardingWorkflow from '../pages/wizards/OnboardingWorkflow';
import OrgChart from '../pages/lists/OrgChart';
import ContractsList from '../pages/lists/ContractsList';
import SkillsMatrix from '../pages/lists/SkillsMatrix';

export const hrRoutes = (
    <>
        <Route index element={<Navigate to="employees" replace />} />
        <Route path="overview" element={<HrmDashboard />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/:id" element={<EmployeeDetail />} />
        <Route path="certifications" element={<CertificationsPage />} />
        <Route path="onboarding" element={<OnboardingWorkflow />} />
        <Route path="settings" element={<HrmSettings />} />
        <Route path="org-chart" element={<OrgChart />} />
        <Route path="contracts" element={<ContractsList />} />
        <Route path="skills-matrix" element={<SkillsMatrix />} />
        <Route path="reporting" element={<div className="p-8 font-bold text-xl">HR Reporting Dashboard Placeholder</div>} />
        
        {/* Legacy redirect for old hr routes if accessed directly */}
        <Route path="attendance" element={<Navigate to="/admin/hr_attendance" replace />} />
        <Route path="time" element={<Navigate to="/admin/hr_attendance/time" replace />} />
        <Route path="leaves" element={<Navigate to="/admin/hr_holidays" replace />} />
        <Route path="recruitment" element={<Navigate to="/admin/recruitment" replace />} />
        <Route path="payroll" element={<Navigate to="/admin/payroll" replace />} />
        <Route path="appraisals" element={<Navigate to="/admin/appraisals" replace />} />
        <Route path="*" element={<HrmDashboard />} />
    </>
);
