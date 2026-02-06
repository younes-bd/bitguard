import React, { useEffect, useState } from 'react';
import { storeService } from '../../../shared/core/services/storeService';
import { ShoppingCart, Download, Package, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCatalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    // const { startTrial, buyProduct } = useAuth(); // Handlers moved to Detail

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Mock data if service fails or for demo
            const mockProducts = [
                { id: '1', name: 'SOC Platform', price: 299, product_type: 'subscription', description: 'Complete Security Operations Center.' },
                { id: '2', name: 'CRM Suite', price: 49, product_type: 'subscription', description: 'Customer Relationship Management.' },
                { id: '3', name: 'ERP System', price: 199, product_type: 'subscription', description: 'Enterprise Resource Planning.' },
            ];

            // Try fetch, fallback to mock
            // const data = await storeService.getProducts();
            setProducts(mockProducts);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Handlers moved to ProductDetail page for cleaner flow

    return (
        <div className="space-y-12 pt-24 pb-20 px-6 md:px-12 max-w-[1920px] mx-auto">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    Secure Your Business
                </h1>
                <p className="text-lg text-slate-400">
                    Enterprise-grade cybersecurity tools and hardware for teams of all sizes.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map(product => (
                        <div
                            key={product.id}
                            onClick={() => navigate(`/store/${product.name.toLowerCase().split(' ')[0]}`)} // Navigate Using slug
                            className="group relative bg-slate-900 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all overflow-hidden flex flex-col cursor-pointer"
                        >
                            {/* Product Image Placeholder */}
                            <div className="h-48 bg-slate-800/50 flex items-center justify-center group-hover:bg-slate-800 transition-colors relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-50"></div>
                                {product.file ? (
                                    <img src={product.file} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <Package size={64} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                )}
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex bg-slate-800 rounded px-2 py-1 items-center gap-1">
                                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                            <span className="text-xs font-bold text-white">4.9</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm line-clamp-2 min-h-[40px]">
                                        {product.description || "High-performance security solution."}
                                    </p>
                                </div>

                                <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between">
                                    <div>
                                        <span className="text-2xl font-bold text-white">${product.price}</span>
                                        {product.product_type === 'subscription' && <span className="text-slate-500 text-sm">/mo</span>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductCatalog;


