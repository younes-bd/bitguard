import React, { useState, useEffect } from 'react';
import { storeService } from '../../../shared/core/services/storeService';
import { Plus, Search, Edit2, Trash2, Package, Filter, MoreVertical } from 'lucide-react';

import CreateProductModal from '../components/CreateProductModal';

const StoreProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            // Fetch real data
            const data = await storeService.getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProduct = async (productData) => {
        setIsCreating(true);
        try {
            if (editingProduct) {
                await storeService.updateProduct(editingProduct.id, productData);
            } else {
                await storeService.createProduct(productData);
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            loadProducts(); // Refresh list
        } catch (error) {
            console.error("Failed to save product", error);
            alert("Failed to save product. See console for details.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await storeService.deleteProduct(productId);
            loadProducts();
        } catch (error) {
            console.error("Failed to delete product", error);
            alert("Failed to delete product");
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Products</h1>
                    <p className="text-slate-400">Manage your software, hardware, and service offerings.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-lg shadow-indigo-500/20 transition-all"
                >
                    <Plus size={18} />
                    <span>Add Product</span>
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                    <Filter size={18} />
                    <span>Filters</span>
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-xs">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Sales</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {products.length > 0 ? products.map((product) => (
                                <tr key={product.id} className="group hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white">{product.name}</div>
                                                <div className="text-xs text-slate-500">ID: #{product.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-300">{product.product_type || product.category}</td>
                                    <td className="p-4 font-mono text-slate-200">${product.price}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${product.status === 'Active' || product.is_active
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                            {product.status || (product.is_active ? 'Active' : 'Inactive')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right text-slate-300">{product.sales || 0}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEditClick(product)}
                                                className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(product.id)}
                                                className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package size={40} className="text-slate-700" />
                                            <p>No products found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <CreateProductModal
                    initialData={editingProduct}
                    onClose={handleCloseModal}
                    onSave={handleSaveProduct}
                    loading={isCreating}
                />
            )}
        </div>
    );
};

export default StoreProducts;
