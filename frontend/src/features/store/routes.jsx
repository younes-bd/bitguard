import React from 'react';
import { Route } from 'react-router-dom';
import StoreDashboard from './dashboards/StoreDashboard';
import ProductCatalog from './pages/ProductCatalog';
import PricingPage from './pages/PricingPage';
import Checkout from './pages/Checkout';
import OrderList from './pages/OrderList';
import StoreAdmin from './pages/StoreAdmin';

export const storeRoutes = (
    <>
        {/* Client Dashboard / My Portal */}
        <Route path="dashboard" element={<StoreDashboard />} />

        <Route path="products" element={<ProductCatalog />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="admin" element={<StoreAdmin />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="orders" element={<OrderList />} />
    </>
);

