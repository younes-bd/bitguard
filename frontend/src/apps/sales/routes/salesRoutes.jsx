import React from 'react';
import { Route } from 'react-router-dom';
import SaleOrderList from '../pages/documents/SaleOrderList';
import QuotationList from '../pages/documents/QuotationList';
import QuotationCreate from '../pages/documents/QuotationCreate';
import QuotationDetail from '../pages/documents/QuotationDetail';

export const salesRoutes = (
    <>
        <Route index element={<SaleOrderList />} />
        <Route path="orders" element={<SaleOrderList />} />
        <Route path="quotations" element={<QuotationList />} />
        <Route path="quotations/create" element={<QuotationCreate />} />
        <Route path="quotations/:id" element={<QuotationDetail />} />
    </>
);
