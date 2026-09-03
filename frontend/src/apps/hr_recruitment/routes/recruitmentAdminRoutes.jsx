import React from 'react';
import { Route } from 'react-router-dom';
import RecruitmentBoard from '../pages/lists/RecruitmentBoard';
import JobApplications from '../pages/lists/JobApplications';
import RecruitmentReports from '../pages/reports/RecruitmentReports';

export const recruitmentAdminRoutes = (
    <>
        <Route index element={<RecruitmentBoard />} />
        <Route path="applications" element={<JobApplications />} />
        <Route path="reports" element={<RecruitmentReports />} />
        <Route path="*" element={<RecruitmentBoard />} />
    </>
);
