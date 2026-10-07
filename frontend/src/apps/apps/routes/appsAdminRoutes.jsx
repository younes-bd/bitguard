import React from 'react';
import { Route } from 'react-router-dom';
import AppInstaller from '../pages/AppInstallerPage';
import AppDetail from '../pages/AppDetailPage';

export const appsAdminRoutes = (
    <>
        <Route index element={<AppInstaller />} />
        <Route path="themes" element={<AppInstaller />} />
        <Route path="updates" element={<AppInstaller />} />
        <Route path=":techName" element={<AppDetail />} />
    </>
);
