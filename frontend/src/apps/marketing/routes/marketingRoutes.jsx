import React from 'react';
import { Route } from 'react-router-dom';
import MarketingDashboard from '../pages/MarketingDashboard';
import CampaignList from '../pages/CampaignList';
import MarketingIntegrations from '../pages/MarketingIntegrations';
import MarketingSettings from '../pages/MarketingSettings';

export const marketingRoutes = (
    <>
        <Route path="campaigns" element={<CampaignList />} />
        <Route path="integrations" element={<MarketingIntegrations />} />
        <Route path="settings" element={<MarketingSettings />} />
    </>
);
