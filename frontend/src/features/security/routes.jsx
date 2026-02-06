import React from 'react';
import { Route } from 'react-router-dom';
import SocDashboard from './dashboards/SocDashboard';
import WorkspaceManager from './pages/WorkspaceManager';
// import SecurityCenter from './pages/SecurityCenter';
import AssetsPage from './pages/AssetsPage';
import AlertsPage from './pages/AlertsPage';
import IncidentsPage from './pages/IncidentsPage';
import VulnerabilitiesPage from './pages/VulnerabilitiesPage';
import IntelPage from './pages/IntelPage';
import RemoteSupport from './pages/RemoteSupport';
import EmailSecurity from './pages/EmailSecurity';
import CloudSecurity from './pages/CloudSecurity';
import NetworkSecurity from './pages/NetworkSecurity';
import AlertDetails from './pages/AlertDetails';
import IncidentDetails from './pages/IncidentDetails';
import SecurityGapsPage from './pages/SecurityGapsPage';

export const socRoutes = (
    <>
        <Route path="overview" element={<SocDashboard />} />
        <Route path="workspaces" element={<WorkspaceManager />} />
        <Route path="security" element={<AlertsPage />} /> {/* Fallback or redirect */}

        {/* Core SOC Modules */}
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="incidents" element={<IncidentsPage />} />
        <Route path="assets" element={<AssetsPage />} />
        <Route path="vulnerabilities" element={<VulnerabilitiesPage />} />
        <Route path="intel" element={<IntelPage />} />
        <Route path="remote" element={<RemoteSupport />} />
        <Route path="email" element={<EmailSecurity />} />
        <Route path="cloud" element={<CloudSecurity />} />
        <Route path="network" element={<NetworkSecurity />} />
        <Route path="gaps" element={<SecurityGapsPage />} />
        <Route path="alerts/:id" element={<AlertDetails />} />
        <Route path="incidents/:id" element={<IncidentDetails />} />
    </>
);

