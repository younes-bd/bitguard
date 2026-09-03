import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import EcommerceDashboard from '../pages/admin/EcommerceDashboard';
import StoreCustomization from '../pages/settings/StoreCustomization';
import CategoryManagement from '../pages/admin/CategoryManagement';
import StoreProducts from '../pages/admin/StoreProducts';
import StoreOrders from '../pages/admin/StoreOrders';
import CustomerManagement from '../pages/admin/CustomerManagement';
import ShippingSettings from '../pages/settings/ShippingSettings';
import LandingPages from '../pages/features/LandingPages';
import PixelTracking from '../pages/features/PixelTracking';
import AddOnManagement from '../pages/settings/AddOnManagement';
import SubscriptionManagement from '../pages/admin/SubscriptionManagement';
import StoreSettings from '../pages/admin/StoreSettings';
import ServiceCatalog from '../pages/public/ServiceCatalog';

// Odoo-style components
import UnpaidOrders from '../pages/admin/UnpaidOrders';
import AbandonedCarts from '../pages/admin/AbandonedCarts';
import PaymentProviders from '../pages/admin/PaymentProviders';
import ShippingMethods from '../pages/admin/ShippingMethods';

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
