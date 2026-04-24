import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Server, Cloud, Headphones, Package, ArrowLeft, Check, Loader2, ShoppingCart } from 'lucide-react';
import client from '../../../core/api/client';
import { storeService } from '../../../core/api/storeService';
import toast from 'react-hot-toast';

const typeLabels = {
    digital: 'Software License',
    subscription: 'Managed Service',
    physical: 'Hardware',
    service_bundle: 'Service Bundle',
};

const typeIcons = {
    digital: ShieldCheck,
    subscription: Cloud,
    physical: Server,
    service_bundle: Headphones,
};

const ProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get(`store/products/`, { params: { slug } })
            .then(res => {
                const data = res.data?.data || res.data?.results || res.data || [];
                const items = Array.isArray(data) ? data : [];
                const found = items.find(p => p.slug === slug);
                setProduct(found || null);
            })
            .catch(err => console.error('Failed to load product:', err))
            .finally(() => setLoading(false));
    }, [slug]);

    const handleCheckout = async () => {
        if (!product) return;
        try {
            const result = await storeService.checkout(product.id, {
                success_url: `${window.location.origin}/store?success=true`,
                cancel_url: `${window.location.origin}/store/${product.slug}`,
            });
            if (result?.checkout_url) {
                window.location.href = result.checkout_url;
            } else {
                toast.success('Procurement request submitted');
            }
        } catch (error) {
            console.error('Checkout failed:', error);
            toast.error('Please sign in to proceed with procurement.');
        }
    };

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center text-center px-6">
                <Package size={64} className="text-slate-300 dark:text-slate-600 mb-6" />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Solution Not Found</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-6">The product or service you're looking for doesn't exist or has been archived.</p>
                <Link to="/store" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    ← Back to Catalog
                </Link>
            </div>
        );
    }

    const Icon = typeIcons[product.product_type] || Package;
    const features = Array.isArray(product.features) ? product.features : [];
    const specs = product.specifications && typeof product.specifications === 'object' ? product.specifications : {};

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Breadcrumb */}
            <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <Link to="/store" className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                        <ArrowLeft size={16} /> Back to Catalog
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    <Icon size={24} />
                                </div>
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wide">
                                    {typeLabels[product.product_type] || product.product_type}
                                </span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                {product.name}
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                {product.description || 'Enterprise-grade solution designed for modern IT infrastructure.'}
                            </p>
                        </div>

                        {/* Features */}
                        {features.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Key Features</h2>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                            <Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Specifications */}
                        {Object.keys(specs).length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Specifications</h2>
                                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                                    {Object.entries(specs).map(([key, value], i) => (
                                        <div key={key} className={`flex justify-between px-5 py-3 ${i > 0 ? 'border-t border-slate-100 dark:border-slate-800' : ''}`}>
                                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize">{key.replace(/_/g, ' ')}</span>
                                            <span className="text-sm text-slate-900 dark:text-white font-medium">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Pricing Card */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
                            <div className="text-center mb-6">
                                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
                                    {product.price > 0 ? formatter.format(product.price) : 'Contact Sales'}
                                </div>
                                {product.product_type === 'subscription' && product.price > 0 && (
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">per month, billed annually</p>
                                )}
                                {product.discount_price && (
                                    <p className="text-sm text-emerald-500 font-medium mt-1">
                                        Save {formatter.format(product.price - product.discount_price)}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 mb-4"
                            >
                                <ShoppingCart size={20} />
                                {product.product_type === 'subscription' ? 'Start Subscription' : 'Procure Now'}
                            </button>

                            <button
                                onClick={() => navigate('/contact')}
                                className="w-full py-3 bg-transparent border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Request a Quote
                            </button>

                            <div className="mt-6 space-y-3 text-sm text-slate-500 dark:text-slate-400">
                                {product.brand && (
                                    <div className="flex justify-between">
                                        <span>Brand</span>
                                        <span className="text-slate-900 dark:text-white font-medium">{product.brand}</span>
                                    </div>
                                )}
                                {product.vendor && (
                                    <div className="flex justify-between">
                                        <span>Distributor</span>
                                        <span className="text-slate-900 dark:text-white font-medium">{product.vendor}</span>
                                    </div>
                                )}
                                {product.license_type && (
                                    <div className="flex justify-between">
                                        <span>License</span>
                                        <span className="text-slate-900 dark:text-white font-medium">{product.license_type}</span>
                                    </div>
                                )}
                                {product.warranty_months && (
                                    <div className="flex justify-between">
                                        <span>Warranty</span>
                                        <span className="text-slate-900 dark:text-white font-medium">{product.warranty_months} months</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
