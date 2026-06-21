import React from 'react';
import { Route } from 'react-router-dom';
import HrmDashboard from '../pages/dashboards/HrmDashboard';
import EmployeeList from '../pages/lists/EmployeeList';
import LeaveManagement from '../pages/lists/LeaveManagement';
import TimeTracking from '../pages/lists/TimeTracking';
import CertificationsPage from '../pages/lists/CertificationsPage';
import PayrollDashboard from '../pages/payroll/PayrollDashboard';
import HrmSettings from '../pages/settings/HrmSettings';
import OnboardingWorkflow from '../pages/wizards/OnboardingWorkflow';
import RecruitmentBoard from '../pages/lists/RecruitmentBoard';
import OrgChart from '../pages/lists/OrgChart';
import AttendanceLog from '../pages/lists/AttendanceLog';
import Appraisals from '../pages/lists/Appraisals';
import ContractsList from '../pages/lists/ContractsList';
import PayRunsList from '../pages/payroll/PayRunsList';
import PayRunDetail from '../pages/payroll/PayRunDetail';

export const hrmRoutes = (
    <>
        <Route index element={<HrmDashboard />} />
        <Route path="overview" element={<HrmDashboard />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="leaves" element={<LeaveManagement />} />
        <Route path="time" element={<TimeTracking />} />
        <Route path="certifications" element={<CertificationsPage />} />
        <Route path="payroll" element={<PayrollDashboard />} />
        <Route path="onboarding" element={<OnboardingWorkflow />} />
        <Route path="settings" element={<HrmSettings />} />
        <Route path="recruitment" element={<RecruitmentBoard />} />
        <Route path="org-chart" element={<OrgChart />} />
        <Route path="attendance" element={<AttendanceLog />} />
        <Route path="appraisals" element={<Appraisals />} />

        {/* Added Routes */}
        <Route path="contracts" element={<ContractsList />} />
        <Route path="payroll/runs" element={<PayRunsList />} />
        <Route path="payroll/runs/:id" element={<PayRunDetail />} />
    </>
);
