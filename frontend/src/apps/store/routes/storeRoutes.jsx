import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import StoreDashboard from '../pages/dashboards/StoreDashboard';
import StoreCustomization from '../pages/StoreCustomization';
import CategoryManagement from '../pages/CategoryManagement';
import ProductManagement from '../pages/ProductManagement';
import StoreOrders from '../pages/StoreOrders';
import CustomerManagement from '../pages/CustomerManagement';
import ShippingSettings from '../pages/ShippingSettings';
import LandingPages from '../pages/LandingPages';
import PixelTracking from '../pages/PixelTracking';
import AddOnManagement from '../pages/AddOnManagement';
import SubscriptionManagement from '../pages/SubscriptionManagement';
import StoreSettings from '../pages/StoreSettings';
import ServiceCatalog from '../pages/ServiceCatalog';

export const storeRoutes = (
    <>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StoreDashboard />} />
        <Route path="customization" element={<StoreCustomization />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="services" element={<ServiceCatalog />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<StoreOrders />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="shipping" element={<ShippingSettings />} />
        <Route path="landing-pages" element={<LandingPages />} />
        <Route path="tracking" element={<PixelTracking />} />
        <Route path="addons" element={<AddOnManagement />} />
        <Route path="subscriptions" element={<SubscriptionManagement />} />
        <Route path="settings" element={<StoreSettings />} />
    </>
);

