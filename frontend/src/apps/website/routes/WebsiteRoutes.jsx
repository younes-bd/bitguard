import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../../../core/layouts/PublicLayout';

import LandingPage from '../pages/LandingPage';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Support from '../pages/Support';
import RemoteJoin from '../pages/RemoteJoin';
import ServiceDetail from '../pages/ServiceDetail';
import Team from '../pages/Team';
import Careers from '../pages/Careers';
import Brochure from '../pages/Brochure';
import Events from '../pages/Events';
import FreeTools from '../pages/FreeTools';
import Podcasts from '../pages/Podcasts';
import Reports from '../pages/Reports';
import Compliance from '../pages/Compliance';
import PartnerProgram from '../../store/pages/PartnerProgram';

export const WebsiteRoutes = () => {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="support" element={<Support />} />
                <Route path="support/remote" element={<RemoteJoin />} />
                <Route path="platform/:slug" element={<ServiceDetail />} />
                <Route path="solutions/:slug" element={<ServiceDetail />} />
                <Route path="team" element={<Team />} />
                <Route path="careers" element={<Careers />} />
                <Route path="events" element={<Events />} />
                <Route path="free-tools" element={<FreeTools />} />
                <Route path="podcasts" element={<Podcasts />} />
                <Route path="reports" element={<Reports />} />
                <Route path="compliance" element={<Compliance />} />
                <Route path="partner" element={<PartnerProgram />} />
            </Route>
            <Route path="brochure/:slug" element={<Brochure />} />
        </Routes>
    );
};
