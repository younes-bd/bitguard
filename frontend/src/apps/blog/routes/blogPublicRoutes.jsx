import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WebsiteLayout from '../../../apps/website/layouts/WebsiteLayout';

import BlogList from '../pages/public/BlogListPage';
import BlogPost from '../pages/public/BlogPostPage';

export const blogPublicRoutes = () => {
    return (
        <Routes>
            <Route element={<WebsiteLayout />}>
                <Route index element={<BlogList />} />
                <Route path=":slug" element={<BlogPost />} />
            </Route>
        </Routes>
    );
};
