import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import SalesDashboard from '../pages/dashboards/SalesDashboard';
import SaleOrderList from '../pages/documents/SaleOrderList';
import SaleOrderDetail from '../pages/documents/SaleOrderDetail';
import QuotationList from '../pages/documents/QuotationList';
import QuotationCreate from '../pages/documents/QuotationCreate';
import QuotationDetail from '../pages/documents/QuotationDetail';
import SalesTeamList from '../pages/lists/SalesTeamList';
import PricelistList from '../pages/lists/PricelistList';
import QuoteTemplateList from '../pages/lists/QuoteTemplateList';
import ShippingMethodList from '../pages/lists/ShippingMethodList';
import SalesToInvoice from '../pages/lists/SalesToInvoice';
import ProductCatalog from '../pages/lists/ProductCatalog';

import SalesReports from '../pages/reports/SalesReports';
import SalesSettings from '../pages/settings/SalesSettings';
export const salesAdminRoutes = (
    <>
        <Route index element={<SalesDashboard />} />
        <Route path="orders" element={<SaleOrderList />} />
        <Route path="orders/:id" element={<SaleOrderDetail />} />
        <Route path="quotations" element={<QuotationList />} />
        <Route path="quotations/create" element={<QuotationCreate />} />
        <Route path="quotations/:id" element={<QuotationDetail />} />
        <Route path="teams" element={<SalesTeamList />} />
        <Route path="pricelists" element={<PricelistList />} />
        <Route path="quote-templates" element={<QuoteTemplateList />} />
        <Route path="shipping" element={<ShippingMethodList />} />
        <Route path="to-invoice" element={<SalesToInvoice />} />
        <Route path="products" element={<ProductCatalog />} />
        <Route path="product-variants" element={<ProductCatalog />} />
        <Route path="customers" element={<Navigate to="/admin/crm/clients" replace />} />
        <Route path="reports" element={<SalesReports />} />
        <Route path="settings" element={<SalesSettings />} />
    </>
);
