import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import LearningDashboard from '../pages/admin/LearningDashboardPage';
import LearningCourses from '../pages/admin/LearningCoursesPage';
import LearningContents from '../pages/admin/LearningContentsPage';
import LearningForums from '../pages/admin/LearningForumsPage';
import LearningCertifications from '../pages/admin/LearningCertificationsPage';
import LearningReviews from '../pages/admin/LearningReviewsPage';
import LearningReports from '../pages/admin/LearningReportsPage';
import LearningSettings from '../pages/admin/LearningSettingsPage';
import LearningCourseGroups from '../pages/admin/LearningCourseGroupsPage';
import LearningContentTags from '../pages/admin/LearningContentTagsPage';

export const learningAdminRoutes = (
    <>
        <Route index element={<LearningDashboard />} />
        <Route path="courses" element={<LearningCourses />} />
        <Route path="contents" element={<LearningContents />} />
        <Route path="forums" element={<LearningForums />} />
        <Route path="certifications" element={<LearningCertifications />} />
        <Route path="reviews" element={<LearningReviews />} />
        
        {/* Reports */}
        <Route path="reports" element={<LearningReports />} />
        <Route path="reports/courses" element={<LearningReports />} />
        <Route path="reports/contents" element={<LearningReports />} />
        <Route path="reports/revenues" element={<LearningReports />} />
        <Route path="reports/certifications" element={<LearningReports />} />
        <Route path="reports/reviews" element={<LearningReports />} />
        <Route path="reports/forums" element={<LearningReports />} />
        
        {/* Settings */}
        <Route path="settings" element={<LearningSettings />} />
        <Route path="course-groups" element={<LearningCourseGroups />} />
        <Route path="content-tags" element={<LearningContentTags />} />
    </>
);
