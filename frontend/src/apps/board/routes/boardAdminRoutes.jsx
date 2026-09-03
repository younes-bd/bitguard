import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useTenant } from '@/core/context/TenantContext';

import AnalyticsDashboard from '../pages/dashboards/AnalyticsDashboard';
import ExecutiveSummary from '../pages/dashboards/ExecutiveSummary';
import RevenueReport from '../pages/lists/RevenueReport';
import CrmReport from '../pages/lists/CrmReport';
import SupportReport from '../pages/lists/SupportReport';
import SecurityReport from '../pages/lists/SecurityReport';
import MrrDashboard from '../pages/dashboards/MrrDashboard';
import ExportPage from '../pages/features/ExportPage';
import HrmReport from '../pages/lists/HrmReport';
import FinanceReport from '../pages/lists/FinanceReport';
import ProjectsReport from '../pages/lists/ProjectsReport';

export const boardAdminRoutes = (
    <React.Fragment>
        {/* Redirect root board to analytics instead of duplicate Command Center */}
        <Route index element={<Navigate to="analytics" replace />} />
        
        {/* Analytics Sub-Pages */}
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="executive" element={<ExecutiveSummary />} />
        <Route path="mrr" element={<MrrDashboard />} />
        <Route path="revenue" element={<RevenueReport />} />
        <Route path="crm" element={<CrmReport />} />
        <Route path="support" element={<SupportReport />} />
        <Route path="security" element={<SecurityReport />} />
        <Route path="hrm" element={<HrmReport />} />
        <Route path="finance" element={<FinanceReport />} />
        <Route path="projects" element={<ProjectsReport />} />
        <Route path="export" element={<ExportPage />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
