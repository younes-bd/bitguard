import React from 'react';
import { Route } from 'react-router-dom';
import ProductCatalog from '../pages/public/ProductCatalogPage';
import ProductDetail from '../pages/public/ProductDetailPage';
import Checkout from '../pages/public/CheckoutPage';
import WebsiteLayout from '../../../apps/website/layouts/WebsiteLayout';

export const ecommercePublicRoutes = (
    <Route element={<WebsiteLayout />}>
        <Route path="/store" element={<ProductCatalog />} />
        <Route path="/store/checkout" element={<Checkout />} />
        <Route path="/store/:slug" element={<ProductDetail />} />
    </Route>
);
