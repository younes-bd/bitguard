import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { storeService } from '../../../shared/core/services/storeService';
import { ShieldCheck, CreditCard, Lock } from 'lucide-react';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { product, plan, interval } = location.state || {};
    const [loading, setLoading] = useState(false);

    const item = product || plan;

    if (!item) {
        return <div className="text-center py-20 text-white">No item selected. <a href="/store/products" className="text-indigo-400 hover:underline">Go back</a></div>;
    }

    const price = product ? product.price : (interval === 'year' ? plan.price_yearly : plan.price_monthly);

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let data;
            if (product) {
                data = await storeService.checkout(product.id, {
                    success_url: window.location.origin + '/dashboard',
                    cancel_url: window.location.origin + '/store/products'
                });
            } else if (plan) {
                data = await storeService.subscribe(plan.id, {
                    success_url: window.location.origin + '/dashboard',
                    cancel_url: window.location.origin + '/store/pricing'
                });
            }

            if (data?.checkout_url) {
                // In a real app with Stripe, we redirect
                window.location.href = data.checkout_url;
            } else {
                alert('Order placed successfully (Internal Flow).');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
            alert('Checkout failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column: Summary */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 h-fit">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                <div className="flex items-start gap-4 mb-8">
                    <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center">
                        {product ? <ShieldCheck size={32} className="text-indigo-400" /> : <ShieldCheck size={32} className="text-emerald-400" />}
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">{item.name}</h3>
                        <p className="text-slate-400 text-sm">
                            {product ? 'One-time purchase' : `BitGuard Platform (${interval === 'year' ? 'Annual' : 'Monthly'})`}
                        </p>
                    </div>
                    <div className="ml-auto font-bold text-white text-lg">
                        ${price}
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-slate-400">
                        <span>Subtotal</span>
                        <span>${price}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                        <span>Tax</span>
                        <span>$0.00</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-slate-800 mt-2">
                        <span>Total</span>
                        <span>${price}</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Payment Form (Mock) */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>
                <form onSubmit={handleCheckout} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Cardholder Name</label>
                        <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" placeholder="John Doe" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Card Number</label>
                        <div className="relative">
                            <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 pl-10" placeholder="0000 0000 0000 0000" required />
                            <CreditCard className="absolute left-3 top-3.5 text-slate-500" size={18} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Expiry Date</label>
                            <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" placeholder="MM/YY" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">CVC</label>
                            <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" placeholder="123" required />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex justify-center items-center gap-2 group"
                    >
                        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : (
                            <>
                                <Lock size={18} className="group-hover:scale-110 transition-transform" />
                                Pay ${price}
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
                        <Lock size={12} /> Payments are secure and encrypted.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Checkout;


