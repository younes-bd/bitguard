import React from 'react';
import { Route } from 'react-router-dom';
import PurchaseOrderList from '../pages/lists/PurchaseOrderList';
import PurchaseOrderCreate from '../pages/vendors/PurchaseOrderCreate';
import PurchaseOrderDetail from '../pages/vendors/PurchaseOrderDetail';
import VendorList from '../pages/lists/VendorList';
import VendorCreate from '../pages/vendors/VendorCreate';
import VendorDetail from '../pages/vendors/VendorDetail';
import RfqList from '../pages/lists/RfqList';

export const purchaseRoutes = (
    <>
        <Route index element={<PurchaseOrderList />} />
        <Route path="orders" element={<PurchaseOrderList />} />
        <Route path="orders/create" element={<PurchaseOrderCreate />} />
        <Route path="orders/:id" element={<PurchaseOrderDetail />} />
        <Route path="rfqs" element={<RfqList />} />
        <Route path="vendors" element={<VendorList />} />
        <Route path="vendors/create" element={<VendorCreate />} />
        <Route path="vendors/:id" element={<VendorDetail />} />
    </>
);
