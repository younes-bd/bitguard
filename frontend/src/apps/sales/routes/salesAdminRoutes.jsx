import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import SalesDashboard from '../pages/dashboards/SalesDashboardPage';
import SalesOrderList from '../pages/documents/SalesOrderListPage';
import SalesOrderDetail from '../pages/documents/SalesOrderDetailPage';
import QuotationList from '../pages/documents/QuotationListPage';
import QuotationCreate from '../pages/documents/QuotationCreatePage';
import QuotationDetail from '../pages/documents/QuotationDetailPage';
import SalesTeamList from '../pages/lists/SalesTeamListPage';
import PricelistList from '../pages/lists/PricelistListPage';
import QuoteTemplateList from '../pages/lists/QuoteTemplateListPage';
import ShippingMethodList from '../pages/lists/ShippingMethodListPage';
import SalesToInvoice from '../pages/lists/SalesToInvoicePage';
import ProductCatalog from '../pages/lists/ProductCatalogPage';

import SalesReports from '../pages/reports/SalesReportsPage';
import SalesSettings from '../pages/settings/SalesSettingsPage';
export const salesAdminRoutes = (
    <>
        <Route index element={<SalesDashboard />} />
        <Route path="orders" element={<SalesOrderList />} />
        <Route path="orders/:id" element={<SalesOrderDetail />} />
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
