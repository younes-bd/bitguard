import React from 'react';
import { Route, Routes } from 'react-router-dom';
import JobsBoardPage from '../pages/JobsBoardPage';

export const recruitmentPublicRoutes = (
    <Routes>
        <Route index element={<JobsBoardPage />} />
        <Route path=":jobId" element={<JobsBoardPage />} />
    </Routes>
);
