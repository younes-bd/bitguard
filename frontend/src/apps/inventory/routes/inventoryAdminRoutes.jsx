import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import InventoryList from '../pages/lists/InventoryListPage';
import ReorderRules from '../pages/lists/ReorderRulesPage';
import GoodsReceiptList from '../pages/operations/GoodsReceiptListPage';
import GoodsReceiptDetail from '../pages/operations/GoodsReceiptDetailPage';
import ShippingNoteList from '../pages/operations/ShippingNoteListPage';
import InventoryPickingList from '../pages/lists/InventoryPickingListPage';
import InventoryPickingDetail from '../pages/operations/InventoryPickingDetailPage';
import Replenishment from '../pages/operations/ReplenishmentPage';
import InventoryAdjustment from '../pages/operations/InventoryAdjustmentPage';
import InventoryAdjustmentList from '../pages/operations/InventoryAdjustmentListPage';
import InventoryAdjustmentDetail from '../pages/operations/InventoryAdjustmentDetailPage';
import Scrap from '../pages/operations/ScrapPage';
import ProductVariants from '../pages/lists/ProductVariantsPage';
import Lots from '../pages/lists/LotsPage';
import InventoryReport from '../pages/reports/InventoryReportPage';
import MovesHistory from '../pages/reports/MovesHistoryPage';
import ValuationReport from '../pages/reports/ValuationReportPage';
import InventorySettings from '../pages/settings/InventorySettingsPage';
import Warehouses from '../pages/settings/WarehousesPage';
import Locations from '../pages/settings/LocationsPage';
import Routes from '../pages/settings/RoutesPage';
import InventoryDashboard from '../pages/dashboards/InventoryDashboardPage';

export const inventoryAdminRoutes = (
    <>
        <Route index element={<InventoryDashboard />} />
        <Route path="products" element={<InventoryList />} />
        <Route path="reorder-rules" element={<ReorderRules />} />
        <Route path="receipts" element={<GoodsReceiptList />} />
        <Route path="receipts/:id" element={<GoodsReceiptDetail />} />
        <Route path="deliveries" element={<ShippingNoteList />} />
        
        <Route path="transfers" element={<InventoryPickingList />} />
        <Route path="transfers/:id" element={<InventoryPickingDetail />} />
        <Route path="replenishment" element={<Replenishment />} />
        <Route path="adjustments" element={<InventoryAdjustmentList />} />
        <Route path="adjustments/create" element={<InventoryAdjustment />} />
        <Route path="adjustments/:id" element={<InventoryAdjustmentDetail />} />
        <Route path="scrap" element={<Scrap />} />
        <Route path="product-variants" element={<ProductVariants />} />
        <Route path="lots" element={<Lots />} />
        <Route path="reports/stock" element={<InventoryReport />} />
        <Route path="reports/moves" element={<MovesHistory />} />
        <Route path="reports/valuation" element={<ValuationReport />} />
        <Route path="settings" element={<InventorySettings />} />
        <Route path="warehouses" element={<Warehouses />} />
        <Route path="locations" element={<Locations />} />
        <Route path="routes" element={<Routes />} />
        <Route path="shipping" element={<Navigate to="/admin/sales/shipping" replace />} />
    </>
);
