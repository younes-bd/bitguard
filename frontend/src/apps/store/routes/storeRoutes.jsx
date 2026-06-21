import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import StoreDashboard from '../pages/dashboards/StoreDashboard';
import StoreCustomization from '../pages/settings/StoreCustomization';
import CategoryManagement from '../pages/lists/CategoryManagement';
import StoreProducts from '../pages/lists/StoreProducts';
import StoreOrders from '../pages/lists/StoreOrders';
import CustomerManagement from '../pages/lists/CustomerManagement';
import ShippingSettings from '../pages/settings/ShippingSettings';
import LandingPages from '../pages/features/LandingPages';
import PixelTracking from '../pages/features/PixelTracking';
import AddOnManagement from '../pages/settings/AddOnManagement';
import SubscriptionManagement from '../pages/lists/SubscriptionManagement';
import StoreSettings from '../pages/settings/StoreSettings';
import ServiceCatalog from '../pages/lists/ServiceCatalog';

export const storeRoutes = (
    <>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StoreDashboard />} />
        <Route path="customization" element={<StoreCustomization />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="services" element={<ServiceCatalog />} />
        <Route path="products" element={<StoreProducts />} />
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
