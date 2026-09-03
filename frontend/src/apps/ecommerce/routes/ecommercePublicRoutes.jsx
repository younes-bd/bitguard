import React from 'react';
import { Route } from 'react-router-dom';
import ProductCatalog from '../pages/public/ProductCatalog';
import ProductDetail from '../pages/public/ProductDetail';
import Checkout from '../pages/public/Checkout';
import WebsiteLayout from '@/core/layouts/WebsiteLayout';

export const ecommercePublicRoutes = (
    <Route element={<WebsiteLayout />}>
        <Route path="/store" element={<ProductCatalog />} />
        <Route path="/store/checkout" element={<Checkout />} />
        <Route path="/store/:slug" element={<ProductDetail />} />
    </Route>
);
