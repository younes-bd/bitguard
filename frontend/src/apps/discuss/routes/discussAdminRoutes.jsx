import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DiscussDashboard from '../pages/DiscussDashboardPage';
import WhatsAppDashboard from '../../whatsapp/pages/dashboards/WhatsAppDashboardPage';
import Channels from '../pages/features/ChannelsPage';
import DirectMessages from '../pages/features/DirectMessagesPage';
import WhatsappAccounts from '../../whatsapp/pages/features/WhatsappAccountsPage';
import WhatsappTemplates from '../../whatsapp/pages/features/WhatsappTemplatesPage';

export const discussAdminRoutes = (
    <React.Fragment>
        <Route index element={<DiscussDashboard />} />
        <Route path="whatsapp" element={<WhatsAppDashboard />} />
        <Route path="channels" element={<Channels />} />
        <Route path="dm" element={<DirectMessages />} />
        <Route path="whatsapp/accounts" element={<WhatsappAccounts />} />
        <Route path="whatsapp/templates" element={<WhatsappTemplates />} />
        <Route path="*" element={<Navigate to="" replace />} />
    </React.Fragment>
);
