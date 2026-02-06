import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Shield, Globe, Server, CheckCircle, ArrowRight,
    Download, ShoppingCart, Star, Zap, Lock, Activity
} from 'lucide-react';
import { storeService } from '../../../shared/core/services/storeService';
import { useAuth } from '../../../shared/core/hooks/useAuth';

const ProductDetail = () => {
    const { slug } = useParams(); // Using slug or ID from URL
    const navigate = useNavigate();
    const { startTrial, buyProduct, loading: authLoading, isAuthenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // ... richContent ...

    // ... loadProduct ...

    const handleAction = async (type) => {
        if (actionLoading || authLoading) return;

        // Redirect to register if not logged in
        if (!isAuthenticated) {
            navigate('/register');
            return;
        }

        setActionLoading(true);

        try {
            if (type === 'trial') {
                const result = await startTrial(product.id);
                if (result.success) {
                    const appSlug = product.name.toLowerCase().split(' ')[0];
                    navigate(`/${appSlug}`);
                } else {
                    console.error("Trial start failed", result.error);
                }
            } else {
                // Buy flow
                await buyProduct(product.id);
                const appSlug = product.name.toLowerCase().split(' ')[0];
                navigate(`/${appSlug}`);
            }
        } catch (error) {
            console.error("Action failed", error);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!product) {
        return <div className="p-10 text-center text-white">Product not found.</div>;
    }

    // Get rich content based on simple keyword matching
    const contentKey = Object.keys(richContent).find(k => product.name.toLowerCase().includes(k)) || 'soc';
    const content = richContent[contentKey];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pt-20">

            {/* Hero Section with Glassmorphism */}
            <div className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
                                <Star size={14} className="fill-indigo-400" />
                                <span>Enterprise Edition</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
                                {product.name}
                            </h1>
                            <p className="text-xl text-slate-400 leading-relaxed max-w-lg">
                                {content.tagline}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => handleAction('buy')}
                                disabled={actionLoading}
                                className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                            >
                                {actionLoading ? 'Processing...' : `Buy Now - $${product.price}`}
                                <ArrowRight size={20} />
                            </button>

                            {product.product_type === 'subscription' && (
                                <button
                                    onClick={() => handleAction('trial')}
                                    disabled={actionLoading}
                                    className="px-8 py-4 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                                >
                                    Start Free Trial
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-8 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <Shield size={16} /> 30-Day Money Back
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock size={16} /> Secure Checkout
                            </div>
                        </div>
                    </div>

                    {/* Right Side Visual/Card */}
                    <div className="relative">
                        <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl transform hover:rotate-1 transition-transform duration-500">
                            {/* Mock UI Representation */}
                            <div className="space-y-6 opacity-90">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="h-4 w-32 bg-white/20 rounded"></div>
                                    <div className="h-8 w-8 bg-indigo-500 rounded-full"></div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-24 bg-white/5 rounded-xl border border-white/5"></div>
                                    <div className="h-24 bg-white/5 rounded-xl border border-white/5"></div>
                                    <div className="h-24 bg-white/5 rounded-xl border border-white/5"></div>
                                </div>
                                <div className="h-48 bg-white/5 rounded-xl border border-white/5"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    {content.features.map((f, i) => (
                        <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:bg-slate-800/50 transition-colors">
                            <div className="h-12 w-12 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 mb-4">
                                <f.icon size={24} />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2">{f.val}</h3>
                            <p className="text-slate-400">{f.title}</p>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Why Industry Leaders Choose {product.name}</h2>
                        <div className="space-y-4">
                            {content.benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800">
                                    <CheckCircle className="text-green-500 shrink-0" />
                                    <span className="text-slate-200 font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-slate-700 h-96 flex items-center justify-center text-slate-600">
                        {/* Placeholder for Screenshot */}
                        <span className="text-lg font-mono">App Interface Preview</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
