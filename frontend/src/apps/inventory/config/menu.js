import {
    Activity, BarChart3, Box, Building2,
    Clock, DollarSign, Edit3, GitBranch,
    Layers, LayoutDashboard, MapPin, RefreshCw,
    Settings, Tag, Tags, Trash2,
    Truck
} from 'lucide-react';

export const stockMenu = [
        {
            title: 'Inventory',
            items: [
                { label: 'Overview', icon: LayoutDashboard, path: '/admin/stock' },
            ]
        },
        {
            title: 'Operations',
            items: [
                { label: 'Receipts', icon: Truck, path: '/admin/inventory/receipts' },
                { label: 'Deliveries', icon: Truck, path: '/admin/inventory/deliveries' },
                { label: 'Transfers', icon: RefreshCw, path: '/admin/inventory/transfers' },
                { label: 'Replenishment', icon: RefreshCw, path: '/admin/inventory/replenishment' },
                { label: 'Inventory Adjustments', icon: Edit3, path: '/admin/inventory/adjustments' },
                { label: 'Scrap', icon: Trash2, path: '/admin/inventory/scrap' },
                { label: 'Landed Costs', icon: DollarSign, path: '/admin/inventory/landed-costs' },
                { label: 'Run Scheduler', icon: Clock, path: '/admin/inventory/run-scheduler' },
            ]
        },
        {
            title: 'Products',
            items: [
                { label: 'Products', icon: Box, path: '/admin/inventory/products' },
                { label: 'Product Variants', icon: Layers, path: '/admin/inventory/product-variants' },
                { label: 'Lots/Serial Numbers', icon: Tag, path: '/admin/inventory/lots' },
                { label: 'Packages', icon: Box, path: '/admin/inventory/packages' },
                { label: 'Putaway Rules', icon: GitBranch, path: '/admin/inventory/putaway' },
            ]
        },
        {
            title: 'Reports',
            items: [
                { label: 'Inventory', icon: Activity, path: '/admin/inventory/reports/stock' },
                { label: 'Moves History', icon: Clock, path: '/admin/inventory/reports/moves' },
                { label: 'Inventory Valuation', icon: DollarSign, path: '/admin/inventory/reports/valuation' },
                { label: 'Performance', icon: BarChart3, path: '/admin/inventory/reports/performance' },
            ]
        },
        {
            title: 'Configuration',
            items: [
                { label: 'Settings', icon: Settings, path: '/admin/inventory/settings' },
                { label: 'Warehouses', icon: Building2, path: '/admin/inventory/warehouses' },
                { label: 'Locations', icon: MapPin, path: '/admin/inventory/locations' },
                { label: 'Routes', icon: GitBranch, path: '/admin/inventory/routes' },
                { label: 'Rules', icon: GitBranch, path: '/admin/inventory/rules' },
                { label: 'Operation Types', icon: Layers, path: '/admin/inventory/operation-types' },
                { label: 'Product Categories', icon: Tags, path: '/admin/inventory/product-categories' },
                { label: 'Attributes', icon: Tag, path: '/admin/inventory/attributes' },
                { label: 'Reordering Rules', icon: RefreshCw, path: '/admin/inventory/reorder-rules' },
                { label: 'Shipping Methods', icon: Truck, path: '/admin/inventory/shipping' },
            ]
        }
    ];
