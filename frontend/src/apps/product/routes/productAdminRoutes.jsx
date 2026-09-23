import React from 'react';
import { Route } from 'react-router-dom';
import ProductDashboard from '../pages/ProductDashboardPage';
import ProductList from '../pages/ProductListPage';
import ProductDetail from '../pages/ProductDetailPage';
import CategoryList from '../pages/CategoryListPage';
import AttributeList from '../pages/AttributeListPage';
import VariantList from '../pages/VariantListPage';
import ProductSettings from '../pages/ProductSettingsPage';

export const productAdminRoutes = (
  <>
    <Route index element={<ProductDashboard />} />
    <Route path="list" element={<ProductList />} />
    <Route path="new" element={<ProductDetail />} />
    <Route path=":id" element={<ProductDetail />} />
    <Route path="categories" element={<CategoryList />} />
    <Route path="attributes" element={<AttributeList />} />
    <Route path="variants" element={<VariantList />} />
    <Route path="settings" element={<ProductSettings />} />
  </>
);
