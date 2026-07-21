import React from 'react';
import { Route } from 'react-router-dom';
import Appraisals from '../pages/lists/Appraisals';
import PerformanceReviews from '../pages/lists/PerformanceReviews';

export const appraisalsRoutes = (
    <>
        <Route index element={<Appraisals />} />
        <Route path="reviews" element={<PerformanceReviews />} />
        <Route path="settings" element={<div className="p-8">Settings placeholder</div>} />
        <Route path="*" element={<Appraisals />} />
    </>
);
