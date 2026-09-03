import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DiscussDashboard from '../pages/DiscussDashboard';
import WhatsAppDashboard from '../../whatsapp/pages/dashboards/WhatsAppDashboard';
import Channels from '../pages/features/Channels';
import DirectMessages from '../pages/features/DirectMessages';
import WhatsappAccounts from '../../whatsapp/pages/features/WhatsappAccounts';
import WhatsappTemplates from '../../whatsapp/pages/features/WhatsappTemplates';

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
