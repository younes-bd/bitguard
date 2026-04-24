import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Server, Cloud, Headphones, Package, ArrowRight, Search, Loader2 } from 'lucide-react';
import client from '../../../core/api/client';

const typeIcons = {
    digital: ShieldCheck,
    subscription: Cloud,
    physical: Server,
    service_bundle: Headphones,
};

const typeLabels = {
    digital: 'Software License',
    subscription: 'Managed Service',
    physical: 'Hardware',
    service_bundle: 'Service Bundle',
};

const ProductCatalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeType, setActiveType] = useState('');

    useEffect(() => {
        client.get('store/products/')
            .then(res => {
                const data = res.data?.data || res.data?.results || res.data || [];
                setProducts(Array.isArray(data) ? data : []);
            })
            .catch(err => console.error('Failed to load catalog:', err))
            .finally(() => setLoading(false));
    }, []);

    const types = [...new Set(products.map(p => p.product_type).filter(Boolean))];

    const filtered = products.filter(p => {
        const matchesSearch = (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (p.description || '').toLowerCase().includes(search.toLowerCase());
        const matchesType = !activeType || p.product_type === activeType;
        return matchesSearch && matchesType && (p.status === 'active' || p.is_active);
    });

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Hero */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                        IT Solutions Catalog
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
                        Enterprise-grade cybersecurity, managed IT, and infrastructure solutions trusted by businesses worldwide.
                    </p>
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search solutions..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-6 -mt-6 mb-10 relative z-10">
                <div className="flex flex-wrap gap-2 justify-center">
                    <button
                        onClick={() => setActiveType('')}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${!activeType
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-500'
                        }`}
                    >
                        All Solutions
                    </button>
                    {types.map(type => (
                        <button
                            key={type}
                            onClick={() => setActiveType(type)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${activeType === type
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-500'
                            }`}
                        >
                            {typeLabels[type] || type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 text-slate-500 dark:text-slate-400">
                        <Package size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                        <p className="text-lg">No solutions match your search criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(product => {
                            const Icon = typeIcons[product.product_type] || Package;
                            return (
                                <Link
                                    to={`/store/${product.slug}`}
                                    key={product.id}
                                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <Icon size={24} />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                            {typeLabels[product.product_type] || product.product_type}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2">
                                        {product.description || 'Enterprise-grade solution for modern businesses.'}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                                            {product.price > 0 ? formatter.format(product.price) : 'Contact Sales'}
                                            {product.product_type === 'subscription' && product.price > 0 && (
                                                <span className="text-sm font-normal text-slate-400">/mo</span>
                                            )}
                                        </span>
                                        <span className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 font-semibold group-hover:gap-2 transition-all">
                                            Learn More <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCatalog;
