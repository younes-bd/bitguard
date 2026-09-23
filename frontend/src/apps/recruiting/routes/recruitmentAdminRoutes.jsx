import React from 'react';
import { Route } from 'react-router-dom';
import RecruitmentBoard from '../pages/lists/RecruitmentBoardPage';
import JobApplications from '../pages/lists/JobApplicationsPage';
import RecruitmentReports from '../pages/reports/RecruitmentReportsPage';

export const recruitmentAdminRoutes = (
    <>
        <Route index element={<RecruitmentBoard />} />
        <Route path="applications" element={<JobApplications />} />
        <Route path="reports" element={<RecruitmentReports />} />
        <Route path="*" element={<RecruitmentBoard />} />
    </>
);
