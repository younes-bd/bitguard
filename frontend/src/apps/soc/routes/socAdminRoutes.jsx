import React from 'react';
import { Route } from 'react-router-dom';

import SocDashboard from '../pages/dashboards/SocDashboardPage';
import WorkspaceManager from '../pages/lists/WorkspaceManagerPage';
import AssetsPage from '../pages/lists/AssetsPage';
import AlertsPage from '../pages/lists/AlertsPage';
import IncidentsPage from '../pages/lists/IncidentsPage';
import VulnerabilitiesPage from '../pages/compliance/VulnerabilitiesPage';
import IntelPage from '../pages/lists/IntelPage';
import RemoteSupport from '../pages/features/RemoteSupportPage';
import EmailSecurity from '../pages/features/EmailSecurityPage';
import CloudSecurity from '../pages/features/CloudSecurityPage';
import NetworkSecurity from '../pages/features/NetworkSecurityPage';
import AlertDetails from '../pages/details/AlertDetailsPage';
import IncidentDetails from '../pages/details/IncidentDetailsPage';
import SecurityGapsPage from '../pages/compliance/SecurityGapsPage';
import LogAnalysisPage from '../pages/lists/LogAnalysisPage';
import RiskRegister from '../pages/compliance/RiskRegisterPage';
import ComplianceRegister from '../pages/compliance/ComplianceRegisterPage';

export const socAdminRoutes = (
    <>
        <Route index element={<SocDashboard />} />
        <Route path="overview" element={<SocDashboard />} />
        <Route path="workspaces" element={<WorkspaceManager />} />
        <Route path="security" element={<AlertsPage />} /> {/* Fallback or redirect */}

        {/* Core SOC Modules */}
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="incidents" element={<IncidentsPage />} />
        <Route path="logs" element={<LogAnalysisPage />} />
        <Route path="maintenance" element={<AssetsPage />} />
        <Route path="vulnerabilities" element={<VulnerabilitiesPage />} />
        <Route path="intel" element={<IntelPage />} />
        <Route path="remote" element={<RemoteSupport />} />
        <Route path="email" element={<EmailSecurity />} />
        <Route path="cloud" element={<CloudSecurity />} />
        <Route path="network" element={<NetworkSecurity />} />
        <Route path="gaps" element={<SecurityGapsPage />} />
        <Route path="risks" element={<RiskRegister />} />
        <Route path="compliance" element={<ComplianceRegister />} />
        <Route path="alerts/:id" element={<AlertDetails />} />
        <Route path="incidents/:id" element={<IncidentDetails />} />
    </>
);


