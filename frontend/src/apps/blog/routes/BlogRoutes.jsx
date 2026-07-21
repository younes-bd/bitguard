import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WebsiteLayout from '../../../core/layouts/WebsiteLayout';

import BlogList from '../pages/public/BlogList';
import BlogPost from '../pages/public/BlogPost';

export const BlogRoutes = () => {
    return (
        <Routes>
            <Route element={<WebsiteLayout />}>
                <Route index element={<BlogList />} />
                <Route path=":slug" element={<BlogPost />} />
            </Route>
        </Routes>
    );
};
