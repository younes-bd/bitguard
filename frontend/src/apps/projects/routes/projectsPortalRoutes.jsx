import React from 'react';
import { Route } from 'react-router-dom';
import PortalProjectsPage from '../pages/portal/PortalProjectsPage';
import PortalTasksPage from '../pages/portal/PortalTasksPage';

export const projectsPortalRoutes = (
    <React.Fragment>
        <Route path='projects' element={<PortalProjectsPage />} />
        <Route path='tasks' element={<PortalTasksPage />} />
    </React.Fragment>
);
