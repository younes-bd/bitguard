import React from 'react';
import { Route } from 'react-router-dom';
import DashboardRouter from '../../board/routes/DashboardRouter';
import SocDashboard from '../pages/dashboards/SocDashboard';
import WorkspaceManager from '../pages/lists/WorkspaceManager';
import AssetsPage from '../pages/lists/AssetsPage';
import AlertsPage from '../pages/lists/AlertsPage';
import IncidentsPage from '../pages/lists/IncidentsPage';
import VulnerabilitiesPage from '../pages/compliance/VulnerabilitiesPage';
import IntelPage from '../pages/lists/IntelPage';
import RemoteSupport from '../pages/features/RemoteSupport';
import EmailSecurity from '../pages/features/EmailSecurity';
import CloudSecurity from '../pages/features/CloudSecurity';
import NetworkSecurity from '../pages/features/NetworkSecurity';
import AlertDetails from '../pages/details/AlertDetails';
import IncidentDetails from '../pages/details/IncidentDetails';
import SecurityGapsPage from '../pages/compliance/SecurityGapsPage';
import LogAnalysisPage from '../pages/lists/LogAnalysisPage';
import RiskRegister from '../pages/compliance/RiskRegister';
import ComplianceRegister from '../pages/compliance/ComplianceRegister';

export const socRoutes = (
    <>
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

