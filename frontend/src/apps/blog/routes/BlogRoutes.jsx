import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../../../core/layouts/PublicLayout';

import BlogList from '../pages/BlogList';
import BlogPost from '../pages/BlogPost';

export const BlogRoutes = () => {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route index element={<BlogList />} />
                <Route path=":slug" element={<BlogPost />} />
            </Route>
        </Routes>
    );
};
