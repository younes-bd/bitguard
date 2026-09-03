import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ecommerceService } from '../../api/ecommerceService';
import { ShieldCheck, Lock, CheckCircle2, ChevronRight, Truck, MapPin, CreditCard } from 'lucide-react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const PaymentStep = ({ loading, setLoading, item, isProduct, totalPrice, onComplete }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.origin + '/dashboard',
                },
                redirect: 'if_required'
            });

            if (error) {
                toast.error(error.message);
            } else {
                onComplete();
            }
        } catch (error) {
            console.error(error);
            toast.error('Checkout failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <PaymentElement />
            <button
                type="submit"
                disabled={loading || !stripe}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex justify-center items-center gap-2"
            >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Confirm Payment'}
            </button>
        </form>
    );
};

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { product, plan, interval } = location.state || {};
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState('pi_test_secret');
    const [taxRate, setTaxRate] = useState(0);

    const [address, setAddress] = useState({ name: '', street: '', city: '', zip: '', country: '' });
    const [deliveryMethod, setDeliveryMethod] = useState('standard');

    useEffect(() => {
        ecommerceService.getSettings().then(res => {
            if (res.results && res.results.length > 0) {
                setTaxRate(res.results[0].tax_rate || 0);
            }
        }).catch(err => console.error("Could not fetch tax rate", err));
    }, []);

    const item = product || plan;

    if (!item) {
        return <div className="text-center py-20 text-white">No item selected. <a href="/store" className="text-indigo-400 hover:underline">Go back</a></div>;
    }

    const basePrice = product ? parseFloat(product.price) : (interval === 'year' ? parseFloat(plan.price_yearly) : parseFloat(plan.price_monthly));
    const deliveryCost = deliveryMethod === 'express' ? 15.00 : (deliveryMethod === 'standard' ? 5.00 : 0);
    const subtotal = basePrice + deliveryCost;
    const taxAmount = (subtotal * (taxRate / 100)).toFixed(2);
    const totalPrice = (subtotal + parseFloat(taxAmount)).toFixed(2);

    const handleComplete = async () => {
        try {
            await ecommerceService.createOrder({
                product_id: product ? item.id : null,
                plan_id: !product ? item.id : null,
                total_amount: totalPrice,
                status: 'paid',
                payment_status: 'paid',
                fulfillment_status: 'unfulfilled',
                payment_intent_id: 'simulated_pi_123',
                shipping_address: address,
                delivery_method: deliveryMethod
            });
            
            toast.success('Order placed successfully. The system is now processing your order.', {
                style: { borderRadius: '10px', background: '#1e293b', color: '#fff' },
                icon: '🎉'
            });
            navigate('/dashboard');
        } catch (e) {
            toast.error('Failed to create order on server.');
        }
    };

    const steps = [
        { id: 1, name: 'Address', icon: MapPin },
        { id: 2, name: 'Delivery', icon: Truck },
        { id: 3, name: 'Payment', icon: CreditCard }
    ];

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            
            {/* Multi-step Header */}
            <div className="mb-12 flex items-center justify-center">
                {steps.map((s, idx) => (
                    <React.Fragment key={s.id}>
                        <div className={`flex flex-col items-center w-24 ${step >= s.id ? 'text-indigo-400' : 'text-slate-500'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${step >= s.id ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-slate-800'}`}>
                                {step > s.id ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
                            </div>
                            <span className="text-sm font-semibold">{s.name}</span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={`flex-1 h-1 mx-2 rounded ${step > s.id ? 'bg-indigo-600' : 'bg-slate-800'}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Form Steps */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Step 1: Address */}
                    {step === 1 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 animate-in fade-in slide-in-from-right-8 duration-300">
                            <h2 className="text-2xl font-bold text-white mb-6">Shipping Address</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                                    <input value={address.name} onChange={e => setAddress({...address, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-slate-400 mb-1">Street Address</label>
                                    <input value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">City</label>
                                    <input value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">ZIP / Postal Code</label>
                                    <input value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button onClick={() => setStep(2)} disabled={!address.name || !address.street} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold flex items-center transition-all">
                                    Continue to Delivery <ChevronRight size={20} className="ml-2" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Delivery */}
                    {step === 2 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 animate-in fade-in slide-in-from-right-8 duration-300">
                            <h2 className="text-2xl font-bold text-white mb-6">Delivery Method</h2>
                            <div className="space-y-4">
                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${deliveryMethod === 'standard' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-500'}`}>
                                    <input type="radio" name="delivery" value="standard" checked={deliveryMethod === 'standard'} onChange={() => setDeliveryMethod('standard')} className="mr-4 w-5 h-5 text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-600" />
                                    <div className="flex-1">
                                        <div className="text-white font-bold text-lg">Standard Delivery</div>
                                        <div className="text-slate-400 text-sm">3-5 business days</div>
                                    </div>
                                    <div className="text-white font-bold">$5.00</div>
                                </label>
                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${deliveryMethod === 'express' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-500'}`}>
                                    <input type="radio" name="delivery" value="express" checked={deliveryMethod === 'express'} onChange={() => setDeliveryMethod('express')} className="mr-4 w-5 h-5 text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-600" />
                                    <div className="flex-1">
                                        <div className="text-white font-bold text-lg">Express Delivery</div>
                                        <div className="text-slate-400 text-sm">1-2 business days</div>
                                    </div>
                                    <div className="text-white font-bold">$15.00</div>
                                </label>
                                {!product && (
                                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${deliveryMethod === 'digital' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-500'}`}>
                                        <input type="radio" name="delivery" value="digital" checked={deliveryMethod === 'digital'} onChange={() => setDeliveryMethod('digital')} className="mr-4 w-5 h-5 text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-600" />
                                        <div className="flex-1">
                                            <div className="text-white font-bold text-lg">Digital Delivery</div>
                                            <div className="text-slate-400 text-sm">Instant Access via Email</div>
                                        </div>
                                        <div className="text-emerald-400 font-bold">Free</div>
                                    </label>
                                )}
                            </div>
                            <div className="mt-8 flex justify-between">
                                <button onClick={() => setStep(1)} className="text-slate-400 hover:text-white px-4 py-3 rounded-xl font-bold transition-all">Back</button>
                                <button onClick={() => setStep(3)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center transition-all">
                                    Continue to Payment <ChevronRight size={20} className="ml-2" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Payment */}
                    {step === 3 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 animate-in fade-in slide-in-from-right-8 duration-300">
                            <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>
                            <div className="flex items-center gap-4 text-slate-400 mb-8">
                                <Lock size={24} className="text-emerald-500" />
                                <p className="text-sm">Payments are processed securely by Stripe. We do not store your credit card information.</p>
                            </div>
                            
                            {clientSecret && (
                                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#4f46e5', colorBackground: '#1e293b', colorText: '#f8fafc' } } }}>
                                    <PaymentStep loading={loading} setLoading={setLoading} item={item} isProduct={!!product} totalPrice={totalPrice} onComplete={handleComplete} />
                                </Elements>
                            )}

                            <div className="mt-6 flex justify-between items-center border-t border-slate-800 pt-6">
                                <button onClick={() => setStep(2)} className="text-slate-400 hover:text-white px-4 py-2 font-bold transition-all">Back to Delivery</button>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" alt="Powered by Stripe" className="h-6 opacity-30" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 sticky top-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 shadow-inner">
                                {product ? <ShieldCheck size={32} className="text-indigo-400" /> : <ShieldCheck size={32} className="text-emerald-400" />}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white leading-tight mb-1">{item.name}</h3>
                                <p className="text-slate-400 text-sm">
                                    {product ? 'Product Purchase' : `Subscription (${interval})`}
                                </p>
                            </div>
                            <div className="font-bold text-white">
                                ${basePrice.toFixed(2)}
                            </div>
                        </div>

                        <div className="border-t border-slate-800 pt-4 space-y-3 text-sm">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span>${basePrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Delivery</span>
                                <span>${deliveryCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Tax ({taxRate}%)</span>
                                <span>${taxAmount}</span>
                            </div>
                            <div className="flex justify-between items-end text-white pt-4 border-t border-slate-800 mt-2">
                                <span className="font-bold text-lg">Total</span>
                                <span className="font-black text-2xl text-emerald-400">${totalPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
