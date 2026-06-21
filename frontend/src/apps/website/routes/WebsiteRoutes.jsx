import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../../../core/layouts/PublicLayout';

import LandingPage from '../pages/landing/LandingPage';
import About from '../pages/company/About';
import Contact from '../pages/company/Contact';
import Support from '../pages/services/Support';
import RemoteJoin from '../pages/services/RemoteJoin';
import ServiceDetail from '../pages/services/ServiceDetail';
import Team from '../pages/company/Team';
import Careers from '../pages/company/Careers';
import Brochure from '../pages/resources/Brochure';
import Events from '../pages/resources/Events';
import FreeTools from '../pages/resources/FreeTools';
import Podcasts from '../pages/resources/Podcasts';
import Reports from '../pages/resources/Reports';
import Compliance from '../pages/legal/Compliance';
import PrivacyPolicy from '../pages/legal/PrivacyPolicy';
import TermsOfService from '../pages/legal/TermsOfService';
import PartnerProgram from '../../store/pages/features/PartnerProgram';
import PricingPage from '../pages/pricing/PricingPage';
import StatusPage from '../pages/company/StatusPage';
import CaseStudies from '../pages/resources/CaseStudies';
import SecurityTrustCenter from '../pages/company/SecurityTrustCenter';
import Integrations from '../pages/platform/Integrations';
import SLADocument from '../pages/legal/SLADocument';
import Accessibility from '../pages/legal/Accessibility';

export const WebsiteRoutes = () => {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
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
