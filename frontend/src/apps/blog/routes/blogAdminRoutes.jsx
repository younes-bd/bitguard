import React from 'react';
import { Route } from 'react-router-dom';

import BlogPostList from '../pages/admin/BlogPostListPage';
import BlogPostEditor from '../pages/features/BlogPostEditorPage';
import BlogTags from '../pages/admin/BlogTagsPage';
import BlogCategories from '../pages/admin/BlogCategoriesPage';
import BlogSettings from '../pages/admin/BlogSettingsPage';

export const blogAdminRoutes = (
    <>
        <Route index element={<BlogPostList />} />
        <Route path="new" element={<BlogPostEditor />} />
        <Route path=":id/edit" element={<BlogPostEditor />} />
        <Route path="tags" element={<BlogTags />} />
        <Route path="categories" element={<BlogCategories />} />
        <Route path="settings" element={<BlogSettings />} />
    </>
);
