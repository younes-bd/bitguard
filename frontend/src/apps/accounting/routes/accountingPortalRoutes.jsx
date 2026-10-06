import React from 'react';
import { Route } from 'react-router-dom';
import PortalInvoicesPage from '../pages/portal/PortalInvoicesPage';
import PortalInvoiceDetailPage from '../pages/portal/PortalInvoiceDetailPage';

export const accountingPortalRoutes = (
    <React.Fragment>
        <Route path='invoices' element={<PortalInvoicesPage />} />
        <Route path='invoices/:id' element={<PortalInvoiceDetailPage />} />
    </React.Fragment>
);
