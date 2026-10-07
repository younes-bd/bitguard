import React from 'react';
import { Route } from 'react-router-dom';
import PortalTicketsPage from '../pages/portal/PortalTicketsPage';
import PortalTicketDetailPage from '../pages/portal/PortalTicketDetailPage';

export const helpdeskPortalRoutes = (
    <React.Fragment>
        <Route path='tickets' element={<PortalTicketsPage />} />
        <Route path='tickets/:id' element={<PortalTicketDetailPage />} />
    </React.Fragment>
);
