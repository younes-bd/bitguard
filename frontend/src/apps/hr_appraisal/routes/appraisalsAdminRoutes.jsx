import React from 'react';
import { Route } from 'react-router-dom';
import Appraisals from '../pages/lists/Appraisals';
import PerformanceReviews from '../pages/lists/PerformanceReviews';
import AppraisalSettings from '../pages/settings/AppraisalSettings';

export const appraisalsAdminRoutes = (
    <>
        <Route index element={<Appraisals />} />
        <Route path="reviews" element={<PerformanceReviews />} />
        <Route path="settings" element={<AppraisalSettings />} />
        <Route path="*" element={<Appraisals />} />
    </>
);
