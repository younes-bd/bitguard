import React from 'react';
import { Route } from 'react-router-dom';
import MarketingDashboard from '../pages/dashboards/MarketingDashboard';

// Campaigns
import CampaignList from '../pages/campaigns/CampaignList';
import EmailCampaigns from '../pages/campaigns/EmailCampaigns';
import SocialCampaigns from '../pages/campaigns/SocialCampaigns';
import SmsCampaigns from '../pages/campaigns/SmsCampaigns';

// Content Management
import ContentCalendar from '../pages/content/ContentCalendar';
import ContentLibrary from '../pages/content/ContentLibrary';
import PostDrafts from '../pages/content/PostDrafts';
import ApprovalWorkflow from '../pages/content/ApprovalWorkflow';

// AI Studio
import PostGeneration from '../pages/ai/PostGeneration';
import BlogGeneration from '../pages/ai/BlogGeneration';
import TranslationRewriting from '../pages/ai/TranslationRewriting';

// Creative Assets
import AssetList from '../pages/assets/AssetList';
import BrandKit from '../pages/assets/BrandKit';
import TemplatesList from '../pages/assets/TemplatesList';

// Social Media Management
import Scheduler from '../pages/social/Scheduler';
import PublishingQueue from '../pages/social/PublishingQueue';
import EngagementMonitor from '../pages/social/EngagementMonitor';

// Video Studio
import AiVideoGeneration from '../pages/video/AiVideoGeneration';
import ShortsReels from '../pages/video/ShortsReels';

// Intelligence
import AnalyticsDashboard from '../pages/analytics/AnalyticsDashboard';
import AudienceGrowth from '../pages/analytics/AudienceGrowth';

// Configuration
import AutomationsList from '../pages/config/AutomationsList';
import MarketingIntegrations from '../pages/config/MarketingIntegrations';
import MarketingSettings from '../pages/config/MarketingSettings';

export const marketingRoutes = (
    <>
        <Route index element={<MarketingDashboard />} />
        
        {/* Campaigns */}
        <Route path="campaigns" element={<CampaignList />} />
        <Route path="campaigns/email" element={<EmailCampaigns />} />
        <Route path="campaigns/social" element={<SocialCampaigns />} />
        <Route path="campaigns/sms" element={<SmsCampaigns />} />

        {/* Content Management */}
        <Route path="content/calendar" element={<ContentCalendar />} />
        <Route path="content/library" element={<ContentLibrary />} />
        <Route path="content/drafts" element={<PostDrafts />} />
        <Route path="content/approvals" element={<ApprovalWorkflow />} />

        {/* AI Studio */}
        <Route path="ai/posts" element={<PostGeneration />} />
        <Route path="ai/blogs" element={<BlogGeneration />} />
        <Route path="ai/translate" element={<TranslationRewriting />} />

        {/* Creative Assets */}
        <Route path="assets" element={<AssetList />} />
        <Route path="assets/brand-kit" element={<BrandKit />} />
        <Route path="assets/templates" element={<TemplatesList />} />

        {/* Social Media Management */}
        <Route path="social/scheduler" element={<Scheduler />} />
        <Route path="social/publish" element={<PublishingQueue />} />
        <Route path="social/engagement" element={<EngagementMonitor />} />

        {/* Video Studio */}
        <Route path="video/ai" element={<AiVideoGeneration />} />
        <Route path="video/shorts" element={<ShortsReels />} />

        {/* Intelligence */}
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="analytics/audience" element={<AudienceGrowth />} />

        {/* Configuration */}
        <Route path="automations" element={<AutomationsList />} />
        <Route path="integrations" element={<MarketingIntegrations />} />
        <Route path="settings" element={<MarketingSettings />} />
    </>
);
