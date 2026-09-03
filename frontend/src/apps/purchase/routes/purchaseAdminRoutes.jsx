import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import PurchaseOrderList from '../pages/lists/PurchaseOrderList';
import PurchaseOrderCreate from '../pages/vendors/PurchaseOrderCreate';
import PurchaseOrderDetail from '../pages/vendors/PurchaseOrderDetail';
import VendorList from '../pages/lists/VendorList';
import VendorCreate from '../pages/vendors/VendorCreate';
import VendorDetail from '../pages/vendors/VendorDetail';
import RfqList from '../pages/lists/RfqList';
import RFQDetail from '../pages/lists/RFQDetail';
import PurchaseAnalysis from '../pages/reports/PurchaseAnalysis';
import VendorPricelists from '../pages/settings/VendorPricelists';
import PurchaseSettings from '../pages/settings/PurchaseSettings';
import ProductVariants from '../pages/lists/ProductVariants';

export const purchaseAdminRoutes = (
    <>
        <Route index element={<PurchaseOrderList />} />
        <Route path="orders" element={<PurchaseOrderList />} />
        <Route path="orders/create" element={<PurchaseOrderCreate />} />
        <Route path="orders/:id" element={<PurchaseOrderDetail />} />
        <Route path="rfqs" element={<RfqList />} />
        <Route path="rfqs/:id" element={<RFQDetail />} />
        <Route path="vendors" element={<VendorList />} />
        <Route path="vendors/create" element={<VendorCreate />} />
        <Route path="vendors/:id" element={<VendorDetail />} />
        
        {/* Phase 3 Placeholders */}
        <Route path="reports" element={<PurchaseAnalysis />} />
        <Route path="pricelists" element={<VendorPricelists />} />
        <Route path="settings" element={<PurchaseSettings />} />
        <Route path="product-variants" element={<ProductVariants />} />
        <Route path="products" element={<Navigate to="/admin/stock/inventory" replace />} />
    </>
);
