import React from 'react';
import { Route } from 'react-router-dom';
import JourneysDashboard from '../pages/dashboards/JourneysDashboardPage';
import SmsDashboard from '../../sms/pages/dashboards/SmsDashboardPage';
import SmsInboxings from '../../sms/pages/features/SmsInboxingsPage';
import SmsContacts from '../../sms/pages/features/SmsContactsPage';
import SmsAnalytics from '../../sms/pages/features/SmsAnalyticsPage';
import CampaignsPage from '../../campaigns/pages/CampaignsPage';

// Campaigns
import CampaignList from '../pages/campaigns/CampaignListPage';
import EmailCampaigns from '../pages/campaigns/EmailCampaignsPage';
import SocialCampaigns from '../pages/campaigns/SocialCampaignsPage';
import SmsCampaigns from '../pages/campaigns/SmsCampaignsPage';

// Content Management
import ContentCalendar from '../pages/content/ContentCalendarPage';
import ContentLibrary from '../pages/content/ContentLibraryPage';
import PostDrafts from '../pages/content/PostDraftsPage';
import ApprovalWorkflow from '../pages/content/ApprovalWorkflowPage';

// AI Studio
import PostGeneration from '../pages/ai/PostGenerationPage';
import BlogGeneration from '../pages/ai/BlogGenerationPage';
import TranslationRewriting from '../pages/ai/TranslationRewritingPage';

// Creative Assets
import AssetList from '../pages/assets/AssetListPage';
import BrandKit from '../pages/assets/BrandKitPage';
import TemplatesList from '../pages/assets/TemplatesListPage';

// Social Media Management
import Scheduler from '../pages/social/SchedulerPage';
import PublishingQueue from '../pages/social/PublishingQueuePage';
import EngagementMonitor from '../pages/social/EngagementMonitorPage';

// Video Studio
import AiVideoGeneration from '../pages/video/AiVideoGenerationPage';
import ShortsReels from '../pages/video/ShortsReelsPage';

// Intelligence
import AnalyticsDashboard from '../pages/analytics/AnalyticsDashboardPage';
import AudienceGrowth from '../pages/analytics/AudienceGrowthPage';

// Configuration
import AutomationsList from '../pages/config/AutomationsListPage';
import JourneysIntegrations from '../pages/config/JourneysIntegrationsPage';
import JourneysSettings from '../pages/config/JourneysSettingsPage';

export const journeysAdminRoutes = (
    <>
        <Route index element={<JourneysDashboard />} />
        
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
        <Route path="dashboards" element={<AnalyticsDashboard />} />
        <Route path="sms" element={<SmsDashboard />} />
        <Route path="sms/mailings" element={<SmsInboxings />} />
        <Route path="sms/contacts" element={<SmsContacts />} />
        <Route path="sms/analytics" element={<SmsAnalytics />} />
        <Route path="mass-mailing" element={<CampaignsPage />} />
        <Route path="analytics/audience" element={<AudienceGrowth />} />

        {/* Configuration */}
        <Route path="automations" element={<AutomationsList />} />
        <Route path="integrations" element={<JourneysIntegrations />} />
        <Route path="settings" element={<JourneysSettings />} />
    </>
);
