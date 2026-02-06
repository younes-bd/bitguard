import React, { useState } from 'react';
import { Package, Plus, DollarSign, Settings, Trash2, Edit, Save } from 'lucide-react';
import { storeService } from '../../../shared/core/services/storeService';

const StoreAdmin = () => {
    // Mock Admin Data for UI (Backend integration can come next)
    const [products, setProducts] = useState([
        { id: 1, name: 'BitGuard Enterprise License', price: 1200, stock: 999, type: 'digital' },
        { id: 2, name: 'Dell Latitude 5540', price: 1100, stock: 50, type: 'physical' },
    ]);

    const [isEditing, setIsEditing] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', type: 'digital' });

    const handleAddProduct = () => {
        const product = { id: Date.now(), ...newProduct };
        setProducts([...products, product]);
        setNewProduct({ name: '', price: '', stock: '', type: 'digital' });
    };

    const handleDelete = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Store Administration</h1>
                    <p className="text-slate-400">Manage products, inventory, and licensing.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700">
                        <Settings size={18} /> Settings
                    </button>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-500">
                        <Plus size={18} /> Add New Product
                    </button>
                </div>
            </div>

            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-slate-900/50">
                    <div className="text-slate-400 text-sm uppercase font-bold mb-2">Total Revenue</div>
                    <div className="text-3xl font-bold text-white">$124,500</div>
                    <div className="text-emerald-400 text-xs mt-1">+12% this month</div>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-slate-900/50">
                    <div className="text-slate-400 text-sm uppercase font-bold mb-2">Low Stock Alerts</div>
                    <div className="text-3xl font-bold text-amber-500">3</div>
                    <div className="text-slate-500 text-xs mt-1">Items below threshold</div>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-slate-900/50">
                    <div className="text-slate-400 text-sm uppercase font-bold mb-2">Active Subscriptions</div>
                    <div className="text-3xl font-bold text-blue-500">894</div>
                    <div className="text-slate-500 text-xs mt-1">Total active keys</div>
                </div>
            </div>

            {/* Inventory Management Table */}
            <div className="glass-panel rounded-xl border border-slate-700/50 overflow-hidden">
                <div className="p-6 border-b border-slate-700/50 bg-slate-900/30">
                    <h2 className="text-xl font-bold text-white">Inventory Management</h2>
                </div>
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900/50 uppercase font-medium border-b border-slate-700/50">
                        <tr>
                            <th className="px-6 py-4">Product Name</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-slate-800/30">
                                <td className="px-6 py-4 font-medium text-slate-200">{product.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${product.type === 'digital' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-400'
                                        }`}>{product.type}</span>
                                </td>
                                <td className="px-6 py-4 text-white font-bold">${product.price}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${product.stock > 100 ? 'bg-emerald-500' : product.stock > 10 ? 'bg-amber-500' : 'bg-red-500'
                                            }`}></div>
                                        {product.stock}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoreAdmin;
