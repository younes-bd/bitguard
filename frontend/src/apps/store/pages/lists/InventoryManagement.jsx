import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, AlertTriangle, Upload, Download, Edit2, Save } from 'lucide-react';
// import { storeApi } from '../../api/storeApi';

export default function InventoryManagement() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        // Mock fetch inventory
        setTimeout(() => {
            setInventory([
                { id: 1, name: 'Enterprise Firewall Appliance', sku: 'FW-ENT-1000', stock_quantity: 45, low_stock_threshold: 10, track_stock: true },
                { id: 2, name: 'Advanced Threat Protection License (1Yr)', sku: 'LIC-ATP-1Y', stock_quantity: 9999, low_stock_threshold: 100, track_stock: false },
                { id: 3, name: 'Server Rack 42U', sku: 'HW-RACK-42U', stock_quantity: 8, low_stock_threshold: 15, track_stock: true },
                { id: 4, name: 'Network Switch 48-Port PoE', sku: 'HW-SW-48P', stock_quantity: 2, low_stock_threshold: 10, track_stock: true }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const handleEditClick = (item) => {
        setEditingId(item.id);
        setEditValue(item.stock_quantity.toString());
    };

    const handleSaveClick = (id) => {
        setInventory(prev => prev.map(item => 
            item.id === id ? { ...item, stock_quantity: parseInt(editValue, 10) || 0 } : item
        ));
        setEditingId(null);
    };

    const filteredInventory = inventory.filter(i => 
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        i.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        Inventory Management
                    </h1>
                    <p className="text-gray-500 mt-1">Track hardware stock, software licenses, and fulfillment capacity.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        <Upload className="w-4 h-4" /> Bulk Adjust
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Tracked Items</div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {inventory.filter(i => i.track_stock).length}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-red-200 dark:border-red-900/50 shadow-sm">
                    <div className="text-sm font-medium text-red-500 mb-1 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Low Stock Alerts
                    </div>
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                        {inventory.filter(i => i.track_stock && i.stock_quantity <= i.low_stock_threshold).length}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-4 bg-gray-50 dark:bg-gray-800/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by product name or SKU..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                <th className="p-4 font-medium">Product / SKU</th>
                                <th className="p-4 font-medium">Tracking</th>
                                <th className="p-4 font-medium text-right">Stock Qty</th>
                                <th className="p-4 font-medium text-right">Low Stock At</th>
                                <th className="p-4 font-medium text-right w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">Loading inventory data...</td>
                                </tr>
                            ) : filteredInventory.map(item => {
                                const isLowStock = item.track_stock && item.stock_quantity <= item.low_stock_threshold;
                                
                                return (
                                    <tr key={item.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${isLowStock ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${isLowStock ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                                    <Package className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</div>
                                                    <div className="text-xs text-gray-500 font-mono mt-0.5">{item.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${item.track_stock ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
                                                {item.track_stock ? 'Tracked' : 'Unmanaged'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {editingId === item.id ? (
                                                <input 
                                                    type="number"
                                                    className="w-20 text-right bg-white dark:bg-gray-900 border border-blue-500 rounded px-2 py-1 text-gray-900 dark:text-white"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className={`font-bold text-lg ${isLowStock ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                                                    {item.track_stock ? item.stock_quantity : 'âˆž'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right text-gray-500 dark:text-gray-400">
                                            {item.track_stock ? item.low_stock_threshold : '-'}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            {item.track_stock && (
                                                editingId === item.id ? (
                                                    <button onClick={() => handleSaveClick(item.id)} className="p-2 text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors">
                                                        <Save className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleEditClick(item)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
