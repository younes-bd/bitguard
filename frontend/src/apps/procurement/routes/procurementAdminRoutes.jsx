import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ProcurementOrderList from '../pages/lists/ProcurementOrderListPage';
import ProcurementOrderCreate from '../pages/vendors/ProcurementOrderCreatePage';
import ProcurementOrderDetail from '../pages/vendors/ProcurementOrderDetailPage';
import VendorList from '../pages/lists/VendorListPage';
import VendorCreate from '../pages/vendors/VendorCreatePage';
import VendorDetail from '../pages/vendors/VendorDetailPage';
import RfqList from '../pages/lists/RfqListPage';
import RFQDetail from '../pages/lists/RFQDetailPage';
import ProcurementAnalysis from '../pages/reports/ProcurementAnalysisPage';
import VendorPricelists from '../pages/settings/VendorPricelistsPage';
import ProcurementSettings from '../pages/settings/ProcurementSettingsPage';
import ProductVariants from '../pages/lists/ProductVariantsPage';

export const procurementAdminRoutes = (
    <>
        <Route index element={<ProcurementOrderList />} />
        <Route path="orders" element={<ProcurementOrderList />} />
        <Route path="orders/create" element={<ProcurementOrderCreate />} />
        <Route path="orders/:id" element={<ProcurementOrderDetail />} />
        <Route path="rfqs" element={<RfqList />} />
        <Route path="rfqs/:id" element={<RFQDetail />} />
        <Route path="vendors" element={<VendorList />} />
        <Route path="vendors/create" element={<VendorCreate />} />
        <Route path="vendors/:id" element={<VendorDetail />} />
        
        {/* Phase 3 Placeholders */}
        <Route path="reports" element={<ProcurementAnalysis />} />
        <Route path="pricelists" element={<VendorPricelists />} />
        <Route path="settings" element={<ProcurementSettings />} />
        <Route path="product-variants" element={<ProductVariants />} />
        <Route path="products" element={<Navigate to="/admin/stock/inventory" replace />} />
    </>
);
