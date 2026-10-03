import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WebsiteLayout from '../../../apps/shell/layouts/WebsiteLayout';

import LandingPage from '../pages/public/landing/LandingPage';
import About from '../pages/public/company/AboutPage';
import Contact from '../pages/public/company/ContactPage';
import Support from '../pages/public/services/SupportPage';
import RemoteJoin from '../pages/public/services/RemoteJoinPage';
import ServiceDetail from '../pages/public/services/ServiceDetailPage';
import Team from '../pages/public/company/TeamPage';
import Careers from '../pages/public/company/CareersPage';
import Brochure from '../pages/public/resources/BrochurePage';
import Events from '../pages/public/resources/EventsPage';
import FreeTools from '../pages/public/resources/FreeToolsPage';
import Podcasts from '../pages/public/resources/PodcastsPage';
import Reports from '../pages/public/resources/ReportsPage';
import Compliance from '../pages/public/legal/CompliancePage';
import PrivacyPolicy from '../pages/public/legal/PrivacyPolicyPage';
import TermsOfService from '../pages/public/legal/TermsOfServicePage';
import PartnerProgram from '../pages/public/resources/PartnerProgramPage';
import PricingPage from '../pages/public/pricing/PricingPage';
import StatusPage from '../pages/public/company/StatusPage';
import CaseStudies from '../pages/public/resources/CaseStudiesPage';
import SecurityTrustCenter from '../pages/public/company/SecurityTrustCenterPage';
import Integrations from '../pages/public/platform/IntegrationsPage';
import SLADocument from '../pages/public/legal/SLADocumentPage';
import Accessibility from '../pages/public/legal/AccessibilityPage';

export const websitePublicRoutes = () => {
    return (
        <Routes>
            <Route element={<WebsiteLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="about" element={<About />} />
                <Route path="pricing" element={<PricingPage />} />
                <Route path="contact" element={<Contact />} />
                <Route path="support" element={<Support />} />
                <Route path="support/remote" element={<RemoteJoin />} />
                <Route path="platform/:slug" element={<ServiceDetail />} />
                <Route path="solutions/:slug" element={<ServiceDetail />} />
                <Route path="industries/:slug" element={<ServiceDetail />} />
                <Route path="team" element={<Team />} />
                <Route path="careers" element={<Careers />} />
                <Route path="events" element={<Events />} />
                <Route path="free-tools" element={<FreeTools />} />
                <Route path="podcasts" element={<Podcasts />} />
                <Route path="reports" element={<Reports />} />
                <Route path="compliance" element={<Compliance />} />
                <Route path="partner" element={<PartnerProgram />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="status" element={<StatusPage />} />
                <Route path="terms" element={<TermsOfService />} />
                <Route path="case-studies" element={<CaseStudies />} />
                <Route path="security" element={<SecurityTrustCenter />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="sla" element={<SLADocument />} />
                <Route path="accessibility" element={<Accessibility />} />
                <Route path="brochure/:slug" element={<Brochure />} />
            </Route>
        </Routes>
    );
};
