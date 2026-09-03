import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import ElearningDashboard from '../pages/admin/ElearningDashboard';
import ElearningCourses from '../pages/admin/ElearningCourses';
import ElearningContents from '../pages/admin/ElearningContents';
import ElearningForums from '../pages/admin/ElearningForums';
import ElearningCertifications from '../pages/admin/ElearningCertifications';
import ElearningReviews from '../pages/admin/ElearningReviews';
import ElearningReports from '../pages/admin/ElearningReports';
import ElearningSettings from '../pages/admin/ElearningSettings';
import ElearningCourseGroups from '../pages/admin/ElearningCourseGroups';
import ElearningContentTags from '../pages/admin/ElearningContentTags';

export const elearningAdminRoutes = (
    <>
        <Route index element={<ElearningDashboard />} />
        <Route path="courses" element={<ElearningCourses />} />
        <Route path="contents" element={<ElearningContents />} />
        <Route path="forums" element={<ElearningForums />} />
        <Route path="certifications" element={<ElearningCertifications />} />
        <Route path="reviews" element={<ElearningReviews />} />
        
        {/* Reports */}
        <Route path="reports" element={<ElearningReports />} />
        <Route path="reports/courses" element={<ElearningReports />} />
        <Route path="reports/contents" element={<ElearningReports />} />
        <Route path="reports/revenues" element={<ElearningReports />} />
        <Route path="reports/certifications" element={<ElearningReports />} />
        <Route path="reports/reviews" element={<ElearningReports />} />
        <Route path="reports/forums" element={<ElearningReports />} />
        
        {/* Settings */}
        <Route path="settings" element={<ElearningSettings />} />
        <Route path="course-groups" element={<ElearningCourseGroups />} />
        <Route path="content-tags" element={<ElearningContentTags />} />
    </>
);
