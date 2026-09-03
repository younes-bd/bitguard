import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WebsiteLayout from '@/core/layouts/WebsiteLayout';

import LandingPage from '../pages/public/landing/LandingPage';
import About from '../pages/public/company/About';
import Contact from '../pages/public/company/Contact';
import Support from '../pages/public/services/Support';
import RemoteJoin from '../pages/public/services/RemoteJoin';
import ServiceDetail from '../pages/public/services/ServiceDetail';
import Team from '../pages/public/company/Team';
import Careers from '../pages/public/company/Careers';
import Brochure from '../pages/public/resources/Brochure';
import Events from '../pages/public/resources/Events';
import FreeTools from '../pages/public/resources/FreeTools';
import Podcasts from '../pages/public/resources/Podcasts';
import Reports from '../pages/public/resources/Reports';
import Compliance from '../pages/public/legal/Compliance';
import PrivacyPolicy from '../pages/public/legal/PrivacyPolicy';
import TermsOfService from '../pages/public/legal/TermsOfService';
import PartnerProgram from '../pages/public/resources/PartnerProgram';
import PricingPage from '../pages/public/pricing/PricingPage';
import StatusPage from '../pages/public/company/StatusPage';
import CaseStudies from '../pages/public/resources/CaseStudies';
import SecurityTrustCenter from '../pages/public/company/SecurityTrustCenter';
import Integrations from '../pages/public/platform/Integrations';
import SLADocument from '../pages/public/legal/SLADocument';
import Accessibility from '../pages/public/legal/Accessibility';

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
