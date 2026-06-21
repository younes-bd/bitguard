import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../../../core/layouts/PublicLayout';

import BlogList from '../pages/lists/BlogList';
import BlogPost from '../pages/details/BlogPost';

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
