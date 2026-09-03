import React from 'react';
import { Route } from 'react-router-dom';
import ProductDashboard from '../pages/ProductDashboard';
import ProductList from '../pages/ProductList';
import ProductDetail from '../pages/ProductDetail';
import CategoryList from '../pages/CategoryList';
import AttributeList from '../pages/AttributeList';
import VariantList from '../pages/VariantList';
import ProductSettings from '../pages/ProductSettings';

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
