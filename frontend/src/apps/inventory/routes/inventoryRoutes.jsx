import React from 'react';
import { Route } from 'react-router-dom';
import InventoryList from '../pages/lists/InventoryList';
import ReorderRules from '../pages/lists/ReorderRules';
import GoodsReceiptList from '../pages/operations/GoodsReceiptList';
import DeliveryNoteList from '../pages/operations/DeliveryNoteList';

export const inventoryRoutes = (
    <>
        <Route index element={<InventoryList />} />
        <Route path="products" element={<InventoryList />} />
        <Route path="reorder-rules" element={<ReorderRules />} />
        <Route path="receipts" element={<GoodsReceiptList />} />
        <Route path="deliveries" element={<DeliveryNoteList />} />
    </>
);
