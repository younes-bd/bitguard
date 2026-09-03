import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CourseCatalogPage from '../pages/CourseCatalogPage';

export const elearningPublicRoutes = (
    <Routes>
        <Route index element={<CourseCatalogPage />} />
        <Route path="course/:id" element={<CourseCatalogPage />} />
    </Routes>
);
