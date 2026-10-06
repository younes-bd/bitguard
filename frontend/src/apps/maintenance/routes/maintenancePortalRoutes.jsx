import React from 'react';
import { Route } from 'react-router-dom';
import PortalMaintenancePage from '../pages/portal/PortalMaintenancePage';

export const maintenancePortalRoutes = (<Route path='assets' element={<PortalMaintenancePage />} />);
