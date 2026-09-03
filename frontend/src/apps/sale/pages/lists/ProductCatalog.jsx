import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, Filter, ShoppingBag, DollarSign, List, Grid as GridIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import client from '@/core/api/client';
import { salesService } from '../../api/salesService';

const ProductCatalog = () => {
    const [products, setProducts] = useState([]);
    const [pricelists, setPricelists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedPricelist, setSelectedPricelist] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [productsRes, pricelistsRes] = await Promise.all([
                client.get('/store/products/'),
                salesService.getPricelists()
            ]);
            setProducts(productsRes.data?.data || productsRes.data?.results || productsRes.data || []);
            
            const fetchedPricelists = pricelistsRes?.results || pricelistsRes || [];
            setPricelists(fetchedPricelists);
            if (fetchedPricelists.length > 0) {
                setSelectedPricelist(fetchedPricelists[0].id);
            }
        } catch (error) {
            console.error("Failed to load catalog data", error);
            toast.error("Failed to load catalog data");
        } finally {
            setLoading(false);
        }
    };

    const categories = Array.from(new Set(products.map(p => p.product_type || p.category).filter(Boolean)));

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || (p.product_type === categoryFilter || p.category === categoryFilter);
        return matchesSearch && matchesCategory;
    });

    const handleAddToQuote = (product) => {
        // In a full implementation, this might open a modal to select quantity or create a draft quote.
        toast.success(`Added ${product.name} to quote with pricelist #${selectedPricelist || 'Default'}`);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <ShoppingBag className="text-indigo-400" /> Sales Catalog
                    </h1>
                    <p className="text-slate-400">Browse products and quickly add them to customer quotations.</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-1 rounded-lg">
                    <button 
                        onClick={() => setViewMode('grid')} 
                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <GridIcon size={18} />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')} 
                        className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or SKU..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-4">
                    <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-3 min-w-[200px]">
                        <DollarSign size={16} className="text-slate-400 mr-2" />
                        <select 
                            value={selectedPricelist}
                            onChange={(e) => setSelectedPricelist(e.target.value)}
                            className="bg-transparent text-slate-300 py-2.5 w-full focus:outline-none text-sm"
                        >
                            <option value="">Default Pricelist</option>
                            {pricelists.map(pl => (
                                <option key={pl.id} value={pl.id}>{pl.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-3 min-w-[200px]">
                        <Filter size={16} className="text-slate-400 mr-2" />
                        <select 
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-transparent text-slate-300 py-2.5 w-full focus:outline-none text-sm capitalize"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
                    <p>Loading catalog...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-16 text-center shadow-lg">
                    <Package size={48} className="mx-auto text-slate-600 mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No products found</h3>
                    <p className="text-slate-400">Try adjusting your search or category filter.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all group flex flex-col">
                            <div className="h-48 bg-slate-950 flex items-center justify-center p-6 relative">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className="max-h-full object-contain" />
                                ) : (
                                    <Package size={64} className="text-slate-800 group-hover:text-slate-700 transition-colors" />
                                )}
                                <div className="absolute top-3 right-3">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800/80 text-slate-300 backdrop-blur-sm border border-slate-700">
                                        {product.product_type || product.category || 'Item'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="text-xs text-indigo-400 font-mono mb-1">{product.sku || `PRD-${product.id.substring?.(0,6) || product.id}`}</div>
                                <h3 className="font-bold text-white text-lg leading-tight mb-2 flex-1">{product.name}</h3>
                                <div className="flex items-end justify-between mt-4">
                                    <div>
                                        <div className="text-xs text-slate-500 mb-0.5">Unit Price</div>
                                        <div className="font-bold text-emerald-400 text-xl">${parseFloat(product.price).toFixed(2)}</div>
                                    </div>
                                    <button 
                                        onClick={() => handleAddToQuote(product)}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-500/25 flex items-center justify-center"
                                        title="Add to Quote"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-xs border-b border-slate-800">
                                <tr>
                                    <th className="p-4">Product Name</th>
                                    <th className="p-4">SKU / Reference</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4 text-right">Price</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredProducts.map(product => (
                                    <tr key={product.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center">
                                                    <Package size={20} className="text-slate-500" />
                                                </div>
                                                <span className="font-semibold text-white">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-400 font-mono">{product.sku || '-'}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded text-xs bg-slate-800 text-slate-300 capitalize">
                                                {product.product_type || product.category || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-bold text-emerald-400">
                                            ${parseFloat(product.price).toFixed(2)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleAddToQuote(product)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-md transition-colors text-xs font-semibold"
                                            >
                                                <Plus size={14} /> Add Quote
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCatalog;
