import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { storeService } from '../../../../core/api/storeService';
import { ShieldCheck, Lock } from 'lucide-react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ loading, setLoading, item, isProduct, totalPrice }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        try {
            // First we would create PaymentIntent on backend, get client_secret
            // Then confirm payment. For now, since API expects it, we simulate:
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.origin + '/dashboard',
                },
                redirect: 'if_required'
            });

            if (error) {
                alert(error.message);
            } else {
                // Payment successful - notify backend to trigger workflows
                await storeService.createOrder({
                    product_id: isProduct ? item.id : null,
                    plan_id: !isProduct ? item.id : null,
                    total_amount: totalPrice,
                    status: 'paid',
                    payment_status: 'paid',
                    fulfillment_status: 'unfulfilled',
                    payment_intent_id: 'simulated_pi_123'
                });
                
                alert('Order placed successfully. The system is now provisioning your services.');
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            <button
                type="submit"
                disabled={loading || !stripe}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex justify-center items-center gap-2"
            >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Pay Now'}
            </button>
        </form>
    );
};

const Checkout = () => {
    const location = useLocation();
    const { product, plan, interval } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [taxRate, setTaxRate] = useState(0);

    useEffect(() => {
        // Fetch StoreSetting to get tax rate
        storeService.getSettings().then(res => {
            if (res.results && res.results.length > 0) {
                setTaxRate(res.results[0].tax_rate || 0);
            }
        }).catch(err => console.error("Could not fetch tax rate", err));

        // Create PaymentIntent to get clientSecret (mocked or actual API call)
        // In a real implementation this would hit /api/store/cart/checkout/ or similar
        // We'll set a mock secret if backend isn't ready
        setClientSecret('pi_test_secret');
    }, []);

    const item = product || plan;

    if (!item) {
        return <div className="text-center py-20 text-white">No item selected. <a href="/store/products" className="text-indigo-400 hover:underline">Go back</a></div>;
    }

    const basePrice = product ? parseFloat(product.price) : (interval === 'year' ? parseFloat(plan.price_yearly) : parseFloat(plan.price_monthly));
    const taxAmount = (basePrice * (taxRate / 100)).toFixed(2);
    const totalPrice = (basePrice + parseFloat(taxAmount)).toFixed(2);

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
                        ${basePrice.toFixed(2)}
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-slate-400">
                        <span>Subtotal</span>
                        <span>${basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                        <span>Tax ({taxRate}%)</span>
                        <span>${taxAmount}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-slate-800 mt-2">
                        <span>Total</span>
                        <span>${totalPrice}</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Payment Details */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>
                <div className="bg-slate-900 border border-slate-700 p-8 rounded-xl space-y-6">
                    <div className="flex items-center gap-4 text-slate-400 mb-6">
                        <Lock size={24} className="text-emerald-500" />
                        <p className="text-sm">
                            Payments are processed securely by Stripe. We do not store your credit card information.
                        </p>
                    </div>

                    {clientSecret && (
                        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                            <CheckoutForm loading={loading} setLoading={setLoading} item={item} isProduct={!!product} totalPrice={totalPrice} />
                        </Elements>
                    )}
                    
                    <div className="flex justify-center gap-4 pt-4">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" alt="Powered by Stripe" className="h-6 opacity-50" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;




