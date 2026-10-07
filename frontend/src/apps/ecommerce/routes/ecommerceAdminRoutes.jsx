import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import EcommerceDashboard from '../pages/admin/EcommerceDashboardPage';
import StoreCustomization from '../pages/settings/StoreCustomizationPage';
import CategoryManagement from '../pages/admin/CategoryManagementPage';
import StoreProducts from '../pages/admin/StoreProductsPage';
import StoreOrders from '../pages/admin/StoreOrdersPage';
import CustomerManagement from '../pages/admin/CustomerManagementPage';
import ShippingSettings from '../pages/settings/ShippingSettingsPage';
import LandingPages from '../pages/features/LandingPagesPage';
import PixelTracking from '../pages/features/PixelTrackingPage';
import AddOnManagement from '../pages/settings/AddOnManagementPage';
import SubscriptionManagement from '../pages/admin/SubscriptionManagementPage';
import StoreSettings from '../pages/admin/StoreSettingsPage';
import ServiceCatalog from '../pages/public/ServiceCatalogPage';

// Odoo-style components
import UnpaidOrders from '../pages/admin/UnpaidOrdersPage';
import AbandonedCarts from '../pages/admin/AbandonedCartsPage';
import PaymentProviders from '../pages/admin/PaymentProvidersPage';
import ShippingMethods from '../pages/admin/ShippingMethodsPage';

export const ecommerceAdminRoutes = (
    <>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<EcommerceDashboard />} />
        <Route path="customization" element={<StoreCustomization />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="services" element={<ServiceCatalog />} />
        <Route path="products" element={<StoreProducts />} />
        
        {/* Odoo style eCommerce */}
        <Route path="orders" element={<StoreOrders />} />
        <Route path="unpaid-orders" element={<UnpaidOrders />} />
        <Route path="abandoned-carts" element={<AbandonedCarts />} />
        <Route path="payment-providers" element={<PaymentProviders />} />
        <Route path="shipping" element={<ShippingMethods />} />
        
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="tracking" element={<PixelTracking />} />
        <Route path="addons" element={<AddOnManagement />} />
        <Route path="subscriptions" element={<SubscriptionManagement />} />
        <Route path="settings" element={<StoreSettings />} />
    </>
);
