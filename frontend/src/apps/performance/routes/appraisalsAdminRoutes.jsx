import React from 'react';
import { Route } from 'react-router-dom';
import Appraisals from '../pages/lists/AppraisalsPage';
import PerformanceReviews from '../pages/lists/PerformanceReviewsPage';
import AppraisalSettings from '../pages/settings/AppraisalSettingsPage';

export const appraisalsAdminRoutes = (
    <>
        <Route index element={<Appraisals />} />
        <Route path="reviews" element={<PerformanceReviews />} />
        <Route path="settings" element={<AppraisalSettings />} />
        <Route path="*" element={<Appraisals />} />
    </>
);
