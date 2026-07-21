import React from 'react';
import { Route } from 'react-router-dom';
import RecruitmentBoard from '../pages/lists/RecruitmentBoard';

export const recruitmentRoutes = (
    <>
        <Route index element={<RecruitmentBoard />} />
        <Route path="applications" element={<div className="p-8">Applications placeholder</div>} />
        <Route path="reports" element={<div className="p-8">Reports placeholder</div>} />
        <Route path="*" element={<RecruitmentBoard />} />
    </>
);
