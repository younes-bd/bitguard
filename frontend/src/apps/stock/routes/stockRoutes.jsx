import React from 'react';
import { Route } from 'react-router-dom';
import InventoryList from '../pages/lists/InventoryList';
import ReorderRules from '../pages/lists/ReorderRules';
import GoodsReceiptList from '../pages/operations/GoodsReceiptList';
import DeliveryNoteList from '../pages/operations/DeliveryNoteList';
import StockPickingList from '../pages/lists/StockPickingList';
import Replenishment from '../pages/operations/Replenishment';
import InventoryAdjustment from '../pages/operations/InventoryAdjustment';
import Scrap from '../pages/operations/Scrap';
import ProductVariants from '../pages/lists/ProductVariants';
import Lots from '../pages/lists/Lots';
import StockReport from '../pages/reports/StockReport';
import MovesHistory from '../pages/reports/MovesHistory';
import ValuationReport from '../pages/reports/ValuationReport';
import InventorySettings from '../pages/settings/InventorySettings';
import Warehouses from '../pages/settings/Warehouses';
import Locations from '../pages/settings/Locations';
import Routes from '../pages/settings/Routes';
import StockDashboard from '../pages/dashboards/StockDashboard';
import ShippingMethods from '../../sales/pages/settings/ShippingMethods';

export const stockRoutes = (
    <>
        <Route index element={<StockDashboard />} />
        <Route path="products" element={<InventoryList />} />
        <Route path="reorder-rules" element={<ReorderRules />} />
        <Route path="receipts" element={<GoodsReceiptList />} />
        <Route path="deliveries" element={<DeliveryNoteList />} />
        
        <Route path="transfers" element={<StockPickingList />} />
        <Route path="replenishment" element={<Replenishment />} />
        <Route path="adjustments" element={<InventoryAdjustment />} />
        <Route path="scrap" element={<Scrap />} />
        <Route path="product-variants" element={<ProductVariants />} />
        <Route path="lots" element={<Lots />} />
        <Route path="reports/stock" element={<StockReport />} />
        <Route path="reports/moves" element={<MovesHistory />} />
        <Route path="reports/valuation" element={<ValuationReport />} />
        <Route path="settings" element={<InventorySettings />} />
        <Route path="warehouses" element={<Warehouses />} />
        <Route path="locations" element={<Locations />} />
        <Route path="routes" element={<Routes />} />
        <Route path="shipping" element={<ShippingMethods />} />
    </>
);
