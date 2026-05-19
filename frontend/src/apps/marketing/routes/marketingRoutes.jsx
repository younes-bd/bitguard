import React from 'react';
import { Route } from 'react-router-dom';
import MarketingDashboard from '../pages/MarketingDashboard';
import CampaignList from '../pages/CampaignList';
import AssetList from '../pages/AssetList';
import MarketingIntegrations from '../pages/MarketingIntegrations';
import MarketingSettings from '../pages/MarketingSettings';

export const marketingRoutes = (
    <>
        <Route index element={<MarketingDashboard />} />
        <Route path="overview" element={<MarketingDashboard />} />
        <Route path="campaigns" element={<CampaignList />} />
        <Route path="assets" element={<AssetList />} />
        <Route path="integrations" element={<MarketingIntegrations />} />
        <Route path="settings" element={<MarketingSettings />} />
    </>
);
