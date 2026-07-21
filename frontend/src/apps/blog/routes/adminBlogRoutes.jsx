import React from 'react';
import { Route } from 'react-router-dom';

import BlogPostList from '../pages/admin/BlogPostList';
import BlogPostEditor from '../pages/features/BlogPostEditor';
import BlogTags from '../pages/admin/BlogTags';
import BlogCategories from '../pages/admin/BlogCategories';
import BlogSettings from '../pages/admin/BlogSettings';

export const adminBlogRoutes = (
    <>
        <Route index element={<BlogPostList />} />
        <Route path="new" element={<BlogPostEditor />} />
        <Route path=":id/edit" element={<BlogPostEditor />} />
        <Route path="tags" element={<BlogTags />} />
        <Route path="categories" element={<BlogCategories />} />
        <Route path="settings" element={<BlogSettings />} />
    </>
);
